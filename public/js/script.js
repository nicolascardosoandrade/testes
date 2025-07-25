document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const feedbackDiv = document.querySelector('.search-feedback');

  // Função para mostrar feedback
  function showFeedback(message, isError = false) {
    feedbackDiv.textContent = message;
    feedbackDiv.style.color = isError ? '#d32f2f' : '#00a859';
    feedbackDiv.style.marginTop = '10px';
    feedbackDiv.style.fontSize = '0.9em';
    setTimeout(() => {
      feedbackDiv.textContent = '';
    }, 3000);
  }

  // Validação e envio do formulário de busca
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query.length < 3) {
      showFeedback('Digite pelo menos 3 caracteres para buscar.', true);
      searchInput.focus();
      return;
    }

    // Simulação de busca (substituir por chamada à API)
    showFeedback(`Buscando por: ${query}`);
    // Exemplo de integração com API:
    // fetch(`/api/search?q=${encodeURIComponent(query)}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     showFeedback('Resultados encontrados!');
    //     // Redirecionar ou exibir resultados
    //   })
    //   .catch(error => {
    //     showFeedback('Erro na busca. Tente novamente.', true);
    //   });
  });

  // Suporte a navegação por teclado
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !searchForm.contains(document.activeElement)) {
      searchInput.focus();
    }
  });

  // Adicionar filtros dinâmicos (exemplo básico)
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container';
  filterContainer.innerHTML = `
    <select id="category-filter">
      <option value="">Selecione uma categoria</option>
      <option value="roupas">Roupas</option>
      <option value="eletronicos">Eletrônicos</option>
      <option value="documentos">Documentos</option>
      <option value="outros">Outros</option>
    </select>
    <select id="location-filter">
      <option value="">Selecione um local</option>
      <option value="biblioteca">Biblioteca</option>
      <option value="sala">Sala de Aula</option>
      <option value="refeitorio">Refeitório</option>
    </select>
  `;
  searchForm.insertBefore(filterContainer, searchInput);

  // Estilizar filtros dinamicamente
  const style = document.createElement('style');
  style.textContent = `
    .filter-container {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    .filter-container select {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 0.9em;
    }
    .search-feedback {
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // Interatividade nos botões de CTA
  const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent;
      showFeedback(`Redirecionando para: ${action}`);
      // Exemplo: window.location.href = this.getAttribute('href');
    });
  });
});