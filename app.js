// Configuração do path e das variáveis de ambiente
const path = require("path");
require("dotenv").config();

// Importações e configurações do Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do engine de visualização Mustache
const mustacheExpress = require("mustache-express");
const engine = mustacheExpress();
app.engine("mustache", engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

// Middleware para cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Middleware para sessão
const session = require("express-session");
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 300000 }
}));

// Middleware CSRF
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Importação do modelo AdminModel e adição do usário admin
const adminModel = require('./models/AdminModel.js');
const { LOGIN, PASSWORD } = process.env;
adminModel.addAdministrator(LOGIN, PASSWORD);

// Rotas da aplicação
app.use('/', require('./routes/home'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/page'));

// Middleware para lidar com erros na aplicação
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;