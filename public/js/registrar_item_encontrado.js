document.addEventListener('DOMContentLoaded', function() {
  const registrarForm = document.getElementById('registrar-form');
  const nomeItemInput = document.getElementById('nome-item');
  const descricaoInput = document.getElementById('descricao');
  const categoriaSelect = document.getElementById('categoria');
  const localSelect = document.getElementById('local');
  const dataInput = document.getElementById('data');
  const fotoInput = document.getElementById('foto');
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

  // Validação e envio do formulário
  registrarForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const nomeItem = nomeItemInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const categoria = categoriaSelect.value;
    const local = localSelect.value;
    const data = dataInput.value;
    const foto = fotoInput.files[0];

    if (!nomeItem || nomeItem.length < 2) {
      showFeedback('O nome do item deve ter pelo menos 2 caracteres.');
      nomeItemInput.focus();
      return;
    }

    if (!descricao) {
      showFeedback('A descrição é obrigatória.');
      descricaoInput.focus();
      return;
    }

    if (!categoria) {
      showFeedback('Selecione uma categoria.');
      categoriaSelect.focus();
      return;
    }

    if (!local) {
      showFeedback('Selecione um local.');
      localSelect.focus();
      return;
    }

    if (!data) {
      showFeedback('Selecione a data encontrada.');
      dataInput.focus();
      return;
    }

    // Preparar dados para envio
    const formData = new FormData();
    formData.append('nome_item', nomeItem);
    formData.append('descricao', descricao);
    formData.append('categoria', categoria);
    formData.append('local', local);
    formData.append('data', data);
    if (foto) formData.append('foto', foto);

    // Enviar dados ao servidor
    showFeedback('Registrando item...', false);
    fetch('/api/registrar-encontrado', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showFeedback('Item registrado com sucesso!', false);
          registrarForm.reset();
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 3000); // Redireciona após 3 segundos
        } else {
          showFeedback(data.message || 'Erro ao registrar item.');
        }
      })
      .catch(error => {
        showFeedback('Erro ao conectar com o servidor.');
        console.error('Erro:', error);
      });
  });

  // Acessibilidade: Foco no campo de nome ao carregar
  nomeItemInput.focus();

  // Suporte a navegação por teclado
  registrarForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !registrarForm.contains(document.activeElement)) {
      nomeItemInput.focus();
    }
  });
});