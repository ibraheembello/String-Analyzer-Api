/**
 * Validation utilities for request data
 * Requirement: Handle 400 Bad Request and 422 Unprocessable Entity errors
 */
class Validators {
  /**
   * Validate POST /strings request body
   * Requirement: 400 if missing "value", 422 if wrong type
   */
  static validateCreateRequest(body) {
    // Check if body exists and has value field
    if (!body || !body.hasOwnProperty('value')) {
      return {
        valid: false,
        status: 400,
        message: 'Missing required field: value'
      };
    }

    // Check if value is a string
    if (typeof body.value !== 'string') {
      return {
        valid: false,
        status: 422,
        message: 'Invalid data type for "value": must be string'
      };
    }

    return { valid: true };
  }

  /**
   * Validate query parameters for GET /strings
   * Requirement: 400 Bad Request for invalid parameter values or types
   */
  static validateQueryParams(query) {
    const errors = [];

    // Validate is_palindrome (boolean)
    if (query.is_palindrome !== undefined) {
      if (query.is_palindrome !== 'true' && query.is_palindrome !== 'false') {
        errors.push('is_palindrome must be "true" or "false"');
      }
    }

    // Validate min_length (integer)
    if (query.min_length !== undefined) {
      const minLength = parseInt(query.min_length, 10);
      if (isNaN(minLength) || minLength < 0) {
        errors.push('min_length must be a non-negative integer');
      }
    }

    // Validate max_length (integer)
    if (query.max_length !== undefined) {
      const maxLength = parseInt(query.max_length, 10);
      if (isNaN(maxLength) || maxLength < 0) {
        errors.push('max_length must be a non-negative integer');
      }
    }

    // Validate word_count (integer)
    if (query.word_count !== undefined) {
      const wordCount = parseInt(query.word_count, 10);
      if (isNaN(wordCount) || wordCount < 0) {
        errors.push('word_count must be a non-negative integer');
      }
    }

    // Validate contains_character (single character)
    if (query.contains_character !== undefined) {
      if (typeof query.contains_character !== 'string' || query.contains_character.length !== 1) {
        errors.push('contains_character must be a single character');
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        status: 400,
        message: errors.join('; ')
      };
    }

    return { valid: true };
  }

  /**
   * Validate natural language query
   * Requirement: 400 if unable to parse
   */
  static validateNaturalLanguageQuery(query) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return {
        valid: false,
        status: 400,
        message: 'Query parameter "query" is required and must be a non-empty string'
      };
    }

    return { valid: true };
  }
}

module.exports = Validators;