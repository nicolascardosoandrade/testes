document.addEventListener("DOMContentLoaded", () => {
    const recordsList = document.getElementById("recordsList");

    // Lógica para recolher e expandir a sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });
});