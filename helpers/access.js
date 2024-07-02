module.exports = {
    // Middleware para verificar se o usuário está autenticado
    isLogged: (req, res, next) => {
        if (req.session.authenticated) next();
        else {
            // Se não estiver autenticado, define uma mensagem de erro na sessão
            req.session.errorLogin = "Usuário não autenticado";
            // Redireciona o usuário para a pagina de login
            res.redirect("/login");
        }
    }
}
