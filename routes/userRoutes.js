const express = require('express')
const userContr = require('./../controllers/userController')
const authContr = require('./../controllers/authController')
const router = express.Router()

// AUTH ROUTES
router.post('/signup', authContr.signup)
router.post('/login', authContr.login)
router.get('/logout', authContr.logout)
router.patch('/updatePassword', authContr.protect, authContr.updatePassword)

//USER ROUTES
router.route('/').get(authContr.protect, authContr.restrictTo('admin'), userContr.getAllUsers).post(authContr.protect, authContr.restrictTo('admin'), userContr.createUser)
router.route('/:id').get(authContr.protect, authContr.restrictTo('admin'), userContr.getUser).patch(authContr.protect, authContr.restrictTo('admin'), userContr.updateUser).delete(authContr.protect, authContr.restrictTo('admin'), userContr.deleteUser)

module.exports = router