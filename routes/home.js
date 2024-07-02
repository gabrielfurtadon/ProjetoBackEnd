const express = require('express');
const PageModel = require('../models/PageModel');
const router = express.Router();

// Rota para a página inicial
router.get('/', (req, res) => {
    const pages = PageModel.getAllPages();
    res.render('home', { pages });
})

module.exports = router;