document.addEventListener('DOMContentLoaded', function() {
  // Adicionar interatividade aos passos (efeito de destaque ao clicar)
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    step.addEventListener('click', function() {
      steps.forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Adicionar feedback ao clicar nos links legais
  const legalLinks = document.querySelectorAll('.links-legais ul li a');
  legalLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Simulação de navegação (substituir por links reais)
      event.preventDefault();
      const page = this.textContent;
      alert(`Navegando para: ${page}`);
      // Exemplo: window.location.href = this.getAttribute('href');
    });
  });

  // Acessibilidade: Foco na seção principal ao carregar
  document.querySelector('.como-funciona h1').setAttribute('tabindex', '0');
  document.querySelector('.como-funciona h1').focus();
});