const express = require('express')
const movieContr = require('./../controllers/movieController')
const authContr = require('./../controllers/authController')
const router = express.Router()

//MIDDLEWARE


// ROUTES
router.route('/').get(authContr.protect, movieContr.getAllMovies).post(authContr.protect, authContr.restrictTo('admin'), movieContr.createMovie)
router.route('/:id').get(movieContr.getMovie).patch(authContr.protect, authContr.restrictTo('admin'), movieContr.updateMovie).delete(authContr.protect, authContr.restrictTo('admin'), movieContr.deleteMovie)

//Exportar movieRouter
module.exports = router