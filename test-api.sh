#!/bin/bash

# String Analyzer API Test Script
# This script tests all API endpoints with various scenarios

BASE_URL="http://localhost:3000"
echo "Testing String Analyzer API at $BASE_URL"
echo "=============================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check (GET /)"
curl -s "$BASE_URL/" | json_pp
echo -e "\n"

# Test 2: Create a simple string
echo "Test 2: Create a simple string (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}' | json_pp
echo -e "\n"

# Test 3: Create a palindrome
echo "Test 3: Create a palindrome (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}' | json_pp
echo -e "\n"

# Test 4: Create another palindrome
echo "Test 4: Create another palindrome (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"value": "noon"}' | json_pp
echo -e "\n"

# Test 5: Try to create duplicate (should return 409)
echo "Test 5: Try to create duplicate - should return 409 (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}' | json_pp
echo -e "\n"

# Test 6: Create with missing value field (should return 400)
echo "Test 6: Missing value field - should return 400 (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"text": "invalid"}' | json_pp
echo -e "\n"

# Test 7: Create with wrong type (should return 422)
echo "Test 7: Wrong data type - should return 422 (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"value": 12345}' | json_pp
echo -e "\n"

# Test 8: Get specific string
echo "Test 8: Get specific string (GET /strings/racecar)"
curl -s "$BASE_URL/strings/racecar" | json_pp
echo -e "\n"

# Test 9: Get non-existent string (should return 404)
echo "Test 9: Get non-existent string - should return 404 (GET /strings/notfound)"
curl -s "$BASE_URL/strings/notfound" | json_pp
echo -e "\n"

# Test 10: Get all strings
echo "Test 10: Get all strings (GET /strings)"
curl -s "$BASE_URL/strings" | json_pp
echo -e "\n"

# Test 11: Filter by palindrome
echo "Test 11: Filter palindromes (GET /strings?is_palindrome=true)"
curl -s "$BASE_URL/strings?is_palindrome=true" | json_pp
echo -e "\n"

# Test 12: Filter by word count
echo "Test 12: Filter single-word strings (GET /strings?word_count=1)"
curl -s "$BASE_URL/strings?word_count=1" | json_pp
echo -e "\n"

# Test 13: Filter by min_length
echo "Test 13: Filter strings longer than 5 characters (GET /strings?min_length=6)"
curl -s "$BASE_URL/strings?min_length=6" | json_pp
echo -e "\n"

# Test 14: Filter by max_length
echo "Test 14: Filter strings shorter than 10 characters (GET /strings?max_length=9)"
curl -s "$BASE_URL/strings?max_length=9" | json_pp
echo -e "\n"

# Test 15: Create string with 'a' for contains_character test
echo "Test 15: Create string with letter 'a' (POST /strings)"
curl -s -X POST "$BASE_URL/strings" \
  -H "Content-Type: application/json" \
  -d '{"value": "amazing"}' | json_pp
echo -e "\n"

# Test 16: Filter by contains_character
echo "Test 16: Filter strings containing 'a' (GET /strings?contains_character=a)"
curl -s "$BASE_URL/strings?contains_character=a" | json_pp
echo -e "\n"

# Test 17: Multiple filters
echo "Test 17: Multiple filters (GET /strings?is_palindrome=true&word_count=1)"
curl -s "$BASE_URL/strings?is_palindrome=true&word_count=1" | json_pp
echo -e "\n"

# Test 18: Invalid query parameter (should return 400)
echo "Test 18: Invalid query parameter - should return 400 (GET /strings?min_length=abc)"
curl -s "$BASE_URL/strings?min_length=abc" | json_pp
echo -e "\n"

# Test 19: Natural language query - single word palindromes
echo "Test 19: NLP query for single word palindromes"
curl -s "$BASE_URL/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings" | json_pp
echo -e "\n"

# Test 20: Natural language query - longer than X
echo "Test 20: NLP query for strings longer than 5 characters"
curl -s "$BASE_URL/strings/filter-by-natural-language?query=strings%20longer%20than%205%20characters" | json_pp
echo -e "\n"

# Test 21: Natural language query - contains letter
echo "Test 21: NLP query for strings containing letter 'a'"
curl -s "$BASE_URL/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20a" | json_pp
echo -e "\n"

# Test 22: Natural language query - unparseable (should return 400)
echo "Test 22: Unparseable NLP query - should return 400"
curl -s "$BASE_URL/strings/filter-by-natural-language?query=xyz%20random%20query" | json_pp
echo -e "\n"

# Test 23: Delete a string
echo "Test 23: Delete a string (DELETE /strings/amazing)"
curl -s -X DELETE "$BASE_URL/strings/amazing"
echo "Response should be empty (204 No Content)"
echo -e "\n"

# Test 24: Try to delete non-existent string (should return 404)
echo "Test 24: Delete non-existent string - should return 404 (DELETE /strings/notfound)"
curl -s -X DELETE "$BASE_URL/strings/notfound" | json_pp
echo -e "\n"

# Test 25: Verify deletion
echo "Test 25: Verify 'amazing' was deleted (GET /strings/amazing)"
curl -s "$BASE_URL/strings/amazing" | json_pp
echo -e "\n"

echo "=============================================="
echo "All tests completed!"