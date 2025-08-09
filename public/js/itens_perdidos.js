// Destacar o menu ativo
document.querySelectorAll('.sidebar nav ul li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
    });
});

// Busca de itens
const searchInput = document.querySelector('.search-bar input');
const itemCards = document.querySelectorAll('.item-card');

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    itemCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(searchValue) ? '' : 'none';
    });
});
