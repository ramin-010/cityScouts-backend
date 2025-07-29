const Dining = require('../models/Dining');
const ErrorResponse = require('../utils/errorResponse');
const {getOne, adminGetAll,adminGetOne, createOne, updateOne, hardDeleteOne, softDeletOne} = require('../utils/crudFactory')

const getDinings = async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 9,
        category,
        prices,
        rating,
        features = [],
        search = '',
      } = req.query;
  
      const queryObj = { isDeleted: false };
  
      if (search.trim()) {
        queryObj.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { features: { $regex: search, $options: 'i' } },
        ];
      }
  
      // Price filter
      const priceObj = {
        Budget: '$',
        Moderate: '$$',
        Expensive: '$$$',
      };
  
      if (category && category !== 'All') queryObj.category = category;
      if (prices && prices !== 'All Prices') queryObj.priceRange = priceObj[prices];
  
      // Rating filter (>= selected rating)
      if (rating && rating !== 'All Ratings') {
        const ratingNum = parseFloat(rating);
        if (!isNaN(ratingNum)) {
          queryObj.rating = { $gte: ratingNum };
        }
      }
  
      // Features filter
      if (features && features.length > 0) {
        const featureArray = Array.isArray(features) ? features : [features];
        queryObj.features = { $in: featureArray };
      }
  
        console.log("this is the final query", queryObj)
        const dinings = await Dining.find(queryObj)
            .sort({_id : 1})
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));
    
        const total = await Dining.countDocuments(queryObj);
        console.log("this is the total", total)
        res.status(200).json({
            success : true,
            data : dinings,
            total : total,
            page: parseInt(page),
        })

    }catch(err){
        next(err);
    }
}


//@desc : get the dining by id/slug
//@route : /api/dining/:id
//access : public
const getDining = getOne(Dining, 'reviews');


//@desc get dining for admin
//route api/admin/getdining
//access private
const adminGetDinings = adminGetAll(Dining)

const adminGetDining = adminGetOne(Dining)

//@desc : add dining
//@route : /api/admin/dining/
//access : private/admin
const createDining = createOne(Dining);

//@desc : update dining
//@route : /api/admin/dining/:id
//access : private/admin
const updateDining = updateOne(Dining)

//@desc : hard delete
//@route : /api/admin/dining/hardDelete/:id
//access : private/admin/
const hardDeleteDining =  hardDeleteOne(Dining)


//@desc : soft delete
//@route : /api/admin/dining/softDelete/:id
//access : private/admin

const softDeletDining = softDeletOne(Dining);

module.exports = {getDinings, getDining, adminGetDinings,adminGetDining,createDining,updateDining ,hardDeleteDining, softDeletDining}