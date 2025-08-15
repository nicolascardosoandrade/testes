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

// Existing sidebar toggle logic remains unchanged
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
});