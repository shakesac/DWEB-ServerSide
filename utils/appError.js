class AppError extends Error {
    constructor(message, statusCode, status) {
        super(message)   // O message já pertence à classe pai Error
        this.statusCode = statusCode
        this.status = status
        Error.captureStackTrace(this, this.constructor)  // Adicionar este 
    }
}

module.exports = AppError