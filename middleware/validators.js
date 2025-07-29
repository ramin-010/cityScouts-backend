const { check } = require('express-validator');

// Search validation rules
exports.searchValidationRules = [
  check('q')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
];
