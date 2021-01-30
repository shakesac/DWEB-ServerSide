const User = require('./../models/userModel')
//MIDDLEWARE


//ROUTE HANDLERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort('email')
        res.status(200).json({ 
            status: 'success',
            users
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json({ 
            status: 'success',
            data: {
                user
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).send({
            status: 'success',
            message: 'Utilizador registado com sucesso',
            data: {
                user: newUser
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,  //Apenas retorna o que foi modificado
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
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