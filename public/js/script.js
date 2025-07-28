document.addEventListener('DOMContentLoaded', function () {
  // ===========================
  // VERIFICAÇÃO DE AUTENTICAÇÃO
  // ===========================
  function checkAuthentication() {
    fetch('/api/check-auth', {
      method: 'GET',
      credentials: 'include' // Envia cookies de sessão
    })
      .then(response => response.json())
      .then(data => {
        const authLinks = document.querySelectorAll('.auth-link');
        const logoutLink = document.querySelector('.logout-link');
        const protectedElements = document.querySelectorAll('[data-protected="true"]');

        if (data.success) {
          // Usuário autenticado: oculta Login/Cadastre-se, exibe Sair
          authLinks.forEach(link => link.style.display = 'none');
          logoutLink.style.display = 'block';
          // Habilita navegação normal para elementos protegidos
          protectedElements.forEach(element => {
            element.classList.remove('disabled');
            element.addEventListener('click', () => {
              window.location.href = element.getAttribute('href');
            });
          });
        } else {
          // Usuário não autenticado: exibe Login/Cadastre-se, oculta Sair
          authLinks.forEach(link => link.style.display = 'block');
          logoutLink.style.display = 'none';
          // Desativa elementos protegidos e exibe alert
          protectedElements.forEach(element => {
            element.classList.add('disabled');
            element.addEventListener('click', (e) => {
              e.preventDefault();
              alert('Por favor, faça login para acessar esta funcionalidade.');
            });
          });
        }
      })
      .catch(error => {
        console.error('Erro ao verificar autenticação:', error);
        alert('Erro ao verificar autenticação. Tente novamente.');
      });
  }

  // ===========================
  // LÓGICA DE LOGOUT
  // ===========================
  const logoutLink = document.querySelector('.logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Logout realizado com sucesso!');
            window.location.reload(); // Recarrega a página para atualizar a interface
          } else {
            alert('Erro ao fazer logout. Tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro ao fazer logout:', error);
          alert('Erro ao fazer logout. Tente novamente.');
        });
    });
  }

  // ===========================
  // LÓGICA DE BUSCA E FILTROS
  // ===========================
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const feedbackDiv = document.querySelector('.search-feedback');

  function showFeedback(message, isError = false) {
    if (feedbackDiv) {
      feedbackDiv.textContent = message;
      feedbackDiv.style.color = isError ? '#d32f2f' : '#00a859';
      feedbackDiv.style.marginTop = '10px';
      feedbackDiv.style.fontSize = '0.9em';
      setTimeout(() => {
        feedbackDiv.textContent = '';
      }, 3000);
    } else {
      alert(message); // Fallback para alert
    }
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const query = searchInput.value.trim();

      if (query.length < 3) {
        showFeedback('Digite pelo menos 3 caracteres para buscar.', true);
        searchInput.focus();
        return;
      }

      showFeedback(`Buscando por: ${query}`);
      // Simulação de busca (substituir por chamada real à API se necessário)
    });

    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !searchForm.contains(document.activeElement)) {
        searchInput.focus();
      }
    });

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
  }

  // ===========================
  // LÓGICA DO CARROSSEL
  // ===========================
  const track = document.getElementById("carouselTrack");
  const indicators = document.getElementById("carouselIndicators").children;
  const totalSlides = track.children.length;
  let currentIndex = 0;
  let interval;

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
    resetAutoplay();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoplay();
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    for (let i = 0; i < indicators.length; i++) {
      indicators[i].classList.toggle("active", i === currentIndex);
    }
  }

  function startAutoplay() {
    interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 segundos
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  // Adiciona eventos aos botões de navegação
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
  }

  // Adiciona eventos às bolinhas
  for (let i = 0; i < indicators.length; i++) {
    indicators[i].addEventListener('click', () => goToSlide(i));
  }

  // Iniciar autoplay
  startAutoplay();

  // Verificar autenticação ao carregar a página
  checkAuthentication();
});document.addEventListener('DOMContentLoaded', function () {
  // ===========================
  // VERIFICAÇÃO DE AUTENTICAÇÃO
  // ===========================
  function checkAuthentication() {
    fetch('/api/check-auth', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        const authLinks = document.querySelectorAll('.auth-link');
        const logoutLink = document.querySelector('.logout-link');
        const protectedElements = document.querySelectorAll('[data-protected="true"]');

        if (data.success) {
          authLinks.forEach(link => link.style.display = 'none');
          logoutLink.style.display = 'block';
          protectedElements.forEach(element => {
            element.classList.remove('disabled');
            element.addEventListener('click', () => {
              window.location.href = element.getAttribute('href');
            });
          });
        } else {
          authLinks.forEach(link => link.style.display = 'block');
          logoutLink.style.display = 'none';
          protectedElements.forEach(element => {
            element.classList.add('disabled');
            element.addEventListener('click', (e) => {
              e.preventDefault();
              alert('Por favor, faça login para acessar esta funcionalidade.');
            });
          });
        }
      })
      .catch(error => {
        console.error('Erro ao verificar autenticação:', error);
        alert('Erro ao verificar autenticação. Tente novamente.');
      });
  }

  // ===========================
  // LÓGICA DE LOGOUT
  // ===========================
  const logoutLink = document.querySelector('.logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Logout realizado com sucesso!');
            window.location.reload();
          } else {
            alert('Erro ao fazer logout. Tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro ao fazer logout:', error);
          alert('Erro ao fazer logout. Tente novamente.');
        });
    });
  }

  // ===========================
  // LÓGICA DE BUSCA E FILTROS
  // ===========================
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const feedbackDiv = document.querySelector('.search-feedback');

  function showFeedback(message, isError = false) {
    if (feedbackDiv) {
      feedbackDiv.textContent = message;
      feedbackDiv.style.color = isError ? '#d32f2f' : '#00a859';
      feedbackDiv.style.marginTop = '10px';
      feedbackDiv.style.fontSize = '0.9em';
      setTimeout(() => {
        feedbackDiv.textContent = '';
      }, 3000);
    } else {
      alert(message);
    }
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const query = searchInput.value.trim();

      if (query.length < 3) {
        showFeedback('Digite pelo menos 3 caracteres para buscar.', true);
        searchInput.focus();
        return;
      }

      showFeedback(`Buscando por: ${query}`);
    });

    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !searchForm.contains(document.activeElement)) {
        searchInput.focus();
      }
    });

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
  }

  // ===========================
  // LÓGICA DO CARROSSEL
  // ===========================
  const track = document.getElementById('carouselTrack');
  const indicators = document.querySelectorAll('.carousel-indicators span');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const totalSlides = track.children.length;
  let currentIndex = 0;
  let interval;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
    resetAutoplay();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalSlides - 1;
    }
    updateCarousel();
    resetAutoplay();
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  // Suporte a swipe
  function touchStart(event) {
    isDragging = true;
    startPos = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    prevTranslate = currentTranslate;
    clearInterval(interval);
    track.style.transition = 'none';
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
      currentTranslate = prevTranslate + currentPosition - startPos;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  function touchEnd() {
    isDragging = false;
    track.style.transition = 'transform 0.5s ease-in-out';
    const threshold = window.innerWidth / 4;
    if (currentTranslate < -threshold && currentIndex < totalSlides - 1) {
      nextSlide();
    } else if (currentTranslate > threshold && currentIndex > 0) {
      prevSlide();
    } else {
      updateCarousel();
    }
    currentTranslate = 0;
    resetAutoplay();
  }

  // Eventos de navegação
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });

  // Eventos de toque e mouse
  track.addEventListener('touchstart', touchStart);
  track.addEventListener('touchmove', touchMove);
  track.addEventListener('touchend', touchEnd);
  track.addEventListener('mousedown', touchStart);
  track.addEventListener('mousemove', touchMove);
  track.addEventListener('mouseup', touchEnd);
  track.addEventListener('mouseleave', () => {
    if (isDragging) touchEnd();
  });

  // Impedir seleção de texto durante o arrasto
  track.addEventListener('dragstart', (e) => e.preventDefault());

  // Iniciar autoplay
  startAutoplay();

  // Verificar autenticação ao carregar a página
  checkAuthentication();
});