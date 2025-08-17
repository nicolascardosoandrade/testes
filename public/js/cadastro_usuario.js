document.getElementById('registerForm').addEventListener('submit', function(event) {
    const terms = document.getElementById('terms').checked;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!terms) {
        event.preventDefault();
        alert('Você deve concordar com os Termos de Uso e a Política de Privacidade para se cadastrar.');
        return;
    }

    if (password !== confirmPassword) {
        event.preventDefault();
        alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
        return;
    }

    const fullName = document.getElementById('fullName').value;
    const ra = document.getElementById('ra').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    console.log('Registration attempt:', { fullName, ra, email, phone, password });
    alert('Funcionalidade de cadastro seria implementada aqui. Verifique o console para detalhes.');
});

// Converter o campo de nome completo para caixa alta em tempo real
document.getElementById('fullName').addEventListener('input', function(event) {
    event.target.value = event.target.value.toUpperCase();
});

// Formatar o campo de telefone para o formato (00) 00000-0000
document.getElementById('phone').addEventListener('input', function(event) {
    let input = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    let formatted = '';

    if (input.length > 0) {
        formatted = '(' + input.substring(0, 2);
    }
    if (input.length >= 3) {
        formatted += ') ' + input.substring(2, 7);
    }
    if (input.length >= 8) {
        formatted += '-' + input.substring(7, 11);
    }

    event.target.value = formatted;
});

function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = passwordInput.nextElementSibling;
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}