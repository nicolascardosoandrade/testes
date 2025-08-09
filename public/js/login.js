document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    console.log('Login attempt:', { email, password, rememberMe });
    alert('Funcionalidade de login seria implementada aqui. Verifique o console para detalhes.');
});