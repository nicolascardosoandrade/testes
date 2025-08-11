document.getElementById('resetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const registro = document.getElementById('registro').value;
    
    if (registro) {
        // Simula o envio do link de redefinição (substituir por chamada real à API no backend)
        alert(`Um link de redefinição de senha foi enviado para o e-mail associado ao registro ${registro}.`);
        document.getElementById('resetForm').reset();
    } else {
        alert('Por favor, insira um registro acadêmico válido.');
    }
});