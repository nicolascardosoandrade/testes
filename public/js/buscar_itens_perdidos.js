document.addEventListener('DOMContentLoaded', function() {
  const listaItens = document.getElementById('lista-itens');
  const feedbackDiv = document.getElementById('feedback');

  // Função para mostrar feedback
  function showFeedback(message, isError = true) {
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback ${isError ? '' : 'success'}`;
    setTimeout(() => {
      feedbackDiv.textContent = '';
      feedbackDiv.className = 'feedback';
    }, 5000);
  }

  // Função para buscar e exibir itens
  async function carregarItens() {
    try {
      showFeedback('Carregando itens...', false);
      const response = await fetch('/api/itens-encontrados');
      const itens = await response.json();

      listaItens.innerHTML = '';
      if (itens.length === 0) {
        listaItens.innerHTML = '<p>Nenhum item encontrado.</p>';
        showFeedback('Nenhum item cadastrado no momento.', false);
        return;
      }

      itens.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
          ${item.foto_path ? `<img src="${item.foto_path}" alt="${item.nome_item}">` : ''}
          <div class="item-info">
            <p><strong>Item:</strong> ${item.nome_item}</p>
            <p><strong>Descrição:</strong> ${item.descricao}</p>
            <p><strong>Categoria:</strong> ${item.categoria}</p>
            <p><strong>Local:</strong> ${item.local_encontrado}</p>
            <p><strong>Data:</strong> ${new Date(item.data_encontrada).toLocaleDateString('pt-BR')}</p>
          </div>
          <a href="registrar_item_perdido.html?id=${item.id}" class="btn-reivindicar">Reivindicar Item</a>
        `;
        listaItens.appendChild(itemCard);
      });

      showFeedback('Itens carregados com sucesso!', false);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      showFeedback('Erro ao carregar itens. Tente novamente.');
    }
  }

  // Carregar itens ao abrir a página
  carregarItens();
});