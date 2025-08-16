document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const whatsappButtons = document.querySelectorAll('button[data-whatsapp="true"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', () => {
            const phoneNumber = '+5531992651046'; // Replace with actual WhatsApp number
            const message = encodeURIComponent('Olá, gostaria de falar sobre o StarTech!');
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    });
});