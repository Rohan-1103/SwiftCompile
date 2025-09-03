// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const fileRoutes = require('./routes/file.routes');
const codeRoutes = require('./routes/code.routes');

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
// Mount project routes under the /api/projects path
app.use('/api/projects', projectRoutes);
// Mount file routes under the /api/projects/:projectId/files path
projectRoutes.use('/:projectId/files', fileRoutes);
app.use('/api', codeRoutes);

// Define the port to listen on, defaulting to 3000 if not specified in environment variables
// MANUAL_CHANGE_REQUIRED: Ensure this port is open and accessible in your deployment environment.
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});