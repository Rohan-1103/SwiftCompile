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
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Routes
// Mount authentication routes under the /api/auth path
app.use('/api/auth', authRoutes);

// Define the port to listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});