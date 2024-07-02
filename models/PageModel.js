const fs = require('fs');

// Define a classe PageModel para gerenciar páginas
class PageModel {
    constructor() {
        // Verifica se já existe uma instância da classe e retorna ela
        if (PageModel.instance) return PageModel.instance;
        // Inicializa a lista e carrega as páginas do arquivo pages.txt
        this.pages = {};
        this.loadPagesFromFile();
        // Armazena a instância atual para garantir que seja única
        PageModel.instance = this;
    }

    // Método para adicionar uma nova página
    addPage(userId, URL, title, content) {
        // Verifica se já existe uma página com a mesma URL
        if (this.getPageByURL(URL)) return false;
        // Inicializa o array de páginas para o userId se não existir
        if (!this.pages[userId]) {
            this.pages[userId] = [];
        }
        // Adiciona a nova página à lista e salva no arquivo
        this.pages[userId].push({ URL, title, content });
        this.savePagesToFile();
        // Retorna true após adicionar a página com sucesso
        return true;
    }

    // Método para editar uma página existente
    editPage(userId, URL, newTitle, newContent) {
        // Verifica se a página existe
        const page = this.pages[userId].find(page => page.URL === URL);
        // Retorna false se a página não existe
        if (!page) return false;
        // Altera o título e o conteúdo da página
        page.title = newTitle;
        page.content = newContent;
        // Salva as páginas novamente
        this.savePagesToFile();
        // Retorna true após editar a página com sucesso
        return true;
    }

    // Método para excluir uma página
    deletePage(userId, URL) {
        // Busca pela página
        const pageIndex = this.pages[userId].findIndex(page => page.URL === URL);
        // Retorna false se não encontrar a página
        if (pageIndex === -1) return false;
        // Remove a página da lista de páginas
        this.pages[userId].splice(pageIndex, 1);
        // Se a lista de páginas do userId estiver vazia, remove o userId
        if (this.pages[userId].length === 0) {
            delete this.pages[userId];
        }
        // Salva a nova lista de páginas
        this.savePagesToFile();
        // Retorna true após remover a página com sucesso
        return true;
    }

    // Método para carregar as páginas do arquivo 'pages.txt'
    loadPagesFromFile() {
        try {
            // Lê os dados do arquivo
            const data = fs.readFileSync('pages.json', 'utf8');
            // Converte os dados para um array de objetos
            this.pages = JSON.parse(data);
        } catch (err) {
            // Exibe mensagem de erro se houver problemas na leitura do arquivo
            console.error('Erro ao carregar páginas do arquivo:', err.message);
        }
    }

    // Método para salvar as páginas no arquivo 'pages.txt'
    savePagesToFile() {
        try {
            // Converte a lista de páginas para JSON
            const data = JSON.stringify(this.pages);
            // Escreve os dados no arquivo
            fs.writeFileSync('pages.json', data);
        } catch (err) {
            // Exibe mensagem de erro se houver problemas na escrita do arquivo
            console.error('Erro ao salvar páginas no arquivo:', err.message);
        }
    }

    // Método para obter páginas por userId
    getPagesByUserID(userId) {
        this.loadPagesFromFile();
        return this.pages[userId] || [];
    }

    // Método para obter uma página por URL globalmente
    getPageByURL(URL) {
        this.loadPagesFromFile();
        for (let userId in this.pages) {
            const page = this.pages[userId].find(page => page.URL === URL);
            if (page) return page;
        }
        return null;
    }

    // Método para obter todas as páginas
    getAllPages() {
        this.loadPagesFromFile();
        let allPages = [];
        for (let userId in this.pages) {
            allPages = allPages.concat(this.pages[userId]);
        }
        return allPages;
    }
}

// Exporta uma instância única da classe PageModel para ser utilizada em outros módulos
module.exports = new PageModel();