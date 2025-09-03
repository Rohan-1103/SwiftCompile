# Manual Changes Required: Database Schema Update

This guide outlines the manual changes required for the database schema.

## Database (`init.sql`) Schema Update

To apply the necessary schema changes, you must manually execute the following SQL script against your PostgreSQL database:

```sql
-- MANUAL_CHANGE_REQUIRED: Execute this script manually against your PostgreSQL database.
-- This script creates the 'users' table if it does not already exist.
-- Ensure your database is properly configured and accessible before running this.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add files table
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(1024) NOT NULL,
    content TEXT,
    parent_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## `user_projects` Directory

A new directory named `user_projects` will be created in the root of the project directory. This directory will store the files and folders for each project.