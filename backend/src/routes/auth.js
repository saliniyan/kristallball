const express = require('express')
const router = express.Router()
const { loginController } = require('../controllers/auth')

// POST /api/auth/login
router.post('/login', loginController)

module.exports = router
