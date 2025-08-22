const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { canCreatePurchase } = require('../middleware/rbac')
const { listPurchases, createPurchase } = require('../controllers/purchases')

router.get('/', requireAuth, listPurchases)
router.post('/', requireAuth, canCreatePurchase, createPurchase)

module.exports = router
