const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ error: 'Authorization header missing' })
    const parts = auth.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization format' })
    const token = parts[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach user minimal info to req.user
    req.user = { id: payload.id, role: payload.role, baseId: payload.baseId }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = { requireAuth }
