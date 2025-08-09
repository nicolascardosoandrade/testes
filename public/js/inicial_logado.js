// Exemplo de funcionalidade para destacar o menu ativo
document.querySelectorAll('.sidebar nav ul li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
    });
});
    