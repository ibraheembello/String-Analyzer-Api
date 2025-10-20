/**
 * Natural Language Processing Service
 * Requirement: Parse natural language queries into filter objects
 * Support examples:
 * - "all single word palindromic strings" → word_count=1, is_palindrome=true
 * - "strings longer than 10 characters" → min_length=11
 * - "palindromic strings that contain the first vowel" → is_palindrome=true, contains_character=a
 * - "strings containing the letter z" → contains_character=z
 */
class NLPService {
  /**
   * Parse natural language query into structured filters
   */
  static parseQuery(query) {
    const filters = {};
    const normalizedQuery = query.toLowerCase();

    // Pattern: "single word" or "one word"
    if (/\b(single|one)\s+word\b/.test(normalizedQuery)) {
      filters.word_count = 1;
    }

    // Pattern: "X words" where X is a number
    const wordCountMatch = normalizedQuery.match(/\b(\d+)\s+words?\b/);
    if (wordCountMatch) {
      filters.word_count = parseInt(wordCountMatch[1], 10);
    }

    // Pattern: "palindromic" or "palindrome"
    if (/\bpalindrom(ic|e)\b/.test(normalizedQuery)) {
      filters.is_palindrome = true;
    }

    // Pattern: "longer than X" or "more than X characters"
    const longerThanMatch = normalizedQuery.match(/\b(?:longer|more)\s+than\s+(\d+)(?:\s+characters?)?\b/);
    if (longerThanMatch) {
      filters.min_length = parseInt(longerThanMatch[1], 10) + 1;
    }

    // Pattern: "shorter than X" or "less than X characters"
    const shorterThanMatch = normalizedQuery.match(/\b(?:shorter|less)\s+than\s+(\d+)(?:\s+characters?)?\b/);
    if (shorterThanMatch) {
      filters.max_length = parseInt(shorterThanMatch[1], 10) - 1;
    }

    // Pattern: "at least X characters"
    const atLeastMatch = normalizedQuery.match(/\bat\s+least\s+(\d+)(?:\s+characters?)?\b/);
    if (atLeastMatch) {
      filters.min_length = parseInt(atLeastMatch[1], 10);
    }

    // Pattern: "at most X characters"
    const atMostMatch = normalizedQuery.match(/\bat\s+most\s+(\d+)(?:\s+characters?)?\b/);
    if (atMostMatch) {
      filters.max_length = parseInt(atMostMatch[1], 10);
    }

    // Pattern: "containing/contains (the letter/character) X"
    const containsMatch = normalizedQuery.match(/\bcontain(?:s|ing)?(?:\s+(?:the\s+)?(?:letter|character))?\s+([a-z])\b/);
    if (containsMatch) {
      filters.contains_character = containsMatch[1];
    }

    // Pattern: "first vowel" (special case for 'a')
    if (/\bfirst\s+vowel\b/.test(normalizedQuery)) {
      filters.contains_character = 'a';
    }

    // Pattern: "second vowel" (special case for 'e')
    if (/\bsecond\s+vowel\b/.test(normalizedQuery)) {
      filters.contains_character = 'e';
    }

    // Check if we found any filters
    if (Object.keys(filters).length === 0) {
      throw new Error('Unable to parse natural language query');
    }

    // Check for conflicting filters
    if (filters.min_length && filters.max_length && filters.min_length > filters.max_length) {
      throw new Error('Query parsed but resulted in conflicting filters: min_length > max_length');
    }

    return filters;
  }

  /**
   * Format the interpreted query response
   * Requirement: Return interpreted_query with original and parsed_filters
   */
  static formatInterpretedQuery(originalQuery, parsedFilters) {
    return {
      original: originalQuery,
      parsed_filters: parsedFilters
    };
  }
}

module.exports = NLPService;