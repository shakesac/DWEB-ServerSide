const express = require('express')
const viewContr = require('../controllers/viewController')
const authContr = require('../controllers/authController')
const router = express.Router()

// ROUTES
router.use(authContr.isLoggedIn)
router.get('/', viewContr.getRecents)
router.get('/apidocs', viewContr.getAPIDocs)
router.get('/admin', authContr.protect, authContr.restrictTo('admin'), viewContr.adminMovies)
router.get('/admin/utilizadores', authContr.protect, authContr.restrictTo('admin'), viewContr.adminUsers)

module.exports = router