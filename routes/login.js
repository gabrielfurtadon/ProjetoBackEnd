const express = require('express');
const router = express.Router();
const adminModel = require('../models/AdminModel.js');
const { loginValidationRules, validateData } = require('../validators/validators.js');

// Rota para renderizar a página de login
router.get('/login', (req, res) => {
    // Verifica se o usuário já está autenticado e redireciona para admin
    if (req.session.authenticated) res.redirect('/admin');
    else {
        // Renderiza a página de login com o token CSRF e mensagem de erro, se houver
        const errorLogin = req.session.errorLogin;
        delete req.session.errorLogin;
        res.render('login', { csrfToken: req.csrfToken(), error: errorLogin, hasError: errorLogin != null });
    }
})

// Rota para processar o formulário de login
router.post('/login', loginValidationRules(), validateData, (req, res) => {
    if (req.errorMessages) {
        // Se houver erro de validação, armazena mensagem de erro na sessão
        req.session.errorLogin = req.errorMessages;
        // Redireciona de volta para a página de login
        return res.redirect('/login');
    }
    // Obtém os dados do formulário
    const { user, password } = req.body;
    // Verifica se as credenciais são válidas
    if (adminModel.validateCredentials(user, password)) {
        // Define a sessão como autenticada e armazena o usuário na sessão
        req.session.authenticated = true;
        req.session.admin = adminModel.findAdmin(user);
        // Redireciona para a página admin após o login bem-sucedido
        res.redirect('/admin');
    } else {
        // Define uma mensagem de erro na sessão
        req.session.errorLogin = 'Falha ao realizar login.';
        // Redireciona de volta para login
        res.redirect('/login');
    }
})

// Rota para o processo de logout
router.get('/logout', (req, res) => {
    // Destroi a sessão
    req.session.destroy();
    // Redireciona para a página inicial
    res.redirect('/');
})

module.exports = router;