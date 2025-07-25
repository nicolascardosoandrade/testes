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
      localStorage.setItem(`termo-secao-${secaoId}`, secao.classList.contains('active'));
    }
  }

  // Carregar estado do localStorage
  function loadState() {
    const secoes = document.querySelectorAll('.termo-secao');
    secoes.forEach(secao => {
      const secaoId = secao.getAttribute('data-secao');
      if (secaoId) {
        const isActive = localStorage.getItem(`termo-secao-${secaoId}`) === 'true';
        if (isActive) secao.classList.add('active');
      }
    });
  }

  // Tornar seções colapsáveis
  const secoes = document.querySelectorAll('.termo-secao');
  if (secoes.length > 0) {
    loadState(); // Carrega o estado ao iniciar
    secoes.forEach(secao => {
      const cabecalho = secao.querySelector('h2');
      const conteudo = secao.querySelector('.collapsible-content');
      if (cabecalho && conteudo) {
        cabecalho.setAttribute('tabindex', '0');
        cabecalho.setAttribute('role', 'button');
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
        console.warn('Elementos h2 ou .collapsible-content ausentes na seção:', secao);
      }
    });
  } else {
    console.warn('Nenhuma seção .termo-secao encontrada.');
  }
});