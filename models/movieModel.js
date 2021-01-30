const mongoose = require('mongoose')

//SCHEMAS (a usar validators)
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'O filme tem que ter um título'],
        unique: true,
        trim: true,  //Trim remove espaços no inicio e fim das strings
        maxlength: [100, 'O título não pode conter mais de 100 caracteres']
    },
    org_title: {
        type: String,
        trim: true,
        maxlength: [100, 'O título original não pode conter mais de 100 caracteres.']
    },
    duration: {
        type: Number,
        required: [true, 'O filme requer a duração em minutos.'],
        max: [2000, 'Unidade de tempo deve ser minutos.']
    },
    year: {
        type: Number,
        required: [true, 'O filme tem que ter o ano de lançamento.'],
        min: [1880, 'Nao existem filmes anteriores a 1880.'],
        max: [2200, 'Nao existem filmes anteriores a 2200.']
    },
    overview: {
        type: String,
        trim: true,
        maxlength: [1500, 'Sinopse não pode ter mais que 1500 caracteres.']
    },
    imdb_rating: {
        type: Number,
        required: [true, 'O filme tem que ter avaliação do IMDB'],
        min: [0, 'Avaliação tem que ser entre 0 e 10.'],
        max: [10, 'Avaliação tem que ser entre 0 e 10.']
    },
    img_url: {
        type: String,
        default: 'https://m.media-amazon.com/images/S/sash/85lhIiFCmSScRzu.png',
        maxlength: [500, 'O link é demasiado comprido.']
    },
    createdAt: {
        type: Date,
        default: Date.now()  //retorna data em milisegundos mas o MongoDB converte para data.
    }
})


//MODELS
const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie;