const express = require('express');
const StringController = require('../controllers/stringController');

const router = express.Router();

/**
 * Route definitions
 * Order matters: more specific routes must come before generic ones
 */

// Natural language filtering (must come before GET /strings to avoid conflict)
// GET /strings/filter-by-natural-language?query=...
router.get('/strings/filter-by-natural-language', StringController.filterByNaturalLanguage);

// Create new string
// POST /strings
router.post('/strings', StringController.createString);

// Get all strings with optional filtering
// GET /strings?is_palindrome=true&min_length=5&...
router.get('/strings', StringController.getAllStrings);

// Get specific string by value
// GET /strings/{string_value}
router.get('/strings/:string_value', StringController.getStringByValue);

// Delete string by value
// DELETE /strings/{string_value}
router.delete('/strings/:string_value', StringController.deleteString);

module.exports = router;