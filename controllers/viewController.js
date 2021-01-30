const Movie = require('../models/movieModel')
const User = require('../models/userModel')

exports.getRecents = async (req, res, next) => {
    try {
        //Receber dados da coleccao da base de dados
        const movies = await Movie.find().sort({createdAt: -1})
        // Contruir o template

        res.status(200).render('recents', {
            title: "Novidades",
            movies
        })
    } catch (err) {

    }

}

exports.adminMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort({createdAt: -1})
        res.status(200).render('admin/movies', {
            title: "Gerir Filmes",
            type: "movies",
            movies
        })
    } catch (err) {

    }
}

exports.adminUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).render('admin/users', {
            title: "Gerir Utilizadores",
            type: "users",
            users
        })
    } catch (err) {

    }
}

exports.getAPIDocs = async (req, res) => {
    res.status(200).render('api', {
        title: "Documentação API",
    })
}