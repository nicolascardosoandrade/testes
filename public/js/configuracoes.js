// Função para alternar a visibilidade das seções
function showSection(evt, sectionId) {
    // Remove a classe 'active' de todos os botões e seções
    document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));

    // Adiciona a classe 'active' ao botão clicado e à seção correspondente
    evt.currentTarget.classList.add('active');
    document.getElementById(sectionId).classList.add('active');
}

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
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // Define a seção "Geral" como ativa por padrão
    document.getElementById('sec-geral').classList.add('active');
});