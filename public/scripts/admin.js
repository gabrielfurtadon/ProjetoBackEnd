document.addEventListener('DOMContentLoaded', () => {
    // Elementos da página capturados pelo ID
    const elements = {
        token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        newPageButton: document.getElementById('newPageButton'),
        editPageButtons: document.querySelectorAll('#editPageButton'),
        deletePageButtons: document.querySelectorAll('#deletePageButton'),
        pageModalTitle: document.getElementById('pageModalTitle'),
        pageModalButton: document.getElementById('pageModalButton'),
        pageUrl: document.getElementById('url'),
        pageTitle: document.getElementById('title'),
        pageContent: document.getElementById('content'),
        errorPage: document.getElementById('errorPage'),
        newAdminButton: document.getElementById('newAdminButton'),
        editAdminButtons: document.querySelectorAll('#editAdminButton'),
        deleteAdminButtons: document.querySelectorAll('#deleteAdminButton'),
        adminModalTitle: document.getElementById('adminModalTitle'),
        adminModalButton: document.getElementById('adminModalButton'),
        adminId: document.getElementById('adminId'),
        user: document.getElementById('user'),
        password: document.getElementById('password'),
        errorAdmin: document.getElementById('errorAdmin'),
        closeButtons: document.querySelectorAll('#btnClose'),
        forms: document.querySelectorAll('#modalForm'),
        toast: new bootstrap.Toast('.toast'),
        toastMessage: document.getElementById('toastMessage')
    }

    // Função para definir o atributo 'action' do formulário
    const setFormLink = link => {
        elements.forms.forEach(form => form.setAttribute('action', link));
    }

    // Função para limpar todos os formulários e mensagens de erro
    const clearForms = () => {
        elements.pageModalTitle.textContent = '';
        elements.pageModalButton.textContent = '';
        elements.pageUrl.removeAttribute('readonly');
        elements.pageUrl.style.backgroundColor = '#fff';
        elements.pageUrl.value = '';
        elements.pageTitle.value = '';
        elements.pageContent.value = '';
        elements.errorPage.innerHTML = '';
        elements.errorPage.classList.add('hide');
        elements.adminModalTitle.textContent = '';
        elements.adminModalButton.textContent = '';
        elements.adminId.value = '';
        elements.user.value = '';
        elements.password.value = '';
        elements.errorAdmin.innerHTML = '';
        elements.errorAdmin.classList.add('hide');
    }

    // Função para lidar com requisições AJAX
    const handleRequest = (url, jsonData, errorElement) => {
        fetch(url, {
            credentials: 'same-origin',
            headers: { 'CSRF-Token': elements.token, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(jsonData),
        })
            .then(response => {
                if (response.ok) {
                    // Redireciona para a página admin se o envio for bem-sucedido
                    window.location.href = '/admin';
                } else {
                    // Exibe mensagem de erro retornada pelo servidor
                    response.json().then(data => {
                        errorElement.innerHTML = '';
                        data.errors.forEach(error => {
                            const errorItem = document.createElement('div');
                            errorItem.textContent = error;
                            errorElement.appendChild(errorItem);
                        })
                        errorElement.classList.remove('hide');
                    }).catch(err => console.error('Erro ao parsear JSON:', err));
                }
            })
            .catch(error => console.error('Erro ao enviar a requisição:', error));
    }

    // Função para lidar com o evento de envio de formulário
    const onFormSubmit = event => {
        event.preventDefault();
        const form = event.target;
        const url = form.getAttribute('action');
        const data = new FormData(form);
        const jsonData = Object.fromEntries(data.entries());
        const errorElement = url.includes('Admin') ? elements.errorAdmin : elements.errorPage;
        handleRequest(url, jsonData, errorElement);
    }

    // Evento de clique para os botões de exclusão
    const onDeleteButtonClick = (url, dataKey) => event => {
        const button = event.target;
        const dataValue = button.getAttribute(`data-${dataKey}`);
        const jsonData = { [dataKey]: dataValue };
        handleRequest(url, jsonData, elements.toastMessage);
        elements.toast.show();
    }

    // Evento de clique para o botão de adicionar página
    elements.newPageButton.addEventListener('click', () => {
        elements.pageModalTitle.textContent = 'Criar nova Página';
        elements.pageModalButton.textContent = 'Criar';
        setFormLink('/newPage');
    })

    // Evento de clique para o botão de editar página
    elements.editPageButtons.forEach(button => button.addEventListener('click', () => {
        elements.pageModalTitle.textContent = 'Editar Página';
        elements.pageModalButton.textContent = 'Editar';
        elements.pageUrl.value = button.getAttribute('data-url');
        elements.pageTitle.value = button.getAttribute('data-title');
        elements.pageContent.value = button.getAttribute('data-content');
        elements.pageUrl.setAttribute('readonly', true);
        elements.pageUrl.style.backgroundColor = '#f8f9fa';
        setFormLink('/editPage');
    }))

    // Adiciona eventos aos botões de exclusão de página
    elements.deletePageButtons.forEach(button => {
        button.addEventListener('click', onDeleteButtonClick('/deletePage', 'url'));
    });

    // Evento de clique para o botão de adicionar administradores
    elements.newAdminButton.addEventListener('click', () => {
        elements.adminModalTitle.textContent = 'Criar novo Administrador';
        elements.adminModalButton.textContent = 'Criar';
        setFormLink('/newAdmin');
    });

    // Evento de clique para o botao de editar administradores
    elements.editAdminButtons.forEach(button => button.addEventListener('click', () => {
        elements.adminModalTitle.textContent = 'Editar Usuário';
        elements.adminModalButton.textContent = 'Editar';
        elements.user.value = button.getAttribute('data-user');
        elements.adminId.value = button.getAttribute('data-id');
        setFormLink('/editAdmin');
    }));

    // Adiciona eventos aos botões de exclusão de administrador
    elements.deleteAdminButtons.forEach(button => {
        button.addEventListener('click', onDeleteButtonClick('/deleteAdmin', 'id'));
    });

    // Evento de envio de formulário para todos os formulários capturados
    elements.forms.forEach(form => form.addEventListener('submit', onFormSubmit));

    // Evento de clique para todos os botões de fechar, limpa os formulários
    elements.closeButtons.forEach(button => button.addEventListener('click', clearForms));
});