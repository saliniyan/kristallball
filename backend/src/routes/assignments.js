const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { canCreateAssignment } = require('../middleware/rbac')
const { listAssignments, createAssignment } = require('../controllers/assignments')

router.get('/', requireAuth, listAssignments)
router.post('/', requireAuth, canCreateAssignment, createAssignment)

module.exports = router
