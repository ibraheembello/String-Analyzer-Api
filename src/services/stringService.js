const StringAnalyzer = require('../utils/stringAnalyzer');
const storage = require('../storage/inMemoryStorage');

/**
 * Business logic for string operations
 * Handles all CRUD operations and filtering
 */
class StringService {
  /**
   * Create and analyze a new string
   * Requirement: POST /strings
   * Returns: 409 if exists, 201 with full entry if successful
   */
  static createString(value) {
    // Check if string already exists
    if (storage.exists(value)) {
      throw {
        status: 409,
        message: 'String already exists in the system'
      };
    }

    // Analyze the string
    const properties = StringAnalyzer.analyzeString(value);

    // Create entry object
    const entry = {
      id: properties.sha256_hash,
      value: value,
      properties: properties,
      created_at: new Date().toISOString()
    };

    // Store the entry
    storage.save(entry);

    return entry;
  }

  /**
   * Retrieve a specific string by value
   * Requirement: GET /strings/{string_value}
   * Returns: 404 if not found, 200 with entry if successful
   */
  static getStringByValue(value) {
    const entry = storage.findByValue(value);
    
    if (!entry) {
      throw {
        status: 404,
        message: 'String does not exist in the system'
      };
    }

    return entry;
  }

  /**
   * Retrieve all strings with optional filtering
   * Requirement: GET /strings with query parameters
   */
  static getAllStrings(filters = {}) {
    let results = storage.findAll();

    // Apply filters
    if (filters.is_palindrome !== undefined) {
      const isPalindrome = filters.is_palindrome === 'true';
      results = results.filter(entry => entry.properties.is_palindrome === isPalindrome);
    }

    if (filters.min_length !== undefined) {
      const minLength = parseInt(filters.min_length, 10);
      results = results.filter(entry => entry.properties.length >= minLength);
    }

    if (filters.max_length !== undefined) {
      const maxLength = parseInt(filters.max_length, 10);
      results = results.filter(entry => entry.properties.length <= maxLength);
    }

    if (filters.word_count !== undefined) {
      const wordCount = parseInt(filters.word_count, 10);
      results = results.filter(entry => entry.properties.word_count === wordCount);
    }

    if (filters.contains_character !== undefined) {
      const char = filters.contains_character;
      results = results.filter(entry => entry.value.includes(char));
    }

    // Build filters_applied object (only include defined filters)
    const filtersApplied = {};
    if (filters.is_palindrome !== undefined) {
      filtersApplied.is_palindrome = filters.is_palindrome === 'true';
    }
    if (filters.min_length !== undefined) {
      filtersApplied.min_length = parseInt(filters.min_length, 10);
    }
    if (filters.max_length !== undefined) {
      filtersApplied.max_length = parseInt(filters.max_length, 10);
    }
    if (filters.word_count !== undefined) {
      filtersApplied.word_count = parseInt(filters.word_count, 10);
    }
    if (filters.contains_character !== undefined) {
      filtersApplied.contains_character = filters.contains_character;
    }

    return {
      data: results,
      count: results.length,
      filters_applied: filtersApplied
    };
  }

  /**
   * Delete a string by value
   * Requirement: DELETE /strings/{string_value}
   * Returns: 404 if not found, success if deleted
   */
  static deleteString(value) {
    const deleted = storage.delete(value);
    
    if (!deleted) {
      throw {
        status: 404,
        message: 'String does not exist in the system'
      };
    }

    return true;
  }
}

module.exports = StringService;