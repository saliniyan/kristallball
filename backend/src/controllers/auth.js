const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function loginController(req, res, next) {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' })
    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ error: 'Invalid username or password' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid username or password' })
    const token = jwt.sign({ id: user._id, role: user.role, baseId: user.baseId }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, baseId: user.baseId, baseName: user.baseName } })
  } catch (err) {
    next(err)
  }
}

module.exports = { loginController }
