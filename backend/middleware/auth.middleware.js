const jwt = require('jsonwebtoken');

// MIDDLEWARE TO VERIFY JWT TOKEN
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Malformed token.' });
  }

  // VERIFY THE TOKEN USING THE SECRET KEY
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }

    // IF VERIFICATION IS SUCCESSFUL, SAVE THE DECODED USER ID TO THE REQUEST OBJECT
    req.user = { id: decoded.id };
    next();
  });
};

module.exports = verifyToken;
