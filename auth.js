const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key'; // Replace with your secret key

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
