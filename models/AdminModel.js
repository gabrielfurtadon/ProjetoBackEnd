const fs = require('fs');
const crypto = require('crypto');

class AdminModel {
    constructor() {
        // Singleton para garantir apenas uma instância da classe
        if (AdminModel.instance) return AdminModel.instance;
        // Inicializa a lista e carrega os administradores do arquivo admins.txt
        this.administrators = [];
        this.loadAdminsFromFile();
        // Armazena a instância atual para que seja única
        AdminModel.instance = this;
    }

    // Método para validar as credenciais
    validateCredentials(user, password) {
        // Procura um administrador pelo nome
        const admin = this.findAdmin(user);
        // Verifica se o administrador foi encontrado e se a senha corresponde
        if (admin && admin.password === password) return true;
        return false;
    }

    // Método para adicionar um novo administrador
    addAdministrator(user, password) {
        // Verifica se já existe um administrador com o mesmo usuário
        const existingAdmin = this.findAdmin(user);
        if (existingAdmin) return false;
        // Gera um ID único para o novo administrador
        const id = crypto.randomUUID();
        // Adiciona o novo administrador à lista e salva no arquivo
        this.administrators.push({ id, user, password });
        this.saveAdminsToFile();
        return true;
    }

    // Método para editar um administrador pelo ID
    editAdministrator(id, newUser, newPassword) {
        // Busca pelo administrador
        const admin = this.administrators.find(admin => admin.id === id);
        if (!admin) {
            return false;
        }
        // Verifica se já existe um administrador com o novo nome de usuário, exceto o atual administrador
        const userExists = this.administrators.some(admin => admin.user === newUser && admin.id !== id);
        if (userExists) {
            return false;
        }
        // Atualiza os dados
        admin.user = newUser;
        admin.password = newPassword;
        this.saveAdminsToFile();
        return true;
    }

    // Método para deletar um administrador pelo ID
    deleteAdministrator(id) {
        // Busca pelo índice do administrador
        const index = this.administrators.findIndex(admin => admin.id === id);
        if (index !== -1) {
            // Remove o administrador da lista
            this.administrators.splice(index, 1);
            // Salva a lista atualizada
            this.saveAdminsToFile();
            return true;
        }
        return false;
    }

    // Método para carregar os administradores do arquivo 'admins.txt'
    loadAdminsFromFile() {
        try {
            // Lê os dados do arquivo
            const data = fs.readFileSync('admins.json', 'utf8');
            // Converte os dados para um array de objetos
            this.administrators = JSON.parse(data);
        } catch (err) {
            // Exibe mensagem de erro se houver problemas na leitura do arquivo
            console.error('Erro ao carregar administradores do arquivo:', err.message);
        }
    }

    // Método para salvar os administradores no arquivo 'admins.txt'
    saveAdminsToFile() {
        try {
            // Converte a lista de administradores para JSON
            const data = JSON.stringify(this.administrators);
            // Escreve os dados no arquivo
            fs.writeFileSync('admins.json', data);
        } catch (err) {
            // Exibe mensagem de erro se houver problemas na escrita do arquivo
            console.error('Erro ao salvar administradores no arquivo:', err.message);
        }
    }

    // Método para obter todos os administradores ordenados por nome de usuário
    getAdministrators() {
        this.loadAdminsFromFile();
        return this.administrators.sort((a, b) => a.user.localeCompare(b.user));
    }

    // Método para encontrar um administrador pelo nome de usuário
    findAdmin(user) {
        this.loadAdminsFromFile();
        return this.administrators.find(admin => admin.user === user);
    }
}

// Exporta uma instância única da classe AdminModel
module.exports = new AdminModel();