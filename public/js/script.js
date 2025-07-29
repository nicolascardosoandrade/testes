document.addEventListener('DOMContentLoaded', function () {
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
        const userGreeting = document.querySelector('.user-greeting');

        if (data.success && data.user) {
          // Usuário autenticado: oculta Login/Cadastre-se, exibe Sair e saudação
          authLinks.forEach(link => link.style.display = 'none');
          logoutLink.style.display = 'block';
          userGreeting.style.display = 'block';
          userGreeting.textContent = `Olá, ${data.user.nome}!`;
          protectedElements.forEach(element => {
            element.classList.remove('disabled');
            element.addEventListener('click', () => {
              window.location.href = element.getAttribute('href');
            });
          });
        } else {
          // Usuário não autenticado: exibe Login/Cadastre-se, oculta Sair e saudação
          authLinks.forEach(link => link.style.display = 'block');
          logoutLink.style.display = 'none';
          userGreeting.style.display = 'none';
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