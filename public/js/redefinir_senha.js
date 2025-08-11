function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

document.getElementById('newPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword === confirmPassword) {
        // Simula a redefinição de senha (substituir por chamada real à API no backend)
        alert('Senha redefinida com sucesso! Você será redirecionado para a página de login.');
        window.location.href = 'login.html';
    } else {
        alert('As senhas não coincidem. Por favor, tente novamente.');
    }
});