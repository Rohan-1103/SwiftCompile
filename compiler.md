## Connecting Docker Images for Code Execution

The backend of this application uses `dockerode`, a Node.js library, to interact with your local Docker daemon. This interaction allows the application to create isolated environments (containers) for executing user-submitted code.

**How it works:**

1.  **Backend's Role:** When a user submits code for execution, the backend (specifically `code.controller.js` and related logic) uses `dockerode` to:
    *   **Pull Docker Images:** It might implicitly pull necessary language-specific Docker images (e.g., `python:latest`, `node:latest`, `gcc:latest`) if they are not already present on your system. The specific images used depend on the programming languages supported by the compiler.
    *   **Create Containers:** It creates a new Docker container based on the appropriate language image.
    *   **Execute Code:** It mounts the user's code into the container and executes it within that isolated environment.
    *   **Capture Output:** It captures the output (stdout, stderr) and exit status from the container.
    *   **Remove Containers:** After execution, the container is typically removed to clean up resources.

**What you need to do:**

*   **Ensure Docker Desktop is Running:** The most crucial step is to have Docker Desktop (or your Docker daemon) running and accessible. The backend communicates with this daemon.
*   **Internet Connection (for first run):** The first time the backend attempts to execute code for a specific language, it might need an internet connection to pull the corresponding Docker image. Subsequent executions will use the locally cached image.

**Troubleshooting Docker Image Issues:**

*   **`Error: connect ECONNREFUSED` or similar Docker connection errors:** This usually means Docker Desktop is not running, or the backend cannot connect to the Docker daemon.
    *   Verify Docker Desktop is open and running.
    *   Check Docker settings to ensure the daemon is exposed correctly (though `dockerode` usually works out-of-the-box with default Docker Desktop installations).
*   **`No such image` or `Image not found` errors (less common, as `dockerode` often pulls automatically):** If you encounter errors indicating a missing image, it might be due to:
    *   Lack of internet connectivity when the image was first needed.
    *   A misconfiguration in the backend's code execution logic that specifies an incorrect image name.
*   **Code execution timeouts or unexpected behavior:**
    *   Ensure the Docker images being used are healthy and contain the necessary language runtimes/compilers.
    *   Check Docker logs for the specific container (if it's not immediately removed) to see if there are errors during code execution within the container. You can use `docker ps -a` to see recently exited containers and `docker logs <container_id>` to inspect their logs.