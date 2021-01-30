const util = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const User = require('./../models/userModel')
const sendEmail = require('./../utils/email')

const signToken = id => {
    return jwt.sign({ id },  //Cria o token
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), //Converte o valor para dias
        httpOnly: true, //Previne modificações externas ao cookie
        secure: true  // Usar apenas com certificado. Força utilização de SSL
    })
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password_confirm: req.body.password_confirm
        })
        //Email de confirmação
        const message = 'Olá ' + newUser.name + ', bem-vindo ao YAMDB.\nO registo foi realizado com sucesso.'
        try {
            await sendEmail({
                email: newUser.email,
                subject: 'Bem-vindo ao YAMDB!',
                message
            })
        } catch (err) {
            next(new AppError('Ocorreu um problema ao enviar o email.', 500, 'error'))
        }
        createAndSendToken(newUser, 201, res)
    } catch (err) {
        return next(new AppError('Erro no registo.', 400, 'fail'))
    }

}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email
        const password = req.body.password

        if (!email || !password) {   //Verifica se o email e password estao preenchidos.~
            return next(new AppError('Preencha o email e senha', 400, 'fail'))
        }
        const user = await User.findOne({email})
        if (!user || !(await user.correctPassword(password))) {
            return next(new AppError('Email e/ou senha errados.', 401, 'fail'))
        }
        // Caso esteja tudo OK, enviar token para o cliente
        createAndSendToken(user, 200, res)
    } catch (err) {
        return next(new AppError('Erro ao iniciar sessão.', 400, 'fail'))
    }
}

// Middleware de verificação de autenticação
exports.protect = async (req, res, next) => {
    try{
        // Get o token e verificar se este existe
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {   // Login na API usando o header
        token = req.headers.authorization.split(' ')[1]   // Separa o valor de authorization pelo espaço e ficxa com o valor da key
    } else if (req.cookies.jwt) {  // Faz login com o cookie
        token = req.cookies.jwt
    }
    if (!token) {
        return next(new AppError('Não tem sessão iniciada.', 401, 'fail'))
    }
    // Validar o token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //Verificar se o token corresponde a um utilizador que já nao existe.
    const thisUser = await User.findById(decoded.id)
    if (!thisUser) {
        return next(new AppError('O utilizador já não existe.', 401, 'fail'))
    }
    req.user = thisUser;
    next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Token inválido. Inicie a sessão novamente.', 401, 'fail'))
        } else if (err.name === 'TokenExpiredError') {
            return next(new AppError('Token expirado. Inicie a sessão novamente.', 401, 'fail'))
        } else {
            return next(new AppError('Erro de token.', 500, 'fail'))
        }
    }
}

// Função apenas para a renderização das paginas web
// Verifica se o utilizador esá logado ou não.
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await util.promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            const thisUser = await User.findById(decoded.id)
            if (!thisUser) {
                return next()
            }
            res.locals.user = thisUser;
            return next()
        } catch (err) {
            return next()
        }
    }
    next()   
}

exports.logout = (req, res) => {  // Como usamos o cookie httpOnly, não é possivel manipula-lo. Por isso temos que usar esta funcao para susbtitui-lo por um dummy com 10seg de validade
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({status: 'success'})
}

exports.restrictTo = (...roles) => {  //Verificar se o papel assignado ao utilizador tem permissao para a área restrita
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Não tem autorização para realizar esta acção.', 403, 'fail'))
        }
        next()
    }
}

// Alterar a password do utilizador com a sessão aberta
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {  // Verificação da senha actual.
            return next(new AppError('A senha actual introduzida está incorrecta.', 401, 'fail'))
        }
        user.password = req.body.password
        user.password_confirm = req.body.password_confirm
        if (user.password !== user.password_confirm) {
            return next(new AppError('A senha e a confirmação de senha não coincidem.', 401, 'fail'))
        }
        await user.save()
        const token = signToken(user._id)
        createAndSendToken(user, 200, res)
    } catch (err) {
        return next(new AppError('Ocorreu um erro. Senha não alterada.', 500, 'error'))
    }
}