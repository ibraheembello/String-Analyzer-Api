/**
 * Global error handling middleware
 * Catches unhandled errors and returns consistent error responses
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default to 500 Internal Server Error
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message
  });
}

module.exports = errorHandler;