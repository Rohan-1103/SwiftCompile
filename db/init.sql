-- MANUAL_CHANGE_REQUIRED: Execute this script manually against your PostgreSQL database.
-- This script creates the 'users' table if it does not already exist.
-- Ensure your database is properly configured and accessible before running this.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);