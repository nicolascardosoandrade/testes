document.addEventListener('DOMContentLoaded', function() {
  // Adicionar interatividade aos passos (efeito de destaque ao clicar)
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    step.addEventListener('click', function() {
      steps.forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Adicionar navegação aos links legais
  const legalLinks = document.querySelectorAll('.links-legais ul li a');
  legalLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const page = this.textContent.trim();
      let targetUrl;

      // Definir URLs reais para cada link
      switch(page) {
        case 'Termos de Uso':
          targetUrl = '/termos_de_uso.html';
          break;
        case 'Política de Privacidade':
          targetUrl = '/politica_de_privacidade.html';
          break;
        case 'LGPD':
          targetUrl = '/lgpd.html';
          break;
        default:
          targetUrl = this.getAttribute('href');
      }

      // Redirecionar para a página correspondente
      window.location.href = targetUrl;
    });
  });

  // Acessibilidade: Foco na seção principal ao carregar
  document.querySelector('.como-funciona h1').setAttribute('tabindex', '0');
  document.querySelector('.como-funciona h1').focus();
});