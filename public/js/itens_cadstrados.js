document.addEventListener('DOMContentLoaded', function() {
  const buscaForm = document.getElementById('busca-form');
  const termoInput = document.getElementById('termo');
  const categoriaSelect = document.getElementById('categoria');
  const localSelect = document.getElementById('local');
  const dataInput = document.getElementById('data');
  const feedbackDiv = document.getElementById('feedback');
  const listaResultados = document.getElementById('lista-resultados');

  // Função para mostrar feedback
  function showFeedback(message, isError = true) {
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback ${isError ? '' : 'success'}`;
    setTimeout(() => {
      feedbackDiv.textContent = '';
      feedbackDiv.className = 'feedback';
    }, 5000);
  }

  // Função para exibir resultados
  function exibirResultados(resultados) {
    console.log('Exibindo resultados:', resultados); // Log para depuração
    listaResultados.innerHTML = '';
    if (!Array.isArray(resultados) || resultados.length === 0) {
      listaResultados.innerHTML = '<p>Nenhum item encontrado.</p>';
      return;
    }

    resultados.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'resultado-item';
      itemDiv.innerHTML = `
        <div class="item-container">
          ${item.foto_path ? `<img src="${item.foto_path}" alt="${item.nome_item}" class="item-foto" onerror="this.src='/img/placeholder.png';">` : '<p>Sem foto disponível</p>'}
          <div class="item-detalhes">
            <p><strong>Nome do Item:</strong> ${item.nome_item || 'Sem nome'}</p>
            <p><strong>Descrição:</strong> ${item.descricao || 'Sem descrição'}</p>
            <p><strong>Local Encontrado:</strong> ${item.local_encontrado || 'Desconhecido'}</p>
            <p><strong>Data Encontrada:</strong> ${item.data_encontrada ? new Date(item.data_encontrada).toLocaleDateString('pt-BR') : 'Desconhecida'}</p>
            <button class="btn-reivindicar" data-id="${item.id}">Reivindicar Item</button>
          </div>
        </div>
      `;
      listaResultados.appendChild(itemDiv);
    });

    // Adicionar evento aos botões de reivindicação
    document.querySelectorAll('.btn-reivindicar').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        console.log(`Tentando reivindicar item ID ${itemId}`); // Log para depuração
        showFeedback(`Reivindicando item ID ${itemId}...`, false);
        fetch(`/api/reivindicar/${itemId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            console.log('Resposta da reivindicação:', response.status); // Log para depuração
            if (!response.ok) {
              throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            showFeedback(data.message, data.success);
            if (data.success) {
              carregarTodosItens(); // Recarregar a lista após reivindicação
            }
          })
          .catch(error => {
            showFeedback('Erro ao reivindicar item.');
            console.error('Erro ao reivindicar:', error);
          });
      });
    });
  }

  // Função para carregar todos os itens
  function carregarTodosItens() {
    console.log('Carregando todos os itens...'); // Log para depuração
    fetch('/api/itens-encontrados')
      .then(response => {
        console.log('Resposta da API /api/itens-encontrados:', response.status); // Log para depuração
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados recebidos:', data); // Log para depuração
        exibirResultados(data);
      })
      .catch(error => {
        showFeedback('Erro ao carregar itens. Verifique a conexão com o servidor.');
        console.error('Erro ao buscar itens:', error);
      });
  }

  // Carregar todos os itens ao abrir a página
  carregarTodosItens();

  // Validação e envio do formulário de busca
  buscaForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const termo = termoInput.value.trim();
    const categoria = categoriaSelect.value;
    const local = localSelect.value;
    const data = dataInput.value;

    console.log('Filtros de busca:', { termo, categoria, local, data }); // Log para depuração

    if (!termo && !categoria && !local && !data) {
      showFeedback('Preencha pelo menos um campo para buscar.');
      termoInput.focus();
      return;
    }

    // Montar os parâmetros da query
    const queryParams = new URLSearchParams();
    if (termo) queryParams.append('termo', termo);
    if (categoria) queryParams.append('categoria', categoria);
    if (local) queryParams.append('local', local);
    if (data) queryParams.append('data', data);

    console.log('URL de busca:', `/api/buscar?${queryParams.toString()}`); // Log para depuração

    // Fazer a busca via API
    fetch(`/api/buscar?${queryParams.toString()}`)
      .then(response => {
        console.log('Resposta da API /api/buscar:', response.status); // Log para depuração
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados da busca:', data); // Log para depuração
        showFeedback('Busca concluída!', false);
        exibirResultados(data);
      })
      .catch(error => {
        showFeedback('Erro ao buscar itens. Verifique a conexão com o servidor.');
        console.error('Erro ao buscar itens:', error);
      });
  });

  // Acessibilidade: Foco no campo de termo ao carregar
  termoInput.focus();

  // Suporte a navegação por teclado
  buscaForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !buscaForm.contains(document.activeElement)) {
      termoInput.focus();
    }
  });
});