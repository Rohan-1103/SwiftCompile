// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

// Initialize the Express application
const app = express();

// Middleware
// Enable Cross-Origin Resource Sharing (CORS) for all routes
// MANUAL_CHANGE_REQUIRED: Configure CORS options for production to restrict origins.
// Example: app.use(cors({ origin: 'https://yourfrontend.com' }));
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Routes
// Mount authentication routes under the /api/auth path
app.use('/api/auth', authRoutes);

// Define the port to listen on, defaulting to 3000 if not specified in environment variables
// MANUAL_CHANGE_REQUIRED: Ensure this port is open and accessible in your deployment environment.
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});