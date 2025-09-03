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
  const { name, content, parent_id } = req.body; // Changed parentId to parent_id
  const userId = req.user.id; // ASSUMING VERIFYTOKEN MIDDLEWARE

  if (!name) {
    return res.status(400).json({ message: 'File name is required.' });
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

    let newPath = path.join(projectPath, name);
    if (parent_id) {
        // Validate parent_id is an existing folder
        const parentResult = await db.query('SELECT path, is_folder FROM files WHERE id = $1 AND project_id = $2', [parent_id, projectId]);
        if (parentResult.rows.length === 0 || !parentResult.rows[0].is_folder) {
            return res.status(400).json({ message: 'Parent ID must be an existing folder.' });
        }
        const parentPath = parentResult.rows[0].path;
        newPath = path.join(projectPath, parentPath, name);
    }

    fs.writeFileSync(newPath, content || '');

    const relativePath = path.relative(projectPath, newPath);

    // INSERT THE NEW FILE, setting is_folder to FALSE
    const result = await db.query(
      'INSERT INTO files (project_id, name, content, path, parent_id, is_folder) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *',
      [projectId, name, content || '', relativePath, parent_id]
    );

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
 * RETRIEVES ALL FILES FOR A SPECIFIC PROJECT.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getFiles = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    // VERIFY THAT THE PROJECT EXISTS AND BELONGS TO THE USER
    const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    // SELECT is_folder column
    const files = await db.query('SELECT id, project_id, name, path, content, parent_id, created_at, updated_at, is_folder FROM files WHERE project_id = $1 ORDER BY name', [projectId]);
    res.status(200).json(files.rows);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Failed to retrieve files.' });
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
 * DELETES A SPECIFIC FILE.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.deleteFile = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;

  try {
    // SIMILAR TO UPDATE, WE ENSURE THE USER OWNS THE PROJECT THIS FILE BELONGS TO
    const result = await db.query(
      `DELETE FROM files f
       USING projects p
       WHERE f.id = $1 AND f.project_id = p.id AND p.user_id = $2
       RETURNING f.id, f.path, f.project_id, f.is_folder`, // Added f.is_folder to returned columns
      [fileId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'File not found or access denied.' });
    }

    const projectPath = path.join(__dirname, '..', '..', 'user_projects', result.rows[0].project_id.toString());
    const filePath = path.join(projectPath, result.rows[0].path);

    // If it's a folder, remove the directory recursively
    if (result.rows[0].is_folder) {
        fs.rmSync(filePath, { recursive: true, force: true });
    } else if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file.' });
  }
};
