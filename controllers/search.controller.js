const Attraction = require('../models/Attraction');
const Dining = require('../models/Dining');
const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Search across attractions, dining, and events
// @route   GET /api/v1/search-suggest
// @access  Public
exports.searchSuggest = async (req, res, next) => {
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Create search query with text search and case-insensitive regex for better matching
    const searchQuery = {
      $text: { $search: q }
    };

    // Projection to include only required fields
    const projection = {
      _id: 1,
      name: 1,
      category: 1,
      'location.address': 1,
      slug: 1,
      // Add a relevance score for sorting
      score: { $meta: 'textScore' }
    };

    // Options for the query
    const options = {
      limit: 5,
      sort: { score: { $meta: 'textScore' } },
      projection
    };

    // Perform search across all collections in parallel
    const [attractions, dining, events] = await Promise.all([
      Attraction.find(searchQuery, projection, options).lean().then(docs => docs.map(doc => ({...doc, _model : 'attractions'}))),
      Dining.find(searchQuery, projection, options).lean().then(docs => docs.map(doc => ({...doc, _model : 'dinings'}))),
      Event.find(searchQuery, projection, options).lean().then(docs => docs.map(doc => ({...doc, _model : 'events'})))
    ]);

    // Combine and sort all results by relevance score
    const allResults = [...attractions, ...dining, ...events]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 7);

    // Format the response
    const formattedResults = allResults.map(item => ({
      _id: item._id,
      name: item.name,
      category: Array.isArray(item.category) ? item.category : [item.category],
      location: {
        address: item.location?.address || ''
      },
      slug: item.slug,
      model : item._model
    }));

    res.status(200).json({
      success: true,
      count: formattedResults.length,
      data: formattedResults
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create text indexes for search
// @note    Run this once to create the necessary indexes
exports.createSearchIndexes = async () => {
  try {
    // Create text indexes on the required fields for each collection
    await Attraction.collection.createIndex(
      {
        name: 'text',
        description: 'text',
        category: 'text',
        'location.address': 'text'
      },
      {
        name: 'attraction_search_index',
        weights: {
          name: 10,  // Higher weight for name field
          'location.address': 5,
          category: 3,
          description: 1
        }
      }
    );

    await Dining.collection.createIndex(
      {
        name: 'text',
        description: 'text',
        cuisine: 'text',
        category: 'text',
        'location.address': 'text'
      },
      {
        name: 'dining_search_index',
        weights: {
          name: 10,
          'location.address': 5,
          cuisine: 4,
          category: 3,
          description: 1
        }
      }
    );

    await Event.collection.createIndex(
      {
        name: 'text',
        description: 'text',
        category: 'text',
        'location.address': 'text'
      },
      {
        name: 'event_search_index',
        weights: {
          name: 10,
          'location.address': 5,
          category: 3,
          description: 1
        }
      }
    );

    console.log('Search indexes created successfully');
  } catch (err) {
    console.error('Error creating search indexes:', err);
    throw err;
  }
};