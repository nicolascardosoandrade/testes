document.addEventListener('DOMContentLoaded', function() {
  // Atualizar data de forma dinâmica
  const dataAtualizacao = document.getElementById('data-atualizacao');
  if (dataAtualizacao) {
    const hoje = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    dataAtualizacao.textContent = hoje;
  } else {
    console.warn('Elemento #data-atualizacao não encontrado.');
  }

  // Função para alternar seções com debounce
  function toggleSection(secao) {
    let lastToggle = 0;
    const debounceDelay = 300;
    return function() {
      const now = Date.now();
      if (now - lastToggle < debounceDelay) return;
      lastToggle = now;
      secao.classList.toggle('active');
      saveState(secao);
    };
  }

  // Salvar estado no localStorage
  function saveState(secao) {
    const secaoId = secao.getAttribute('data-secao');
    if (secaoId) {
      localStorage.setItem(`politica-secao-${secaoId}`, secao.classList.contains('active'));
    }
  }

  // Carregar estado do localStorage
  function loadState() {
    secoes.forEach(secao => {
      const secaoId = secao.getAttribute('data-secao');
      if (secaoId) {
        const isActive = localStorage.getItem(`politica-secao-${secaoId}`) === 'true';
        if (isActive) secao.classList.add('active');
      }
    });
  }

  // Tornar seções colapsáveis
  const secoes = document.querySelectorAll('.politica-secao');
  if (secoes.length > 0) {
    loadState(); // Carrega o estado ao iniciar
    secoes.forEach(secao => {
      const cabecalho = secao.querySelector('h3');
      const conteudo = secao.querySelector('.collapsible-content');
      if (cabecalho && conteudo) {
        cabecalho.setAttribute('tabindex', '0'); // Acessibilidade
        cabecalho.setAttribute('role', 'button'); // Semântica ARIA
        cabecalho.addEventListener('click', toggleSection(secao));
        cabecalho.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSection(secao)();
          }
        });
        cabecalho.addEventListener('focus', function() {
          this.style.outline = '2px solid #003087';
        });
        cabecalho.addEventListener('blur', function() {
          this.style.outline = 'none';
        });
      } else {
        console.warn('Elementos h3 ou .collapsible-content ausentes na seção:', secao);
      }
    });
  } else {
    console.warn('Nenhuma seção .politica-secao encontrada.');
  }
});