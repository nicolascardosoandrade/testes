document.getElementById('registerForm').addEventListener('submit', function(event) {
    const terms = document.getElementById('terms').checked;

    if (!terms) {
        event.preventDefault();
        alert('Você deve concordar com os Termos de Uso e a Política de Privacidade para se cadastrar.');
        return;
    }

    const fullName = document.getElementById('fullName').value;
    const ra = document.getElementById('ra').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    console.log('Registration attempt:', { fullName, ra, email, phone, password });
    alert('Funcionalidade de cadastro seria implementada aqui. Verifique o console para detalhes.');
});