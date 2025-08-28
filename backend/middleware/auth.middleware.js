// Import necessary modules
const jwt = require('jsonwebtoken'); // For verifying JSON Web Tokens
const User = require('../models/user.model'); // User model for database operations

/**
 * Middleware to verify JWT token from the request header.
 * Attaches the decoded user object (id, email) to req.user if token is valid.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback function to pass control to the next middleware.
 */
const verifyToken = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the JWT secret
    // MANUAL_CHANGE_REQUIRED: Ensure process.env.JWT_SECRET is correctly set in your .env file.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user payload from the token to the request object
    req.user = decoded.user;

    // Fetch the user from the database to ensure the user still exists and get non-sensitive data
    const user = await User.findUserById(req.user.id);
    if (!user) {
      // If user not found in DB, token is invalid (e.g., user deleted after token issued)
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Overwrite req.user with non-sensitive user data from the database
    req.user = { id: user.id, email: user.email };

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails (e.g., expired, malformed), send 401 unauthorized
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Export the middleware function
module.exports = verifyToken;