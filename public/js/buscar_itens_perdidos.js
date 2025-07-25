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
    listaResultados.innerHTML = '';
    if (resultados.length === 0) {
      listaResultados.innerHTML = '<p>Nenhum item encontrado.</p>';
      return;
    }

    resultados.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'resultado-item';
      itemDiv.innerHTML = `
        <p><strong>Item:</strong> ${item.descricao}</p>
        <p><strong>Categoria:</strong> ${item.categoria}</p>
        <p><strong>Local:</strong> ${item.local}</p>
        <p><strong>Data:</strong> ${item.data}</p>
        <button class="btn btn-reivindicar" data-id="${item.id}">Reivindicar Item</button>
      `;
      listaResultados.appendChild(itemDiv);
    });

    // Adicionar evento aos botões de reivindicação
    document.querySelectorAll('.btn-reivindicar').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        showFeedback(`Reivindicando item ID ${itemId}...`, false);
        // Exemplo de integração com API:
        // fetch(`/api/reivindicar/${itemId}`, { method: 'POST' })
        //   .then(response => response.json())
        //   .then(data => {
        //     showFeedback('Item reivindicado com sucesso!', false);
        //   })
        //   .catch(error => {
        //     showFeedback('Erro ao reivindicar item.');
        //   });
      });
    });
  }

  // Validação e envio do formulário de busca
  buscaForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const termo = termoInput.value.trim();
    const categoria = categoriaSelect.value;
    const local = localSelect.value;
    const data = dataInput.value;

    if (!termo && !categoria && !local && !data) {
      showFeedback('Preencha pelo menos um campo para buscar.');
      termoInput.focus();
      return;
    }

    // Simulação de busca no banco de dados
    const resultadosMock = [
      { id: 1, descricao: 'Casaco azul com capuz', categoria: 'Roupas', local: 'Biblioteca', data: '2025-07-20' },
      { id: 2, descricao: 'Squeeze preto', categoria: 'Outros', local: 'Sala de Aula', data: '2025-07-21' }
    ].filter(item => {
      return (
        (!termo || item.descricao.toLowerCase().includes(termo.toLowerCase())) &&
        (!categoria || item.categoria === categoria) &&
        (!local || item.local === local) &&
        (!data || item.data === data)
      );
    });

    showFeedback('Buscando itens...', false);
    exibirResultados(resultadosMock);

    // Exemplo de integração com API:
    // const queryParams = new URLSearchParams({ termo, categoria, local, data }).toString();
    // fetch(`/api/buscar?${queryParams}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     showFeedback('Busca concluída!', false);
    //     exibirResultados(data.resultados);
    //   })
    //   .catch(error => {
    //     showFeedback('Erro ao buscar itens. Tente novamente.');
    //   });
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