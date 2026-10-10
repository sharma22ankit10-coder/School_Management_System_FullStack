const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'fallback_secret';

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(h.split(' ')[1], SECRET);
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}

function optionalAuth(req, res, next) {
  const h = req.headers.authorization;
  if (h) {
    try { req.user = jwt.verify(h.split(' ')[1], SECRET); } catch {}
  }
  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

function teacherOrAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') return res.status(403).json({ error: 'Admin or Teacher only' });
  next();
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

module.exports = { auth, optionalAuth, adminOnly, teacherOrAdmin, signToken };
