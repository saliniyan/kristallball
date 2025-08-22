const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { canCreateExpenditure } = require('../middleware/rbac')
const { listExpenditures, createExpenditure } = require('../controllers/expenditures')

router.get('/', requireAuth, listExpenditures)
router.post('/', requireAuth, canCreateExpenditure, createExpenditure)

module.exports = router
