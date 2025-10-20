const express = require('express');
const stringRoutes = require('./routes/stringRoutes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Express application setup
 * Configures middleware and routes
 */
function createApp() {
  const app = express();

  // Parse JSON request bodies
  app.use(express.json());

  // API routes
  app.use('/', stringRoutes);

  // Health check endpoint
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      message: 'String Analyzer API is running',
      endpoints: {
        'POST /strings': 'Create and analyze a string',
        'GET /strings/:string_value': 'Get a specific string',
        'GET /strings': 'Get all strings with optional filters',
        'GET /strings/filter-by-natural-language': 'Filter strings using natural language',
        'DELETE /strings/:string_value': 'Delete a string'
      }
    });
  });

  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      error: 'Route not found'
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

module.exports = createApp;