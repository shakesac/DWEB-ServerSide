const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//SCHEMAS (a usar validators)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,  //Trim remove espaços no inicio e fim das strings
        maxlength: [100, 'O nome nâo pode ter mais de 100 caracteres.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,  //Trim remove espaços no inicio e fim das strings
        lowercase: true,
        maxlength: [350, 'O email não pode ter mais de 350 caracteres.'],
        validate: [validator.isEmail, 'Email inválido.']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Senha tem que ter mais de 8 caracteres.'],
        maxlength: [64, 'Senha tem que ter menos de 65 caracteres.']
    },
    password_confirm: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'As senhas não são iguais.'
        }
    }
})

//MIDDLEWARE
// Usamos o modulo bcryptjs para encriptar a senha na base de dados.
userSchema.pre('save', async function(next) {  //Da biblioteca Mongoose
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)  //Salt (12) é para gerar random strings para nao repeitr a mesma hash na mesma senha
    this.password_confirm = undefined
    next()
})

userSchema.methods.correctPassword =  async function(candidata) {  //Compara a senha introduzida no body com a password de utilizador.
    return await bcrypt.compare(candidata, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User