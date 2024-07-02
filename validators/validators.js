const { body, validationResult } = require('express-validator');

// Função que retorna um array de regras de validação para login
const loginValidationRules = () => {
    return [
        body('user')
            .notEmpty().withMessage('O usuário não pode estar vazio.')
            .trim().escape(),
        body('password')
            .notEmpty().withMessage('A senha não pode estar vazia.')
            .trim().escape()
    ]
}

// Função que retorna um array de regras de validação para usuário e senha
const userValidationRules = () => {
    return [
        body('user')
            .notEmpty().withMessage('O usuário não pode estar vazio.')
            .bail()
            .matches(/^\S*$/).withMessage('O usuário não pode conter espaços em branco.')
            .trim().escape(),
        body('password')
            .notEmpty().withMessage('A senha não pode estar vazia.')
            .bail()
            .matches(/^\S*$/).withMessage('A senha não pode conter espaços em branco.')
            .bail()
            .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres.')
            .trim().escape()
    ]
}

// Função que retorna um array de regras de validação para uma página
const pageValidationRules = () => {
    return [
        body('url')
            .notEmpty().withMessage('A URL não pode estar vazia.')
            .bail()
            .matches(/^\S*$/).withMessage('A URL não pode conter espaços em branco.')
            .trim().escape(),
        body('title')
            .notEmpty().withMessage('O título não pode estar vazio.')
            .bail()
            .isLength({ min: 5, max: 50 }).withMessage('O título deve ter entre 5 e 50 caracteres.')
            .trim().escape(),
        body('content')
            .notEmpty().withMessage('O conteúdo não pode estar vazio.')
            .bail()
            .isLength({ min: 20 }).withMessage('O conteúdo deve ter no mínimo 20 caracteres')
            .trim()
    ]
}

// Função middleware para validar dados
const validateData = (req, res, next) => {
    // Verifica se há erros de validação nos dados do formulário
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Define uma mensagem de erro, se houver
        req.errorMessages = errors.array().map(error => error.msg);
    }
    // Chama o próximo middleware
    next();
}

// Função auxiliar para lidar com erros de validação
const handleValidationErrors = (req, res) => {
    if (req.errorMessages) {
        return res.status(400).json({ errors: req.errorMessages });
    }
    return null;
}

module.exports = { loginValidationRules, userValidationRules, pageValidationRules, validateData, handleValidationErrors }