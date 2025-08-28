// Import necessary modules
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating and verifying JSON Web Tokens
const User = require('../models/user.model'); // User model for database operations

/**
 * Handles user registration.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const register = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if a user with the given email already exists
    let user = await User.findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const passwordHash = await bcrypt.hash(password, salt); // Hash the password with the generated salt

    // Create the new user in the database
    user = await User.createUser(email, passwordHash);

    // Respond with success message and non-sensitive user data
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email } });
  } catch (err) {
    // Log the error and send a generic server error response
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Handles user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const login = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Find the user by email
    const user = await User.findUserByEmail(email);
    if (!user) {
      // If user not found, return invalid credentials to avoid revealing user existence
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      // If passwords don't match, return invalid credentials
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload with user ID
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the JWT and send it in the response along with non-sensitive user data
    // MANUAL_CHANGE_REQUIRED: Ensure process.env.JWT_SECRET is correctly set in your .env file.
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err; // Handle JWT signing error
        res.json({ token, user: { id: user.id, email: user.email } });
      }
    );
  } catch (err) {
    // Log the error and send a generic server error response
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Fetches the logged-in user's data.
 * This route is protected and requires a valid JWT.
 * @param {Object} req - Express request object (with req.user populated by middleware).
 * @param {Object} res - Express response object.
 */
const getMe = async (req, res) => {
  try {
    // Find the user by ID from the token payload (attached by auth middleware)
    const user = await User.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Respond with the user's non-sensitive data
    res.json(user);
  } catch (err) {
    // Log the error and send a generic server error response
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Export the controller functions
module.exports = {
  register,
  login,
  getMe,
};