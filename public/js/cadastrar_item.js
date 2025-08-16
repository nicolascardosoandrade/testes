document.addEventListener("DOMContentLoaded", () => {
    // Lógica para o formulário de cadastro
    document.getElementById("form-cadastrar").addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const local = document.getElementById("local").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const data = document.getElementById("data").value.trim();

        if (!nome || !local || !categoria || !descricao || !data) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        alert(`Item "${nome}" cadastrado com sucesso!`);
        this.reset();
    });

    // Lógica para recolher e expandir a sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const userInfo = document.querySelector('.user-info');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const logoutLink = document.querySelector('.logout');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // Mostrar/esconder dropdown ao clicar no nome do usuário
    userInfo.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que o clique propague e feche o dropdown imediatamente
        dropdownMenu.classList.toggle('active');
    });

    // Fechar o dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });

    // Lógica de logout
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Simula logout (limpa dados de sessão, por exemplo)
        localStorage.removeItem('userSession'); // Exemplo: remove dados de sessão
        window.location.href = 'login.html'; // Redireciona para a página de login
    });
});