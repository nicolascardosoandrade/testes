document.addEventListener("DOMContentLoaded", () => {
    // Função para alternar a visibilidade das seções
    function showSection(evt, sectionId) {
        // Remove a classe 'active' de todos os botões e seções
        document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));

        // Adiciona a classe 'active' ao botão clicado e à seção correspondente
        evt.currentTarget.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
    }

    // Expor a função showSection para o escopo global
    window.showSection = showSection;

    // Lógica do formulário
    document.getElementById("form-configuracoes").addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const confirmarSenha = document.getElementById("confirmar-senha").value.trim();

        if (!nome || !email) {
            alert("Por favor, preencha os campos obrigatórios (Nome e E-mail).");
            return;
        }

        if (senha && senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        alert(`Configurações salvas com sucesso! Nome: ${nome}, E-mail: ${email}${senha ? ", Senha atualizada" : ""}`);
        this.reset();
        document.getElementById("nome").value = "Usuário 01";
        document.getElementById("email").value = "usuario01@exemplo.com";
    });

    // Sidebar toggle
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

    // Define a seção "Geral" como ativa por padrão
    document.getElementById('sec-geral').classList.add('active');
});