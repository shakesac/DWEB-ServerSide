const path = require('path')
const express = require('express')
const AppError = require('./utils/appError')
const movieRouter = require('./routes/movieRoutes')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const cors = require('cors')
const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))  // Cria o caminho baseado na directoria onde corre
app.use(express.static(path.join(__dirname, 'public')))


//MIDDLEWARE
//HTTPS headers & Security
//app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(cors())


app.use(express.json({limit: '50kb'}))
app.use(express.urlencoded({extended: true, limit: '50kb'}))
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})


//ROUTES
app.use('/', viewRouter)
app.use('/api/movies', movieRouter)
app.use('/api/users', userRouter)

//ERRO AUSENCIA DE ROTA
//(mensagem, codigo de erro, status)
app.all('*', (req, res, next) => {
    next(new AppError('O caminho ' + req.originalUrl + ' não foi encontrado no YAMDB.', 404, 'fail'))
})

//EROOR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500  //Caso nao exista codigo de erro definido, usamos 500 como padrão
    err.status = err.status || 'error'
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

module.exports = app