document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const whatsappButtons = document.querySelectorAll('button[data-whatsapp="true"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
                const phoneNumber = '+5511999999999'; // Replace with actual WhatsApp number
                const message = encodeURIComponent('Olá, preciso de suporte relacionado ao StarTech.');
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                window.open(whatsappUrl, '_blank');
            } catch (error) {
                console.error('Erro ao abrir o WhatsApp:', error);
                alert('Não foi possível abrir o WhatsApp. Por favor, tente novamente.');
            }
        });
    });

    // Add scrolled class to header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});