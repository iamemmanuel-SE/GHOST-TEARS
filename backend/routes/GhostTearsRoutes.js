const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {updateUserStatus, getActiveUsers} = require('../controllers/GhostTController')


const router = express.Router()

router.use(requireAuth)

// Get game home page
router.get('/', getActiveUsers)

router.patch('/:id', updateUserStatus)



module.exports = router