document.addEventListener("DOMContentLoaded", () => {
    // Lógica para ativar item do menu lateral
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Busca de itens
    const searchInput = document.querySelector('.search-bar-top input');
    const itemCards = document.querySelectorAll('.item-card');

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        itemCards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(searchValue) ? '' : 'none';
        });
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
    const popup = document.getElementById('itemPopup');
    const closeBtn = document.querySelector('.close-btn');
    const submitBtn = document.querySelector('.submit-btn');
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

            popup.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    submitBtn.addEventListener('click', () => {
        const description = document.getElementById('popupDescription').value;
        const image = document.getElementById('popupImage').files[0];
        console.log('Descrição:', description, 'Imagem:', image);
        popup.style.display = 'none';
    });

    // WhatsApp contact logic
    const whatsappLink = document.getElementById('whatsappContact');
    whatsappLink.addEventListener('click', (e) => {
        e.preventDefault();
        const phoneNumber = '5531992651046'; // Replace with actual WhatsApp number
        const message = 'Olá! Não lembro aonde e quando perdi meu item. Podem me ajudar?';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
});