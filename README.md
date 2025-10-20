# String Analyzer API

A RESTful API service that analyzes strings and stores their computed properties.

## Features

- Compute string properties (length, palindrome check, unique characters, word count, SHA-256 hash, character frequency)
- Store and retrieve analyzed strings
- Filter strings by various criteria
- Natural language query support
- In-memory storage for fast access

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Storage**: In-memory (Map-based)

## Project Structure

```
string-analyzer-api/
├── src/
│   ├── controllers/
│   │   └── stringController.js      # HTTP request handlers
│   ├── services/
│   │   ├── stringService.js         # Business logic
│   │   └── nlpService.js            # Natural language parsing
│   ├── utils/
│   │   ├── stringAnalyzer.js        # String property computation
│   │   └── validators.js            # Request validation
│   ├── middleware/
│   │   └── errorHandler.js          # Global error handling
│   ├── storage/
│   │   └── inMemoryStorage.js       # In-memory data storage
│   ├── routes/
│   │   └── stringRoutes.js          # Route definitions
│   └── app.js                       # Express app setup
├── server.js                        # Server entry point
├── package.json
├── .gitignore
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd string-analyzer-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server**
   
   For production:
   ```bash
   npm start
   ```
   
   For development (with auto-restart):
   ```bash
   npm run dev
   ```

4. **Verify the server is running**
   
   Open your browser or use curl:
   ```bash
   curl http://localhost:3000/
   ```

## Environment Variables

The API uses the following environment variable:

- `PORT` (optional): Server port number (default: 3000)

To set environment variables, create a `.env` file (not tracked in git) or set them in your deployment platform:

```bash
PORT=3000
```

## API Endpoints

### 1. Create/Analyze String

**POST** `/strings`

Analyzes a string and stores its properties.

**Request Body:**
```json
{
  "value": "string to analyze"
}
```

**Success Response (201 Created):**
```json
{
  "id": "abc123...",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-10-20T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Missing "value" field
- `409 Conflict`: String already exists
- `422 Unprocessable Entity`: Invalid data type for "value"

**Example:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'
```

### 2. Get Specific String

**GET** `/strings/{string_value}`

Retrieves a previously analyzed string.

**Success Response (200 OK):**
```json
{
  "id": "abc123...",
  "value": "hello world",
  "properties": { ... },
  "created_at": "2025-10-20T10:00:00.000Z"
}
```

**Error Response:**
- `404 Not Found`: String does not exist

**Example:**
```bash
curl http://localhost:3000/strings/hello%20world
```

### 3. Get All Strings with Filtering

**GET** `/strings`

Retrieves all strings with optional filtering.

**Query Parameters:**
- `is_palindrome`: boolean (true/false)
- `min_length`: integer (minimum string length)
- `max_length`: integer (maximum string length)
- `word_count`: integer (exact word count)
- `contains_character`: string (single character)

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { ... },
      "created_at": "2025-10-20T10:00:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```

**Error Response:**
- `400 Bad Request`: Invalid query parameter values

**Examples:**
```bash
# Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# Get strings with 2 words and length between 5-20
curl "http://localhost:3000/strings?word_count=2&min_length=5&max_length=20"

# Get strings containing the letter 'a'
curl "http://localhost:3000/strings?contains_character=a"
```

### 4. Natural Language Filtering

**GET** `/strings/filter-by-natural-language?query=<natural_language_query>`

Filters strings using natural language queries.

**Query Parameter:**
- `query`: Natural language string

**Supported Query Patterns:**
- "all single word palindromic strings"
- "strings longer than 10 characters"
- "palindromic strings that contain the first vowel"
- "strings containing the letter z"

**Success Response (200 OK):**
```json
{
  "data": [ ... ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Unable to parse query
- `422 Unprocessable Entity`: Conflicting filters

**Examples:**
```bash
# Find single-word palindromes
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# Find long strings
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"

# Find strings with specific letter
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20z"
```

### 5. Delete String

**DELETE** `/strings/{string_value}`

Deletes a string from the system.

**Success Response (204 No Content):**
- Empty response body

**Error Response:**
- `404 Not Found`: String does not exist

**Example:**
```bash
curl -X DELETE http://localhost:3000/strings/hello%20world
```

## Testing the API

### Using curl

1. **Create a string:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

2. **Get the string:**
```bash
curl http://localhost:3000/strings/racecar
```

3. **Create more strings:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello"}'

curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "noon"}'
```

4. **Filter palindromes:**
```bash
curl "http://localhost:3000/strings?is_palindrome=true"
```

5. **Natural language query:**
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=palindromic%20strings"
```

6. **Delete a string:**
```bash
curl -X DELETE http://localhost:3000/strings/hello
```

### Using Postman

1. Import the following endpoints into Postman
2. Set the base URL to `http://localhost:3000`
3. Test each endpoint with the examples provided above

## Deployment to Azure

### Prerequisites

- Azure account
- Azure CLI installed
- Node.js project ready

### Deployment Steps

1. **Login to Azure:**
```bash
az login
```

2. **Create a resource group:**
```bash
az group create --name string-analyzer-rg --location eastus
```

3. **Create an App Service plan:**
```bash
az appservice plan create --name string-analyzer-plan --resource-group string-analyzer-rg --sku B1 --is-linux
```

4. **Create the web app:**
```bash
az webapp create --resource-group string-analyzer-rg --plan string-analyzer-plan --name your-app-name --runtime "NODE|18-lts"
```

5. **Configure deployment from GitHub:**
```bash
az webapp deployment source config --name your-app-name --resource-group string-analyzer-rg --repo-url <your-github-repo> --branch main --manual-integration
```

6. **Set startup command (if needed):**
```bash
az webapp config set --name your-app-name --resource-group string-analyzer-rg --startup-file "npm start"
```

7. **Your API will be available at:**
```
https://your-app-name.azurewebsites.net
```

## Dependencies

- **express** (^4.18.2): Web framework for Node.js
- **nodemon** (^3.0.1): Development auto-restart tool (dev dependency)

No external database or third-party services required.

## Important Notes

- **In-Memory Storage**: Data is stored in memory and will be lost when the server restarts
- **No Authentication**: This API does not implement authentication
- **Case Sensitivity**: String lookups and storage are case-sensitive
- **Palindrome Check**: Palindrome checking is case-insensitive
- **URL Encoding**: Remember to URL-encode string values in GET/DELETE requests

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message description"
}
```

HTTP status codes used:
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request format or parameters
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Invalid data type or conflicting filters
- `500 Internal Server Error`: Unexpected server error

## License

MIT