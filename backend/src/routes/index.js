const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/refs', require('./refs'))
router.use('/dashboard', require('./dashboard'))
router.use('/purchases', require('./purchases'))
router.use('/transfers', require('./transfers'))
router.use('/assignments', require('./assignments'))
router.use('/expenditures', require('./expenditures'))

module.exports = router
