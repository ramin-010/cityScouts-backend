const express = require('express');
const router = express.Router();
const { searchSuggest } = require('../controllers/search.controller');
const { searchValidationRules } = require('../middleware/validators');
const { validate } = require('../middleware/validate');

// @route   GET /api/v1/search-suggest
// @desc    Search across attractions, dining, and events
// @access  Public
router.get('/search-suggest', searchValidationRules, validate, searchSuggest);

module.exports = router;
