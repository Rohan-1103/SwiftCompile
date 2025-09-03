
# Manual Changes for Chunk 4: Secure Code Execution Engine

This document outlines the manual changes required to integrate the secure code execution engine into the existing backend.

## 1. Docker Installation

This implementation requires Docker to be installed and running on the host machine.

- **Action:** Install Docker Desktop for your operating system (Windows, macOS, or Linux).
- **Verification:** Ensure the Docker daemon is running by executing `docker --version` and `docker ps` in your terminal.

## 2. Environment Variables

No new environment variables are required for this chunk.

## 3. CORS Configuration

For the frontend to communicate with the new `/api/execute` endpoint, you might need to adjust the CORS configuration in `backend/server.js`.

- **File:** `backend/server.js`
- **Action:** If you have a restrictive CORS policy, ensure that the origin of your frontend application is allowed. For development, the current setting `app.use(cors());` is likely sufficient.

## 4. Pulling Docker Images

The code execution engine uses specific Docker images for each language. To avoid delays on the first execution, you can pull these images manually beforehand.

- **Action:** Open your terminal and run the following commands:

  ```bash
  docker pull python:3.9-slim
  docker pull gcc
  docker pull openjdk
  ```

## 5. Understanding the Code

- **`backend/controllers/code.controller.js`:** This new file contains the core logic for executing code in a Docker container. It handles:
    - Creating a temporary file with the user's code.
    - Creating a Docker container with resource limits (CPU, memory) and disabled networking.
    - Mounting the temporary directory into the container.
    - Executing the code and capturing `stdout` and `stderr`.
    - Handling timeouts.
    - Cleaning up the container and temporary file.

- **`backend/routes/code.routes.js`:** This new file defines the `/api/execute` endpoint, which is used to receive code execution requests from the frontend.

- **`backend/server.js`:** This file was modified to include and use the new `code.routes.js`.
