# Folder Management

This document outlines the database considerations for folder and file management.

## Database Schema

The `files` table is used to store information about both files and folders.
The schema is as follows:

```sql
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(1024) NOT NULL,
    content TEXT,
    parent_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_folder BOOLEAN DEFAULT FALSE NOT NULL
);
```

### Key Columns

-   `is_folder`: A boolean column that is `TRUE` for folders and `FALSE` for files.
-   `parent_id`: A foreign key that references the `id` of the parent folder. For files and folders at the root of the project, `parent_id` is `NULL`.

## Manual Changes

**No manual database changes are required for the folder navigation feature.**

The existing schema fully supports the functionality of nested folders and files.
