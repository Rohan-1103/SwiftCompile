const db = require('../db/db');

// UTILITY FUNCTION TO GET A DATABASE CLIENT
const getClient = async () => {
  const client = await db.pool.connect();
  return client;
};

// PRE-DEFINED TEMPLATES FOR DIFFERENT PROJECT LANGUAGES
const fileTemplates = {
  web: [
    { name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Welcome to your new project!</h1>\n  <script src="script.js"></script>\n</body>\n</html>' },
    { name: 'style.css', content: 'body {\n  font-family: sans-serif;\n}' },
    { name: 'script.js', content: 'console.log("Hello, world!");' }
  ],
  python: [
    { name: 'main.py', content: '# Your Python code here' }
  ],
  javascript: [
    { name: 'index.js', content: '// Your JavaScript code here' }
  ]
};

/**
 * CREATES A NEW PROJECT, GENERATES INITIAL TEMPLATE FILES BASED ON THE CHOSEN LANGUAGE,
 * AND RETURNS THE COMPLETE NEW PROJECT OBJECT WITH ITS FILES.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.createProject = async (req, res) => {
  const { name, language } = req.body;
  const userId = req.user.id; // ASSUMING VERIFYTOKEN MIDDLEWARE ADDS USER TO REQ

  if (!name || !language) {
    return res.status(400).json({ message: 'Project name and language are required.' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    // INSERT THE NEW PROJECT INTO THE DATABASE
    const projectResult = await client.query(
      'INSERT INTO projects (user_id, name, language) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, language]
    );
    const newProject = projectResult.rows[0];

    // CREATE INITIAL FILES BASED ON THE PROJECT LANGUAGE
    const template = fileTemplates[language] || [];
    const files = [];

    for (const file of template) {
      const fileResult = await client.query(
        'INSERT INTO files (project_id, name, content, path) VALUES ($1, $2, $3, $4) RETURNING *',
        [newProject.id, file.name, file.content, file.name]
      );
      files.push(fileResult.rows[0]);
    }

    await client.query('COMMIT');

    // RESPOND WITH THE NEW PROJECT AND ITS FILES
    res.status(201).json({ ...newProject, files });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project.' });
  } finally {
    client.release();
  }
};

/**
 * RETRIEVES ALL PROJECTS FOR THE AUTHENTICATED USER.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(`
      SELECT p.*, (
        SELECT MAX(f.updated_at)
        FROM files f
        WHERE f.project_id = p.id
      ) as updated_at
      FROM projects p
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Failed to retrieve projects.' });
  }
};

/**
 * RETRIEVES A SINGLE PROJECT BY ITS ID, INCLUDING ALL ITS ASSOCIATED FILES.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // FIRST, GET THE PROJECT TO ENSURE IT EXISTS AND BELONGS TO THE USER
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, userId]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    const project = projectResult.rows[0];

    // THEN, GET ALL THE FILES FOR THAT PROJECT
    const filesResult = await db.query('SELECT * FROM files WHERE project_id = $1 ORDER BY name', [id]);
    project.files = filesResult.rows;

    res.status(200).json(project);
  } catch (error) {
    console.error('Error getting project by ID:', error);
    res.status(500).json({ message: 'Failed to retrieve project.' });
  }
};
