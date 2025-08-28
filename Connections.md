# Connections Guide for SwiftCompiler_GP1 Backend

This guide provides detailed instructions for setting up the PostgreSQL database and running the Node.js Express application. These steps are crucial for both development and production environments.

## 1. PostgreSQL Database Setup

Before running the backend, you need to have a PostgreSQL database set up and configured. If you don't have PostgreSQL installed, please refer to the official PostgreSQL documentation for installation instructions for your operating system.

### 1.1 Create a New Database

It is recommended to create a dedicated database for this application. You can do this using the `psql` command-line tool or a GUI client like pgAdmin.

**Using `psql`:**

```bash
psql -U your_username -c "CREATE DATABASE swiftcompiler_db;"
```

Replace `your_username` with your PostgreSQL superuser or a user with database creation privileges.

### 1.2 Update `.env` with Database Connection String

The backend connects to the PostgreSQL database using a connection string defined in the `.env` file. Open the `.env` file in the root of your project and update the `DATABASE_URL` variable.

**Example `.env` entry:**

```
PORT=3000
DATABASE_URL="postgresql://your_username:your_password@your_host:your_port/swiftcompiler_db"
JWT_SECRET="your_jwt_secret_key_here"
```

**Replace the placeholders:**
- `your_username`: Your PostgreSQL database username.
- `your_password`: Your PostgreSQL database password.
- `your_host`: The host where your PostgreSQL database is running (e.g., `localhost`, `127.0.0.1`, or a remote IP/hostname).
- `your_port`: The port your PostgreSQL database is listening on (default is `5432`).
- `swiftcompiler_db`: The name of the database you created in step 1.1.

### 1.3 Run Database Migrations (Initialize Schema)

The `db/init.sql` file contains the SQL schema for the `users` table. You need to execute this script against your newly created database to set up the necessary tables.

**Using `psql`:**

Navigate to the root of your project directory in your terminal and run:

```bash
psql -U your_username -d swiftcompiler_db -f db/init.sql
```

Replace `your_username` and `swiftcompiler_db` with your actual credentials and database name.

## 2. Running the Backend Application

Once the database is set up and configured, you can start the Node.js Express application.

### 2.1 Install Dependencies

If you haven't already, install the project dependencies by running the following command in the root of your project:

```bash
npm install
```

### 2.2 Start the Server

You have two options to start the server:

#### Development Mode (with Nodemon)

For development, it's recommended to use `nodemon`, which automatically restarts the server when file changes are detected.

```bash
npm run dev
```

#### Production Mode

For production environments, use the standard `node` command. This will run the server without automatic restarts.

```bash
npm start
```

### 2.3 Accessing the API

By default, the server will run on `http://localhost:3000` (or the port specified in your `.env` file under the `PORT` variable).

**Key API Endpoints:**

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user and receive a JWT.
- `GET /api/auth/me`: Fetch the logged-in user's data (requires a valid JWT in the `x-auth-token` header).

## 3. Future Enhancements and Production Readiness

This setup provides a solid foundation. For a highly advanced production-ready project, consider the following enhancements:

- **Environment Variables:** Ensure all sensitive information (database credentials, JWT secrets) are managed securely via environment variables, especially in production.
- **Error Handling:** Implement more robust and centralized error handling, potentially using a dedicated error handling middleware.
- **Logging:** Integrate a comprehensive logging solution (e.g., Winston, Morgan) for better monitoring and debugging in production.
- **Input Validation:** Enhance input validation for all API endpoints (e.g., using `express-validator`) to prevent invalid data and security vulnerabilities.
- **Rate Limiting:** Implement rate limiting to protect against brute-force attacks and API abuse.
- **Security Headers:** Add appropriate security headers (e.g., Helmet.js) to enhance application security.
- **HTTPS:** Always deploy with HTTPS in production.
- **Database Migrations:** For more complex schema changes, consider using a dedicated database migration tool (e.g., Knex.js, Sequelize migrations) instead of raw SQL scripts.
- **Testing:** Implement a comprehensive suite of unit, integration, and end-to-end tests.
- **Dockerization:** Containerize your application using Docker for easier deployment and scalability.
- **CI/CD:** Set up Continuous Integration/Continuous Deployment pipelines for automated testing and deployment.
- **Monitoring & Alerting:** Implement monitoring tools and alerting for production issues.
- **Scalability:** Design for scalability from the beginning, considering load balancing, database replication, etc.
