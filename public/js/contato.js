document.getElementById("form-contato").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    alert(`Mensagem enviada com sucesso! Nome: ${nome}, E-mail: ${email}`);
    this.reset();
});

// Lógica para recolher e expandir a sidebar
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
});