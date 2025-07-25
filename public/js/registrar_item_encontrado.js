document.addEventListener('DOMContentLoaded', function() {
  const registrarForm = document.getElementById('registrar-form');
  const nomeItemInput = document.getElementById('nome-item');
  const descricaoInput = document.getElementById('descricao');
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
    const local = localSelect.value;
    const data = dataInput.value;
    const foto = fotoInput.files[0];

    if (!nomeItem || nomeItem.length < 2) {
      showFeedback('O nome do item deve ter pelo menos 2 caracteres.');
      nomeItemInput.focus();
      return;
    }

    if (!descricao || descricao.length < 10) {
      showFeedback('A descrição deve ter pelo menos 10 caracteres.');
      descricaoInput.focus();
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
    formData.append('local', local);
    formData.append('data', data);
    if (foto) formData.append('foto', foto);

    // Simulação de envio ao backend
    showFeedback('Registrando item...', false);
    // Exemplo de integração com API:
    // fetch('/api/registrar-encontrado', {
    //   method: 'POST',
    //   body: formData
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       showFeedback('Item registrado com sucesso!', false);
    //       registrarForm.reset();
    //     } else {
    //       showFeedback('Erro ao registrar item.');
    //     }
    //   })
    //   .catch(error => {
    //     showFeedback('Erro ao conectar com o servidor.');
    //   });
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