const createApp = require('./src/app');

/**
 * Server entry point
 * Starts the Express server on the configured port
 */
const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`String Analyzer API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});