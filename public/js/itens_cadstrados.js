document.addEventListener('DOMContentLoaded', function() {
  const itensList = document.getElementById('itens-list');
  const feedbackDiv = document.getElementById('feedback');

  // Função para mostrar feedback
  function showFeedback(message, isSuccess = false) {
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback ${isSuccess ? 'success' : ''}`;
    setTimeout(() => {
      feedbackDiv.textContent = '';
      feedbackDiv.className = 'feedback';
    }, 5000);
  }

  // Função para carregar itens
  async function loadItens() {
    try {
      const response = await fetch('/api/itens-encontrados');
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      const itens = await response.json();
      if (itens.length === 0) {
        itensList.innerHTML = '<p>Nenhum item cadastrado encontrado.</p>';
        return;
      }
      itensList.innerHTML = itens.map(item => `
        <div class="item-card">
          <h3>${item.nome_item}</h3>
          <p><strong>Descrição:</strong> ${item.descricao}</p>
          <p><strong>Local:</strong> ${item.local_encontrado}</p>
          <p><strong>Data:</strong> ${new Date(item.data_encontrada).toLocaleDateString('pt-BR')}</p>
          <p><strong>Registrado em:</strong> ${new Date(item.data_registro).toLocaleString('pt-BR')}</p>
          <p><strong>Status:</strong> ${item.status}</p>
          ${item.foto_path ? `<img src="${item.foto_path}" alt="Foto de ${item.nome_item}" class="foto">` : ''}
        </div>
      `).join('');
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      showFeedback('Erro ao carregar itens. Tente novamente.');
    }
  }

  // Carregar itens ao carregar a página
  loadItens();
});