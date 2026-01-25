import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'm_timepiece_dev_secret_2024';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  // Remove Bearer prefix if present
  const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(tokenString, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Require Admin Role' });
  }
  next();
};
