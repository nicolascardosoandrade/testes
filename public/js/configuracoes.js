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
    document.getElementById("nome").value = "Usuário 01"; // Restaurar valores padrão
    document.getElementById("email").value = "usuario01@exemplo.com";
});

// Lógica para recolher e expandir a sidebar
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });
});