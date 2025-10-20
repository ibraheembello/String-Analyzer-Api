const crypto = require('crypto');

/**
 * Computes all required properties for a given string
 * Requirement: Compute length, is_palindrome, unique_characters, 
 * word_count, sha256_hash, character_frequency_map
 */
class StringAnalyzer {
  /**
   * Main analysis function - computes all properties
   */
  static analyzeString(value) {
    return {
      length: this.computeLength(value),
      is_palindrome: this.isPalindrome(value),
      unique_characters: this.countUniqueCharacters(value),
      word_count: this.countWords(value),
      sha256_hash: this.computeSHA256(value),
      character_frequency_map: this.buildCharacterFrequencyMap(value)
    };
  }

  /**
   * Requirement: Number of characters in the string
   */
  static computeLength(value) {
    return value.length;
  }

  /**
   * Requirement: Boolean indicating if string reads same forwards and backwards
   * Case-insensitive comparison
   */
  static isPalindrome(value) {
    const normalized = value.toLowerCase();
    const reversed = normalized.split('').reverse().join('');
    return normalized === reversed;
  }

  /**
   * Requirement: Count of distinct characters
   */
  static countUniqueCharacters(value) {
    const uniqueChars = new Set(value);
    return uniqueChars.size;
  }

  /**
   * Requirement: Number of words separated by whitespace
   */
  static countWords(value) {
    // Split by whitespace and filter out empty strings
    const words = value.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  /**
   * Requirement: SHA-256 hash for unique identification
   */
  static computeSHA256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  /**
   * Requirement: Object mapping each character to its occurrence count
   */
  static buildCharacterFrequencyMap(value) {
    const frequencyMap = {};
    for (const char of value) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }
    return frequencyMap;
  }
}

module.exports = StringAnalyzer;