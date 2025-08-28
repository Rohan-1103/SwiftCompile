// Import the Pool class from the 'pg' module for PostgreSQL database interaction
const { Pool } = require('pg');

// Create a new Pool instance to manage database connections
// The connection string is retrieved from environment variables for security and flexibility
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Creates a new user in the database.
 * @param {string} email - The email of the user.
 * @param {string} passwordHash - The hashed password of the user.
 * @returns {Object} The created user object (id, email, created_at).
 */
const createUser = async (email, passwordHash) => {
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, passwordHash]
  );
  return result.rows[0];
};

/**
 * Finds a user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {Object} The user object if found, otherwise undefined.
 */
const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

/**
 * Finds a user by their ID.
 * @param {string} id - The ID of the user to find.
 * @returns {Object} The user object (id, email, created_at) if found, otherwise undefined.
 */
const findUserById = async (id) => {
  const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Export the functions for use in other modules
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};