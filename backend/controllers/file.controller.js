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
  const { name, content, parentId } = req.body;
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

    const projectPath = path.join(__dirname, '..', '..', 'user_projects', projectId);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    let newPath = path.join(projectPath, name);
    if (parentId) {
        const parentResult = await db.query('SELECT path FROM files WHERE id = $1 AND project_id = $2', [parentId, projectId]);
        if (parentResult.rows.length > 0) {
            const parentPath = parentResult.rows[0].path;
            newPath = path.join(projectPath, parentPath, name);
        }
    }

    fs.writeFileSync(newPath, content || '');

    const relativePath = path.relative(projectPath, newPath);

    // INSERT THE NEW FILE
    const result = await db.query(
      'INSERT INTO files (project_id, name, content, path, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [projectId, name, content || '', relativePath, parentId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ message: 'Failed to create file.' });
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

    const files = await db.query('SELECT * FROM files WHERE project_id = $1 ORDER BY name', [projectId]);
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
       RETURNING f.id, f.path, f.project_id`,
      [fileId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'File not found or access denied.' });
    }

    const projectPath = path.join(__dirname, '..', '..', 'user_projects', result.rows[0].project_id.toString());
    const filePath = path.join(projectPath, result.rows[0].path);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file.' });
  }
};
