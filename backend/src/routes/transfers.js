const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { canCreateTransfer } = require('../middleware/rbac')
const { listTransfers, createTransfer } = require('../controllers/transfers')

router.get('/', requireAuth, listTransfers)
router.post('/', requireAuth, canCreateTransfer, createTransfer)

module.exports = router
