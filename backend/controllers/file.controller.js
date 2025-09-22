const db = require('../db/db');
const fs = require('fs');
const path = require('path');

/**
 * CREATES A NEW FILE WITHIN A SPECIFIC PROJECT.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.createFile = async (req, res) => {
  const { projectId } = req.params;
  const { name, content, parent_id } = req.body;
  const userId = req.user.id;

  console.log('--- CREATE FILE REQUEST ---');
  console.log('Project ID:', projectId);
  console.log('User ID:', userId);
  console.log('File Name:', name);
  console.log('Parent ID:', parent_id);

  if (!name) {
    return res.status(400).json({ message: 'File name is required.' });
  }

  try {
    const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }
    console.log('Project verified.');

    const projectPath = path.join(__dirname, '..', '..', 'user_projects', projectId.toString());
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
      console.log('Project path created:', projectPath);
    }

    let newPath = path.join(projectPath, name);
    let relativePath;

    if (parent_id) {
      console.log('Parent ID provided. Validating parent...');
      const parentResult = await db.query('SELECT path, is_folder FROM files WHERE id = $1 AND project_id = $2', [parent_id, projectId]);
      if (parentResult.rows.length === 0 || !parentResult.rows[0].is_folder) {
        console.error('Parent ID validation failed.');
        return res.status(400).json({ message: 'Parent ID must be an existing folder.' });
      }
      const parentPath = parentResult.rows[0].path;
      console.log('Parent path:', parentPath);

      const fullParentPath = path.join(projectPath, parentPath);
      if (!fs.existsSync(fullParentPath)) {
          fs.mkdirSync(fullParentPath, { recursive: true });
          console.log('Parent directory created:', fullParentPath);
      }

      newPath = path.join(fullParentPath, name);
      relativePath = path.join(parentPath, name);

    } else {
      console.log('No parent ID. Creating file in root.');
      relativePath = name;
    }
    
    console.log('New file path:', newPath);
    console.log('Relative path:', relativePath);

    fs.writeFileSync(newPath, content || '');
    console.log('File created on filesystem.');

    const result = await db.query(
      'INSERT INTO files (project_id, name, content, path, parent_id, is_folder) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *',
      [projectId, name, content || '', relativePath, parent_id]
    );

    console.log('File metadata saved to database.');
    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ message: 'Failed to create file.' });
  }
};

/**
 * CREATES A NEW FOLDER WITHIN A SPECIFIC PROJECT.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.createFolder = async (req, res) => {
  const { projectId } = req.params;
  const { name, parent_id } = req.body; // Changed parentId to parent_id
  const userId = req.user.id; // ASSUMING VERIFYTOKEN MIDDLEWARE

  if (!name) {
    return res.status(400).json({ message: 'Folder name is required.' });
  }

  try {
    // VERIFY THAT THE PROJECT EXISTS AND BELONGS TO THE USER
    const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    const projectPath = path.join(__dirname, '..', '..', 'user_projects', projectId.toString()); // Use projectId.toString()
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    let newFolderPath = path.join(projectPath, name);
    if (parent_id) {
        // Validate parent_id is an existing folder
        const parentResult = await db.query('SELECT path, is_folder FROM files WHERE id = $1 AND project_id = $2', [parent_id, projectId]);
        if (parentResult.rows.length === 0 || !parentResult.rows[0].is_folder) {
            return res.status(400).json({ message: 'Parent ID must be an existing folder.' });
        }
        const parentPath = parentResult.rows[0].path;
        newFolderPath = path.join(projectPath, parentPath, name);
    }

    // Create the physical directory
    fs.mkdirSync(newFolderPath, { recursive: true });

    const relativePath = path.relative(projectPath, newFolderPath);

    // INSERT THE NEW FOLDER, setting is_folder to TRUE
    const result = await db.query(
      'INSERT INTO files (project_id, name, path, parent_id, is_folder) VALUES ($1, $2, $3, $4, TRUE) RETURNING *',
      [projectId, name, relativePath, parent_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Failed to create folder.' });
  }
};

/**
 * RETRIEVES FILES FOR A SPECIFIC PROJECT.
 * Can be filtered by a parent folder ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getFiles = async (req, res) => {
    const { projectId } = req.params;
    const { folderId } = req.query; // Get folderId from query parameters
    const userId = req.user.id;

    try {
        // VERIFY THAT THE PROJECT EXISTS AND BELONGS TO THE USER
        const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found or access denied.' });
        }

        let result;
        if (folderId) {
            // Fetch children of a specific folder
            result = await db.query('SELECT * FROM files WHERE project_id = $1 AND parent_id = $2 ORDER BY is_folder DESC, name ASC', [projectId, folderId]);
        } else {
            // Fetch root-level files and folders
            result = await db.query('SELECT * FROM files WHERE project_id = $1 AND parent_id IS NULL ORDER BY is_folder DESC, name ASC', [projectId]);
        }
        
        

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ message: 'Failed to retrieve files.' });
    }
};

/**
 * GETS A FILE BY ITS ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getFileById = async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user.id;

    try {
        const result = await db.query(
            `SELECT f.* FROM files f
             JOIN projects p ON f.project_id = p.id
             WHERE f.id = $1 AND p.user_id = $2`,
            [fileId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'File not found or access denied.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ message: 'Failed to retrieve file.' });
    }
};


/**
 * UPDATES THE CONTENT OF A SPECIFIC FILE.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.updateFile = async (req, res) => {
  const { fileId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (content === undefined) {
    return res.status(400).json({ message: 'Content field is required for an update.' });
  }

  try {
    // TO ENSURE SECURITY, WE JOIN TABLES TO CHECK IF THE FILE BELONGS TO A PROJECT OWNED BY THE USER
    const result = await db.query(
      `UPDATE files f SET content = $1, updated_at = CURRENT_TIMESTAMP
       FROM projects p
       WHERE f.id = $2 AND f.project_id = p.id AND p.user_id = $3
       RETURNING f.*`,
      [content, fileId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'File not found or access denied.' });
    }

    const projectPath = path.join(__dirname, '..', '..', 'user_projects', result.rows[0].project_id.toString());
    const filePath = path.join(projectPath, result.rows[0].path);

    fs.writeFileSync(filePath, content);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ message: 'Failed to update file.' });
  }
};

/**
 * DELETES A SPECIFIC FILE OR FOLDER.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.deleteFile = async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user.id;

    try {
        // First, get the file/folder details to verify ownership and get path info
        const fileResult = await db.query(
            `SELECT f.id, f.path, f.project_id, f.is_folder 
             FROM files f
             JOIN projects p ON f.project_id = p.id
             WHERE f.id = $1 AND p.user_id = $2`,
            [fileId, userId]
        );

        if (fileResult.rows.length === 0) {
            return res.status(404).json({ message: 'File not found or access denied.' });
        }

        const fileToDelete = fileResult.rows[0];
        const projectPath = path.join(__dirname, '..', '..', 'user_projects', fileToDelete.project_id.toString());
        const fullPath = path.join(projectPath, fileToDelete.path);

        // RECURSIVE DELETE FUNCTION FOR DB
        const deleteFromDbRecursive = async (id, isFolder) => {
            if (isFolder) {
                const children = await db.query('SELECT id, is_folder FROM files WHERE parent_id = $1', [id]);
                for (const child of children.rows) {
                    await deleteFromDbRecursive(child.id, child.is_folder);
                }
            }
            await db.query('DELETE FROM files WHERE id = $1', [id]);
        };

        // Start transaction
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Perform recursive delete in DB
            await deleteFromDbRecursive(fileToDelete.id, fileToDelete.is_folder);

            // Delete from filesystem
            if (fs.existsSync(fullPath)) {
                if (fileToDelete.is_folder) {
                    fs.rmSync(fullPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(fullPath);
                }
            }

            await client.query('COMMIT');
            res.status(200).json({ message: 'File or folder deleted successfully.' });

        } catch (dbError) {
            await client.query('ROLLBACK');
            throw dbError;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error deleting file/folder:', error);
        res.status(500).json({ message: 'Failed to delete file or folder.' });
    }
};

exports.syncFilesystemToDb = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        // 1. VERIFY PROJECT OWNERSHIP
        const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found or access denied.' });
        }

        const projectPath = path.join(__dirname, '..', '..', 'user_projects', projectId.toString());

        // 2. GET ALL FILES FROM FILESYSTEM
        const fsFiles = [];
        const scanDir = (dirPath) => {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const entryPath = path.join(dirPath, entry.name);
                fsFiles.push(entryPath);
                if (entry.isDirectory()) {
                    scanDir(entryPath);
                }
            }
        };
        if (fs.existsSync(projectPath)) {
            scanDir(projectPath);
        }

        // 3. GET ALL FILES FROM DB
        const dbFilesResult = await db.query('SELECT path FROM files WHERE project_id = $1', [projectId]);
        const dbFilePaths = new Set(dbFilesResult.rows.map(row => path.join(projectPath, row.path)));

        // 4. FIND FILES TO ADD
        const filesToAdd = fsFiles.filter(file => !dbFilePaths.has(file));

        // 5. SORT FILES BY PATH DEPTH
        filesToAdd.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length);

        // 6. INSERT FILES INTO DB
        for (const file of filesToAdd) {
            const relativePathRaw = path.relative(projectPath, file);
            const relativePath = relativePathRaw.replace(/\\/g, '/');
            const parentDir = path.dirname(relativePath);
            const name = path.basename(file);
            const is_folder = fs.statSync(file).isDirectory();
            const content = is_folder ? null : fs.readFileSync(file, 'utf-8');

            let parent_id = null;
            if (parentDir !== '.') {
                const parentResult = await db.query('SELECT id FROM files WHERE project_id = $1 AND path = $2', [projectId, parentDir]);
                if (parentResult.rows.length > 0) {
                    parent_id = parentResult.rows[0].id;
                }
            }

            await db.query(
                'INSERT INTO files (project_id, name, content, path, parent_id, is_folder) VALUES ($1, $2, $3, $4, $5, $6)',
                [projectId, name, content, relativePath, parent_id, is_folder]
            );
        }

        res.status(200).json({ message: `Synchronization complete. ${filesToAdd.length} items added.` });

    } catch (error) {
        console.error('Error syncing filesystem to DB:', error);
        res.status(500).json({ message: 'Failed to synchronize file system and database.' });
    }
};