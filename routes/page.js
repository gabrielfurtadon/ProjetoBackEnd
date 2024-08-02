const express = require('express');
const router = express.Router();
const pageModel = require('../models/PageModel.js');
const { isLogged } = require('../helpers/access.js');
const { pageValidationRules, validateData, handleValidationErrors } = require('../validators/validators.js');

// Função para registrar uma rota dinâmica
const registerPageRoute = (url, title, content) => {
    // Remove a rota existente, se houver
    removeExistingRoute(url);
    // Adiciona a nova rota
    router.get(`/pages/${url}`, (req, res) => {
        res.render('template', { title, content });
    });
}

// Função para remover uma rota existente
const removeExistingRoute = (url) => {
    const routePath = `/pages/${url}`;
    const routes = router.stack.filter(layer => layer.route && layer.route.path === routePath);
    routes.forEach(route => {
        router.stack.splice(router.stack.indexOf(route), 1);
    });
}

// Inicializar rotas dinâmicas existentes
const initializeDynamicRoutes = () => {
    const pages = pageModel.getAllPages();
    pages.forEach(page => {
        registerPageRoute(page.URL, page.title, page.content);
    });
}

// Rota para adicionar uma nova página
router.post('/newPage', isLogged, pageValidationRules(), validateData, (req, res) => {
    // Verifica e manipula erros de validação
    if (handleValidationErrors(req, res)) return;
    // Obtém dados da nova página
    const { url, title, content } = req.body;
    const userId = req.session.admin.id;
    // Tenta adicionar a página
    if (!pageModel.addPage(userId, url, title, content)) {
        return res.status(400).json({ errors: ['Já existe uma página com essa URL.'] });
    }
    // Registra a nova rota dinâmica
    registerPageRoute(url, title, content);
    return res.status(200).json({ message: ['Página criada com sucesso!'] });
});

// Rota para edtar uma página
router.put('/editPage', isLogged, pageValidationRules(), validateData, (req, res) => {
    // Verifica e manipula erros de validação
    if (handleValidationErrors(req, res)) return;
    // Obtém dados de edição da página
    const { url, title, content } = req.body;
    const userId = req.session.admin.id;
    // Tenta editar o administrador
    if (!pageModel.editPage(userId, url, title, content)) {
        return res.status(400).json({ errors: ['Já exist um usuário com essa URL.'] });
    }
    // Atualiza a rota dinâmica existente
    registerPageRoute(url, title, content);
    return res.status(201).json({ message: ['Página editada com sucesso!'] });
});

// Rota para excluir uma página
router.delete('/deletePage', isLogged, (req, res) => {
    // Obtém a url da página a ser excluída
    const { url } = req.body;
    const userId = req.session.admin.id;
    // Tenta excluir a página
    if (!pageModel.deletePage(userId, url)) {
        return res.status(400).json({ error: 'Erro ao excluir página.' });
    }
    // Remove a rota dinâmica existente
    removeExistingRoute(url);
    return res.status(204).json({});
});

// Inicializa as rotas ao iniciar o servidor
initializeDynamicRoutes();

module.exports = router;