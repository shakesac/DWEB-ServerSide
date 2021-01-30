const port = process.env.SRV_PORT || 5000
const host = '127.0.0.1'
const mongoose = require('mongoose')
const dotenv = require('dotenv').config({ path: './config.env' })
const app = require('./app')

//Ligação à base de dados
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Ligação à base de dados realizada com sucesso.')
})

//INICIAR O SERVIDOR
app.listen(port, () => console.log('A correr em modo ' + process.env.NODE_ENV + '. http://' + host + ':' + port))