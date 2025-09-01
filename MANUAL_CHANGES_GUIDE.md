# Manual Changes Guide

This document outlines the manual changes that need to be made to the project for it to function correctly.

## Backend

### 1. Database Setup

- **Execute the SQL script:** The `backend/db/init.sql` script needs to be executed manually against your PostgreSQL database. This script creates the `users`, `projects`, and `files` tables.
- **Database Configuration:** Ensure that the `.env` file in the `backend` directory is correctly configured with your PostgreSQL database credentials. The following variables should be set:
  - `DB_USER`
  - `DB_HOST`
  - `DB_DATABASE`
  - `DB_PASSWORD`
  - `DB_PORT`

### 2. CORS Configuration

- **Restrict Origins:** In `backend/server.js`, the CORS configuration is currently set to allow all origins (`app.use(cors())`). For production, this should be changed to a more restrictive setting, for example:
  ```javascript
  app.use(cors({ origin: 'https://yourfrontend.com' }));
  ```

### 3. Port Accessibility

- **Firewall Configuration:** Ensure that the port specified in the `PORT` environment variable (defaulting to 3000) is open and accessible in your deployment environment.
