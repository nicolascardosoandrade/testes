document.addEventListener("DOMContentLoaded", () => {
    // Lógica para ativar item do menu lateral
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Busca de itens e filtragem por data
    const searchInput = document.querySelector('.search-bar-top input');
    const dateInput = document.querySelector('.filter-bar input[type="date"]');
    const itemCards = document.querySelectorAll('.item-card');

    function filterItems() {
        const searchValue = searchInput.value.toLowerCase();
        const dateValue = dateInput.value; // Formato YYYY-MM-DD
        const formattedDate = dateValue ? dateValue.split('-').reverse().join('/') : ''; // Converte para DD/MM/YYYY

        itemCards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const cardDate = card.getAttribute('data-data'); // Formato DD/MM/YYYY

            const matchesSearch = text.includes(searchValue);
            const matchesDate = !formattedDate || cardDate === formattedDate;

            card.style.display = matchesSearch && matchesDate ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', filterItems);
    dateInput.addEventListener('input', filterItems);

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
        e.stopPropagation();
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
        localStorage.removeItem('userSession');
        window.location.href = 'login.html';
    });

    // Popup functionality
    const itemPopup = document.getElementById('itemPopup');
    const closeItemBtn = document.querySelector('#itemPopup .close-btn');
    const itemSubmitBtn = document.querySelector('#itemPopup .submit-btn');
    const popupItem = document.getElementById('popupItem');
    const popupLocal = document.getElementById('popupLocal');
    const popupData = document.getElementById('popupData');
    const popupCategoria = document.getElementById('popupCategoria');

    itemCards.forEach(card => {
        card.addEventListener('click', () => {
            const item = card.getAttribute('data-item');
            const local = card.getAttribute('data-local');
            const data = card.getAttribute('data-data');
            const categoria = card.getAttribute('data-categoria');

            popupItem.textContent = item;
            popupLocal.textContent = local;
            popupData.textContent = data;
            popupCategoria.textContent = categoria;

            itemPopup.style.display = 'flex';
        });
    });

    closeItemBtn.addEventListener('click', () => {
        itemPopup.style.display = 'none';
    });

    itemSubmitBtn.addEventListener('click', () => {
        const description = document.getElementById('popupDescription').value;
        const image = document.getElementById('popupImage').files[0];
        console.log('Descrição:', description, 'Imagem:', image);
        itemPopup.style.display = 'none';
    });

    // Popup para item desconhecido
    const unknownPopup = document.getElementById('unknownItemPopup');
    const closeUnknownBtn = document.querySelector('#unknownItemPopup .close-btn');
    const unknownSubmitBtn = document.querySelector('#unknownItemPopup .submit-btn');
    const whatsappLink = document.getElementById('whatsappContact');

    whatsappLink.addEventListener('click', (e) => {
        e.preventDefault();
        unknownPopup.style.display = 'flex';
    });

    closeUnknownBtn.addEventListener('click', () => {
        unknownPopup.style.display = 'none';
    });

    unknownSubmitBtn.addEventListener('click', () => {
        const description = document.getElementById('unknownDescription').value;
        const image = document.getElementById('unknownImage').files[0];
        console.log('Descrição do item desconhecido:', description, 'Imagem:', image);
        unknownPopup.style.display = 'none';
    });
});