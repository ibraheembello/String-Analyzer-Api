const StringService = require('../services/stringService');
const NLPService = require('../services/nlpService');
const Validators = require('../utils/validators');

/**
 * Controller handling HTTP requests and responses
 * Maps routes to service layer and handles response formatting
 */
class StringController {
  /**
   * POST /strings
   * Requirement: Create and analyze a new string
   * Status codes: 201, 400, 409, 422
   */
  static createString(req, res, next) {
    try {
      // Validate request body
      const validation = Validators.validateCreateRequest(req.body);
      if (!validation.valid) {
        return res.status(validation.status).json({
          error: validation.message
        });
      }

      // Create the string
      const entry = StringService.createString(req.body.value);

      // Return 201 Created
      return res.status(201).json(entry);

    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /strings/{string_value}
   * Requirement: Retrieve a specific string
   * Status codes: 200, 404
   */
  static getStringByValue(req, res, next) {
    try {
      const stringValue = req.params.string_value;
      const entry = StringService.getStringByValue(stringValue);

      return res.status(200).json(entry);

    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /strings
   * Requirement: Retrieve all strings with filtering
   * Status codes: 200, 400
   */
  static getAllStrings(req, res, next) {
    try {
      // Validate query parameters
      const validation = Validators.validateQueryParams(req.query);
      if (!validation.valid) {
        return res.status(validation.status).json({
          error: validation.message
        });
      }

      // Get filtered results
      const result = StringService.getAllStrings(req.query);

      return res.status(200).json(result);

    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /strings/filter-by-natural-language
   * Requirement: Filter using natural language query
   * Status codes: 200, 400, 422
   */
  static filterByNaturalLanguage(req, res, next) {
    try {
      const query = req.query.query;

      // Validate query parameter
      const validation = Validators.validateNaturalLanguageQuery(query);
      if (!validation.valid) {
        return res.status(validation.status).json({
          error: validation.message
        });
      }

      // Parse natural language query
      let parsedFilters;
      try {
        parsedFilters = NLPService.parseQuery(query);
      } catch (parseError) {
        // Determine if it's a parsing error or conflicting filters
        if (parseError.message.includes('conflicting')) {
          return res.status(422).json({
            error: parseError.message
          });
        } else {
          return res.status(400).json({
            error: parseError.message
          });
        }
      }

      // Convert parsed filters to the format expected by StringService
      const serviceFilters = {};
      if (parsedFilters.word_count !== undefined) {
        serviceFilters.word_count = parsedFilters.word_count.toString();
      }
      if (parsedFilters.is_palindrome !== undefined) {
        serviceFilters.is_palindrome = parsedFilters.is_palindrome.toString();
      }
      if (parsedFilters.min_length !== undefined) {
        serviceFilters.min_length = parsedFilters.min_length.toString();
      }
      if (parsedFilters.max_length !== undefined) {
        serviceFilters.max_length = parsedFilters.max_length.toString();
      }
      if (parsedFilters.contains_character !== undefined) {
        serviceFilters.contains_character = parsedFilters.contains_character;
      }

      // Get filtered results
      const result = StringService.getAllStrings(serviceFilters);

      // Format response with interpreted query
      const response = {
        data: result.data,
        count: result.count,
        interpreted_query: NLPService.formatInterpretedQuery(query, parsedFilters)
      };

      return res.status(200).json(response);

    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /strings/{string_value}
   * Requirement: Delete a string
   * Status codes: 204, 404
   */
  static deleteString(req, res, next) {
    try {
      const stringValue = req.params.string_value;
      StringService.deleteString(stringValue);

      // Return 204 No Content with empty body
      return res.status(204).send();

    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          error: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = StringController;