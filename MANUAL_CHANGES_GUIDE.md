# Manual Changes Guide for SwiftCompiler_GP1

This document outlines all the manual changes and configurations required for both the backend and frontend of the SwiftCompiler_GP1 project. These steps are crucial for setting up the development environment, connecting the different parts of the application, and preparing for production deployment.

## Backend Manual Changes

### 1. `.env` File Configuration

Located at `backend/.env`

*   **`PORT`**: The port on which the Express server will run.
    *   **Action**: Change this if you need the server to run on a different port.
    *   **Current Value**: `PORT=3000`

*   **`DATABASE_URL`**: Connection string for your PostgreSQL database.
    *   **Action**: **REPLACE WITH YOUR ACTUAL DATABASE CONNECTION STRING.**
    *   **Example**: `postgresql://user:password@host:port/database_name`
    *   **Current Value**: `DATABASE_URL="postgresql://user:password@host:port/database"`

*   **`JWT_SECRET`**: A secret key used for signing and verifying JSON Web Tokens.
    *   **Action**: **REPLACE WITH A STRONG, UNIQUE, AND SECRET KEY.** This should be a long, random string. **DO NOT SHARE THIS KEY.**
    *   **Current Value**: `JWT_SECRET="your_jwt_secret"`

### 2. Database Initialization Script

Located at `backend/db/init.sql`

*   **Action**: Execute this script manually against your PostgreSQL database. This script creates the `users` table if it does not already exist. Ensure your database is properly configured and accessible before running this.

### 3. CORS Configuration

Located at `backend/server.js`

*   **Action**: Configure CORS options for production to restrict origins. In a production environment, you should replace `app.use(cors());` with a more restrictive configuration.
    *   **Example**: `app.use(cors({ origin: 'https://yourfrontend.com' }));`

### 4. Server Port Accessibility

Located at `backend/server.js`

*   **Action**: Ensure the port defined in `PORT` (from `.env`) is open and accessible in your deployment environment.

### 5. JWT Secret Usage

Located at `backend/controllers/auth.controller.js` and `backend/middleware/auth.middleware.js`

*   **Action**: Ensure `process.env.JWT_SECRET` is correctly set in your `.env` file. This secret is critical for the security of your authentication system.

## Frontend Manual Changes

### 1. Backend API Endpoints

Located at `frontend/src/pages/LoginPage.jsx` and `frontend/src/pages/RegisterPage.jsx`

*   **Action**: Replace the placeholder backend API endpoints (`http://localhost:3000/api/auth/login` and `http://localhost:3000/api/auth/register`) with your actual deployed backend URLs.

### 2. Authentication State Handling

Located at `frontend/src/pages/LoginPage.jsx` and `frontend/src/pages/RegisterPage.jsx`

*   **Action**: Implement actual logic for handling successful login/registration. This typically involves:
    *   Storing the received JWT token (e.g., in `localStorage` or `sessionStorage`).
    *   Redirecting the user to a protected route (e.g., `/dashboard`).
    *   Updating a global authentication state (e.g., using React Context or Redux) to reflect the user's logged-in status.

### 3. Login/Register Page Left Panel Visuals

Located at `frontend/src/pages/LoginPage.jsx` and `frontend/src/pages/RegisterPage.jsx`

*   **Action**: The left panels of the login and registration pages now use CSS gradients and icons instead of images. You can further customize these visual elements by modifying the Tailwind CSS classes or adding more complex CSS for abstract patterns or animations within the `motion.div` elements. The current implementation uses simple rounded shapes with gradients and an emoji icon.

*   **Note**: The previous instruction regarding placeholder graphics/testimonials has been removed as the design now relies on CSS-based visuals.



