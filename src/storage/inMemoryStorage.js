/**
 * In-memory storage for string data
 * Uses two Maps for efficient lookups:
 * - byHash: lookup by SHA-256 hash (id)
 * - byValue: lookup by original string value
 */
class InMemoryStorage {
  constructor() {
    this.byHash = new Map();
    this.byValue = new Map();
  }

  /**
   * Check if string exists (by value)
   * Requirement: Return 409 if string already exists
   */
  exists(value) {
    return this.byValue.has(value);
  }

  /**
   * Store a new string entry
   */
  save(entry) {
    this.byHash.set(entry.id, entry);
    this.byValue.set(entry.value, entry);
  }

  /**
   * Retrieve by string value
   * Requirement: GET /strings/{string_value}
   */
  findByValue(value) {
    return this.byValue.get(value);
  }

  /**
   * Retrieve all entries
   * Requirement: GET /strings with filtering
   */
  findAll() {
    return Array.from(this.byHash.values());
  }

  /**
   * Delete by string value
   * Requirement: DELETE /strings/{string_value}
   */
  delete(value) {
    const entry = this.byValue.get(value);
    if (entry) {
      this.byHash.delete(entry.id);
      this.byValue.delete(value);
      return true;
    }
    return false;
  }

  /**
   * Get count of stored strings
   */
  count() {
    return this.byHash.size;
  }
}

// Singleton instance
const storage = new InMemoryStorage();

module.exports = storage;