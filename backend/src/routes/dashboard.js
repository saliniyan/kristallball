const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { summaryController, netMovementDetailsController } = require('../controllers/dashboard')

router.get('/summary', requireAuth, summaryController)
router.get('/net-movement-details', requireAuth, netMovementDetailsController)

module.exports = router
