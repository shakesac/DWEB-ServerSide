const Movie = require('./../models/movieModel')

// ROUTE HANDLERS
exports.getAllMovies = async (req, res) => {
    try {
        const queryObj = {...req.query}  //Cria um novo objecto com os campos do request
        const excluded = ['page', 'sort', 'limit', 'fields']  //Campos a excluir da query
        excluded.forEach(el => delete queryObj[el])  // Remove os campos a excluir 
        let query = Movie.find().where(queryObj)  //construção da query
        if (req.query.sort) {
            query.sort(req.query.sort)  // Usar o parametro sort
        }
        //Filtrar campos
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ') //Separa a string pela virgula (que vem do URL) e juntamos com um espaço
            query = query.select(fields)
        } else {
            query = query.select('-__v')  // Remove o campo '__v' usado pelo mongodb
        }
        // Paginação
        const page = req.query.page * 1 || 1  //define o valor padrão da página
        const limit = req.query.limit * 1 || 20  //define numero de resultados padrao
        const skip = (page - 1) * limit  //define o skip para comecar no 1, 11, 21, por aí fora
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const numMovies = await Movie.countDocuments()
            if (skip >= numMovies) throw new Error()
        }
        const movies = await query  //Execução da query
        res.status(200).json({ 
            status: 'success',
            results: movies.length,
            requestedAt: req.requestTime,
            data: {
                movies: movies
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })

    }
}

exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        res.status(200).json({ 
            status: 'success',
            data: {
                movie
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createMovie = async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body)
        res.status(201).send({
            status: 'success',
            message: 'Filme adicionado à BD com sucesso.',
            data: {
                movie: newMovie
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//PATCH
exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,  //Apenas retorna o que foi modificado
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}