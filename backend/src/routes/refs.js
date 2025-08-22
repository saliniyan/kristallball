const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { getBases, getEquipmentTypes } = require('../controllers/refs')

router.get('/bases', requireAuth, getBases)
router.get('/equipment-types', requireAuth, getEquipmentTypes)

module.exports = router
