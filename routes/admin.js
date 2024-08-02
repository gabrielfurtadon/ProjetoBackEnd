const express = require('express');
const router = express.Router();
const adminModel = require('../models/AdminModel.js');
const pageModel = require('../models/PageModel.js');
const { isLogged } = require('../helpers/access.js');
const { userValidationRules, validateData, handleValidationErrors } = require('../validators/validators.js');

// Rota para renderizar a página admin
router.get('/admin', isLogged, (req, res) => {
    // Obtém a lista de administradores e de páginas
    const administrators = adminModel.getAdministrators();
    const userId = req.session.admin.id;
    const pages = pageModel.getPagesByUserID(userId);
    res.render('admin', {
        csrfToken: req.csrfToken,     // Token CSRF para segurança
        user: req.session.admin.user, // Usuário da sessão atual
        administrators,               // Lista de administradores
        pages                         // Lista de páginas do usuário logado
    });
});

// Rota para adicionar um novo administrador
router.post('/newAdmin', isLogged, userValidationRules(), validateData, (req, res) => {
    // Verifica e manipula erros de validação
    if (handleValidationErrors(req, res)) return;
    // Obtém dados do novo administrador
    const { user, password } = req.body;
    // Tenta adicionar o administrador
    if (!adminModel.addAdministrator(user, password)) {
        return res.status(400).json({ errors: ['Já existe um usuário com esse nome.'] });
    }
    return res.status(200).json({ message: ['Administrador criado com sucesso!'] });
});

// Rota para editar um administrador existente
router.put('/editAdmin', isLogged, userValidationRules(), validateData, (req, res) => {
    // Verifica e manipula erros de validação
    if (handleValidationErrors(req, res)) return;
    // Obtém dados de edição do administrador
    const { id, user, password } = req.body;
    // Tenta editar o administrador
    if (!adminModel.editAdministrator(id, user, password)) {
        return res.status(400).json({ errors: ['Já existe um usuário com esse nome.'] });
    }
    return res.status(201).json({ message: ['Administrador editado com sucesso'] });
});

// Rota para excluir um administrador
router.delete('/deleteAdmin', isLogged, (req, res) => {
    // Obtém o ID do administrador a ser excluído
    const { id } = req.body;
    // Tenta excluir o administrador
    if (adminModel.deleteAdministrator(id)) {
        // Se o administrador excluído for o próprio usuário logado
        if (id === req.session.admin.id) {
            // Redireciona para a rota de logout
            return res.redirect('/logout');
        }
        // Redireciona para a página admin após exclusão bem-sucedida
        return res.status(204).json({});
    }
    return res.status(400).json({ errors: ['Erro ao excluir administrador.'] });
});

module.exports = router;