/**
 * ================================
 * FITLIFE PRO - MAIN JAVASCRIPT
 * ================================
 * 
 * Este archivo contiene toda la funcionalidad JavaScript para el sitio web de FitLife Pro
 * Incluye: navegación móvil, animaciones, formularios y componentes interactivos
 */

// ================================
// CONSTANTS & VARIABLES
// ================================

// Selectores de elementos del DOM
const navToggle = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.nav__menu--mobile');
const mobileMenuLinks = document.querySelectorAll('.nav__menu--mobile .nav__link');
const body = document.body;

// Estado del menú
let mobileMenuOpen = false;

// ================================
// MOBILE NAVIGATION FUNCTIONALITY
// ================================

/**
 * Inicializa la funcionalidad del menú móvil
 */
function initMobileNavigation() {
  // Event listener para el botón hamburguesa
  navToggle.addEventListener('click', toggleMobileMenu);
  
  // Event listeners para los enlaces del menú móvil
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', handleOutsideClick);
  
  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', handleEscapeKey);
  
  // Manejar resize de ventana
  window.addEventListener('resize', handleWindowResize);
}

/**
 * Alterna la visibilidad del menú móvil
 */
function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  
  if (mobileMenuOpen) {
    openMobileMenu();
  } else {
    closeMobileMenu();
  }
}

/**
 * Abre el menú móvil
 */
function openMobileMenu() {
  // Agregar clases para animación
  navToggle.classList.add('nav__toggle--active');
  mobileMenu.classList.add('nav__menu--active');
  body.classList.add('nav-open');
  
  // Actualizar atributos de accesibilidad
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
  
  // Enfocar el primer enlace del menú
  const firstLink = mobileMenu.querySelector('.nav__link');
  if (firstLink) {
    setTimeout(() => firstLink.focus(), 300);
  }
  
  mobileMenuOpen = true;
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu() {
  // Remover clases de animación
  navToggle.classList.remove('nav__toggle--active');
  mobileMenu.classList.remove('nav__menu--active');
  body.classList.remove('nav-open');
  
  // Actualizar atributos de accesibilidad
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  
  mobileMenuOpen = false;
}

/**
 * Maneja clics fuera del menú para cerrarlo
 * @param {Event} event - Evento de clic
 */
function handleOutsideClick(event) {
  if (!mobileMenuOpen) return;
  
  const isClickInsideMenu = mobileMenu.contains(event.target);
  const isClickOnToggle = navToggle.contains(event.target);
  
  if (!isClickInsideMenu && !isClickOnToggle) {
    closeMobileMenu();
  }
}

/**
 * Maneja la tecla Escape para cerrar el menú
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape' && mobileMenuOpen) {
    closeMobileMenu();
    navToggle.focus(); // Devolver foco al botón hamburguesa
  }
}

/**
 * Maneja el redimensionamiento de la ventana
 */
function handleWindowResize() {
  // Cerrar menú móvil en pantallas grandes
  if (window.innerWidth >= 768 && mobileMenuOpen) {
    closeMobileMenu();
  }
}

// ================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ================================

/**
 * Inicializa el scroll suave para los enlaces de navegación
 */
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
  });
}

/**
 * Maneja el scroll suave hacia las secciones
 * @param {Event} event - Evento de clic
 */
function handleSmoothScroll(event) {
  event.preventDefault();
  
  const href = event.currentTarget.getAttribute('href');
  const targetId = href.substring(1);
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    // Cerrar menú móvil si está abierto
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
    
    // Calcular offset para el header fijo
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    
    // Scroll suave
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Actualizar URL sin saltar
    history.pushState(null, '', href);
  }
}

// ================================
// HEADER SCROLL BEHAVIOR
// ================================

/**
 * Inicializa el comportamiento del header al hacer scroll
 */
function initHeaderScrollBehavior() {
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    // Debounce para mejorar rendimiento
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      handleHeaderScroll(header, lastScrollTop);
      lastScrollTop = window.pageYOffset;
    }, 10);
  });
}

/**
 * Maneja el comportamiento del header durante el scroll
 * @param {Element} header - Elemento del header
 * @param {number} lastScrollTop - Última posición de scroll
 */
function handleHeaderScroll(header, lastScrollTop) {
  const currentScrollTop = window.pageYOffset;
  
  // Agregar/quitar clase de scroll
  if (currentScrollTop > 100) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
  
  // Ocultar/mostrar header en scroll (opcional)
  if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
    // Scrolling hacia abajo - ocultar header
    header.classList.add('header--hidden');
  } else {
    // Scrolling hacia arriba - mostrar header
    header.classList.remove('header--hidden');
  }
}

// ================================
// ACCESSIBILITY IMPROVEMENTS
// ================================

/**
 * Inicializa mejoras de accesibilidad
 */
function initAccessibility() {
  // Navegación por teclado en el menú móvil
  initKeyboardNavigation();
  
  // Focus trap en menú móvil
  initFocusTrap();
}

/**
 * Inicializa navegación por teclado
 */
function initKeyboardNavigation() {
  const menuItems = mobileMenu.querySelectorAll('.nav__link, .nav__cta--mobile');
  
  menuItems.forEach((item, index) => {
    item.addEventListener('keydown', (event) => {
      if (!mobileMenuOpen) return;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = (index + 1) % menuItems.length;
          menuItems[nextIndex].focus();
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
          menuItems[prevIndex].focus();
          break;
          
        case 'Home':
          event.preventDefault();
          menuItems[0].focus();
          break;
          
        case 'End':
          event.preventDefault();
          menuItems[menuItems.length - 1].focus();
          break;
      }
    });
  });
}

/**
 * Inicializa focus trap para el menú móvil
 */
function initFocusTrap() {
  const focusableElements = mobileMenu.querySelectorAll(
    'a, button, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  mobileMenu.addEventListener('keydown', (event) => {
    if (!mobileMenuOpen) return;
    
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

// ================================
// VIDEO DEMO FUNCTIONALITY
// ================================

/**
 * Inicializa la funcionalidad del video demo
 */
function initVideoDemo() {
  const playButton = document.getElementById('demo-play-button');
  const video = document.getElementById('demo-video');
  const previewImage = document.getElementById('demo-preview-image');
  const closeButton = document.getElementById('demo-close-button');
  
  if (!playButton || !video || !previewImage) {
    console.warn('Elementos de video demo no encontrados');
    return;
  }
  
  // Event listener para el botón de play
  playButton.addEventListener('click', handlePlayButtonClick);
  
  // Event listener para el botón de cerrar (si existe)
  if (closeButton) {
    closeButton.addEventListener('click', handleCloseButtonClick);
  }
  
  // Event listeners para el video
  video.addEventListener('loadstart', handleVideoLoadStart);
  video.addEventListener('error', handleVideoError);
  
  // Event listener para tecla Escape para cerrar video
  document.addEventListener('keydown', handleEscapeKeyVideo);
}

/**
 * Maneja el clic en el botón de reproducir
 */
function handlePlayButtonClick() {
  const playButton = document.getElementById('demo-play-button');
  const video = document.getElementById('demo-video');
  const previewImage = document.getElementById('demo-preview-image');
  const closeButton = document.getElementById('demo-close-button');
  
  // Ocultar imagen preview y botón de play
  previewImage.style.display = 'none';
  playButton.style.display = 'none';
  
  // Mostrar botón de cerrar si existe
  if (closeButton) {
    closeButton.style.display = 'flex';
  }
  
  // Mostrar y reproducir video
  video.style.display = 'block';
  video.style.width = '100%';
  video.style.height = '100%';
  
  // Intentar reproducir el video
  const playPromise = video.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
      })
      .catch(error => {
        console.error('Error al reproducir video:', error);
        handleVideoError();
      });
  }
}

/**
 * Maneja el clic en el botón de cerrar video
 */
function handleCloseButtonClick() {
  resetVideoToInitialState();
}

/**
 * Maneja la tecla Escape para cerrar el video
 */
function handleEscapeKeyVideo(event) {
  const video = document.getElementById('demo-video');
  
  if (event.key === 'Escape' && video.style.display === 'block') {
    resetVideoToInitialState();
  }
}

/**
 * Resetea el video al estado inicial
 */
function resetVideoToInitialState() {
  const playButton = document.getElementById('demo-play-button');
  const video = document.getElementById('demo-video');
  const previewImage = document.getElementById('demo-preview-image');
  const closeButton = document.getElementById('demo-close-button');
  const replayButton = document.getElementById('demo-replay-button');
  
  // Pausar y resetear video
  video.pause();
  video.currentTime = 0;
  
  // Ocultar video y botones
  video.style.display = 'none';
  if (closeButton) {
    closeButton.style.display = 'none';
  }
  if (replayButton) {
    replayButton.style.display = 'none';
  }
  
  // Mostrar estado inicial
  previewImage.style.display = 'block';
  playButton.style.display = 'flex';
}

/**
 * Maneja el inicio de carga del video
 */
function handleVideoLoadStart() {
  console.log('Iniciando carga del video demo');
}

/**
 * Maneja errores de reproducción del video
 */
function handleVideoError() {
  console.error('Error al cargar o reproducir el video demo');
  
  // Usar la función de reset para volver al estado inicial
  resetVideoToInitialState();
  
  // Mostrar mensaje de error al usuario (opcional)
  alert('Error al reproducir el video. Por favor, intenta de nuevo.');
}

// ================================
// INITIALIZATION
// ================================

// ================================
// TESTIMONIALS CAROUSEL FUNCTIONALITY
// ================================

/**
 * Inicializa la funcionalidad del carrusel de testimonios
 */
function initTestimonialsCarousel() {
  const carouselContainer = document.querySelector('.testimonials__carousel');
  const prevButton = document.querySelector('.carousel__btn--prev');
  const nextButton = document.querySelector('.carousel__btn--next');
  const radioButtons = document.querySelectorAll('.testimonials__carousel input[type="radio"]');
  const dots = document.querySelectorAll('.carousel__dots label');
  
  if (!carouselContainer || !prevButton || !nextButton) {
    console.warn('Elementos del carrusel no encontrados');
    return;
  }
  
  let currentSlide = 0;
  const totalSlides = radioButtons.length;
  
  /**
   * Actualiza el slide actual
   * @param {number} slideIndex - Índice del slide a mostrar (0-4)
   */
  function updateSlide(slideIndex) {
    // Asegurar que el índice esté dentro del rango
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    currentSlide = slideIndex;
    
    // Activar el radio button correspondiente
    radioButtons[currentSlide].checked = true;
    
    // Actualizar aria-selected en los dots
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-selected', index === currentSlide ? 'true' : 'false');
    });
    
    // Anunciar el cambio a lectores de pantalla
    const testimonialCard = document.querySelector('.carousel__item:nth-child(' + (currentSlide + 1) + ') .testimonial-card__name');
    if (testimonialCard) {
      const authorName = testimonialCard.textContent;
      carouselContainer.setAttribute('aria-label', `Carrusel de testimonios de usuarios. Mostrando testimonio de ${authorName}`);
    }
  }
  
  /**
   * Navega al slide anterior
   */
  function previousSlide() {
    updateSlide(currentSlide - 1);
  }
  
  /**
   * Navega al siguiente slide
   */
  function nextSlide() {
    updateSlide(currentSlide + 1);
  }
  
  // Event listeners para los botones de navegación
  prevButton.addEventListener('click', previousSlide);
  nextButton.addEventListener('click', nextSlide);
  
  // Event listeners para navegación con teclado en los botones
  prevButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      previousSlide();
    }
  });
  
  nextButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    }
  });
  
  // Event listeners para los dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateSlide(index));
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateSlide(index);
      }
      // Navegación con flechas entre dots
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevDot = index > 0 ? dots[index - 1] : dots[dots.length - 1];
        prevDot.focus();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextDot = index < dots.length - 1 ? dots[index + 1] : dots[0];
        nextDot.focus();
      }
    });
  });
  
  // Navegación con teclado en el carrusel
  carouselContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      previousSlide();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  });
  
  // Inicializar el primer slide
  updateSlide(0);
}

// ================================
// COUNTDOWN TIMER FUNCTIONALITY
// ================================

/**
 * Variables para el countdown timer
 */
let countdownInterval;
let countdownEndDate;

/**
 * Inicializa el countdown timer
 */
function initCountdownTimer() {
  // Obtener elementos del DOM
  const daysElement = document.getElementById('countdown-days');
  const hoursElement = document.getElementById('countdown-hours');
  const minutesElement = document.getElementById('countdown-minutes');
  const secondsElement = document.getElementById('countdown-seconds');
  
  // Verificar que los elementos existan
  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
    console.warn('Elementos del countdown timer no encontrados');
    return;
  }
  
  // Establecer fecha objetivo (30 días desde ahora)
  countdownEndDate = new Date();
  countdownEndDate.setDate(countdownEndDate.getDate() + 30);

  // Iniciar el countdown
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Actualiza los valores del countdown timer
 */
function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownEndDate.getTime() - now;
  
  // Si el countdown ha terminado
  if (distance < 0) {
    clearInterval(countdownInterval);
    handleCountdownEnd();
    return;
  }
  
  // Calcular tiempo restante
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  // Actualizar los elementos del DOM con animación
  updateCountdownElement('countdown-days', days);
  updateCountdownElement('countdown-hours', hours);
  updateCountdownElement('countdown-minutes', minutes);
  updateCountdownElement('countdown-seconds', seconds);
}

/**
 * Actualiza un elemento individual del countdown con animación
 */
function updateCountdownElement(elementId, newValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const currentValue = parseInt(element.textContent) || 0;
  
  // Solo actualizar si el valor ha cambiado
  if (currentValue !== newValue) {
    // Agregar clase de animación
    element.classList.add('countdown__number--updating');
    
    // Actualizar el valor después de un pequeño delay para la animación
    setTimeout(() => {
      element.textContent = newValue.toString().padStart(2, '0');
      element.classList.remove('countdown__number--updating');
    }, 150);
  }
}

/**
 * Maneja el final del countdown
 */
function handleCountdownEnd() {
  console.log('¡Countdown terminado!');
  
  // Mostrar ceros
  updateCountdownElement('countdown-days', 0);
  updateCountdownElement('countdown-hours', 0);
  updateCountdownElement('countdown-minutes', 0);
  updateCountdownElement('countdown-seconds', 0);
  
  // Agregar clase especial para indicar que terminó
  const countdownContainer = document.querySelector('.countdown');
  if (countdownContainer) {
    countdownContainer.classList.add('countdown--ended');
  }
  
  // Opcional: mostrar un mensaje o realizar alguna acción
  setTimeout(() => {
    alert('¡La oferta especial ha terminado! Pero aún puedes aprovechar nuestros planes regulares.');
  }, 500);
}

/**
 * Reinicia el countdown timer con una nueva fecha
 */
function resetCountdownTimer(days = 30) {
  // Limpiar intervalo existente
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  // Establecer nueva fecha objetivo
  countdownEndDate = new Date();
  countdownEndDate.setDate(countdownEndDate.getDate() + days);
  
  // Remover clase de terminado si existe
  const countdownContainer = document.querySelector('.countdown');
  if (countdownContainer) {
    countdownContainer.classList.remove('countdown--ended');
  }
  
  // Reiniciar el countdown
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
  
  console.log('Countdown timer reiniciado. Nueva fecha objetivo:', countdownEndDate);
}

/**
 * Inicializa toda la funcionalidad cuando el DOM está listo
 */
function initializeApp() {
  // Verificar que los elementos existan
  if (!navToggle || !mobileMenu) {
    console.warn('Elementos de navegación no encontrados');
    return;
  }
  
  // Inicializar funcionalidades
  initMobileNavigation();
  initSmoothScrolling();
  initHeaderScrollBehavior();
  initAccessibility();
  initVideoDemo();
  initTestimonialsCarousel();
  initCountdownTimer();
  initFaqAccordion();
  initFormValidation();
  
  console.log('FitLife Pro - App inicializada correctamente');
}

// ================================
// EVENT LISTENERS
// ================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Inicializar cuando la página esté completamente cargada
window.addEventListener('load', () => {
  // Cualquier inicialización adicional que requiera recursos cargados
  console.log('FitLife Pro - Recursos cargados');
});

// ================================
// FAQ ACCORDION FUNCTIONALITY
// ================================

/**
 * Inicializa la funcionalidad del acordeón FAQ
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) {
    console.warn('No se encontraron elementos FAQ');
    return;
  }
  
  faqItems.forEach((item, index) => {
    const button = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    
    if (!button || !answer) {
      console.warn(`Elementos FAQ incompletos en el ítem ${index + 1}`);
      return;
    }
    
    // Configurar IDs únicos para accesibilidad
    const answerId = `faq-answer-${index + 1}`;
    answer.id = answerId;
    button.setAttribute('aria-controls', answerId);
    
    // Event listener para el botón
    button.addEventListener('click', () => toggleFaqItem(item, button, answer));
    
    // Soporte para teclado (Enter y Espacio)
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaqItem(item, button, answer);
      }
    });
  });
}

/**
 * Alterna la visibilidad de un elemento FAQ
 * @param {Element} item - El elemento .faq-item
 * @param {Element} button - El botón de la pregunta
 * @param {Element} answer - El elemento de la respuesta
 */
function toggleFaqItem(item, button, answer) {
  const isActive = item.classList.contains('active');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  
  // Cerrar otros elementos FAQ (comportamiento de acordeón)
  const allFaqItems = document.querySelectorAll('.faq-item');
  allFaqItems.forEach(otherItem => {
    if (otherItem !== item && otherItem.classList.contains('active')) {
      closeFaqItem(otherItem);
    }
  });
  
  // Alternar el elemento actual
  if (isActive || isExpanded) {
    closeFaqItem(item);
  } else {
    openFaqItem(item);
  }
}

/**
 * Abre un elemento FAQ
 * @param {Element} item - El elemento .faq-item
 */
function openFaqItem(item) {
  const button = item.querySelector('.faq-item__question');
  const answer = item.querySelector('.faq-item__answer');
  
  if (!button || !answer) return;
  
  // Agregar clase active
  item.classList.add('active');
  
  // Actualizar atributo aria-expanded
  button.setAttribute('aria-expanded', 'true');
  
  // Enfocar en el contenido para lectores de pantalla
  setTimeout(() => {
    answer.setAttribute('tabindex', '-1');
    answer.focus({ preventScroll: true });
  }, 200);
}

/**
 * Cierra un elemento FAQ
 * @param {Element} item - El elemento .faq-item
 */
function closeFaqItem(item) {
  const button = item.querySelector('.faq-item__question');
  const answer = item.querySelector('.faq-item__answer');
  
  if (!button || !answer) return;
  
  // Remover clase active
  item.classList.remove('active');
  
  // Actualizar atributo aria-expanded
  button.setAttribute('aria-expanded', 'false');
  
  // Remover tabindex del contenido
  answer.removeAttribute('tabindex');
}

/**
 * Cierra todos los elementos FAQ
 */
function closeAllFaqItems() {
  const faqItems = document.querySelectorAll('.faq-item.active');
  faqItems.forEach(item => closeFaqItem(item));
}

// ================================
// FORM VALIDATION FUNCTIONALITY
// ================================

/**
 * Inicializa la validación de formularios
 */
function initFormValidation() {
  const heroForm = document.getElementById('hero-form');
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (heroForm) {
    initHeroFormValidation(heroForm);
  }
  
  if (newsletterForm) {
    initNewsletterFormValidation(newsletterForm);
  }
}

/**
 * Valida si un email es válido usando regex
 * @param {string} email - El email a validar
 * @returns {boolean} - True si es válido, false si no
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailRegex.test(email);
}

/**
 * Muestra un mensaje de error en el elemento especificado
 * @param {HTMLElement} errorElement - El elemento donde mostrar el error
 * @param {string} message - El mensaje de error
 */
function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

/**
 * Oculta el mensaje de error
 * @param {HTMLElement} errorElement - El elemento de error a ocultar
 */
function hideError(errorElement) {
  errorElement.textContent = '';
  errorElement.style.display = 'none';
}

/**
 * Muestra un mensaje de éxito en el elemento especificado
 * @param {HTMLElement} successElement - El elemento donde mostrar el éxito
 * @param {string} message - El mensaje de éxito
 */
function showSuccess(successElement, message) {
  successElement.textContent = message;
  successElement.style.display = 'block';
  
  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    hideSuccess(successElement);
  }, 5000);
}

/**
 * Oculta el mensaje de éxito
 * @param {HTMLElement} successElement - El elemento de éxito a ocultar
 */
function hideSuccess(successElement) {
  successElement.textContent = '';
  successElement.style.display = 'none';
}

/**
 * Agrega o remueve clase de error al input
 * @param {HTMLElement} input - El elemento input
 * @param {boolean} hasError - Si tiene error o no
 */
function toggleInputError(input, hasError) {
  if (hasError) {
    input.classList.add('form__input--error');
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.classList.remove('form__input--error');
    input.setAttribute('aria-invalid', 'false');
  }
}

/**
 * Inicializa la validación del formulario del hero
 * @param {HTMLElement} form - El formulario del hero
 */
function initHeroFormValidation(form) {
  const emailInput = form.querySelector('#hero-email');
  const errorElement = form.querySelector('#hero-email-error');
  const successElement = form.querySelector('#hero-form-success');
  const submitButton = form.querySelector('.form__submit');
  
  // Validación en tiempo real mientras escribe
  emailInput.addEventListener('input', () => {
    validateHeroEmail(emailInput, errorElement);
  });
  
  // Validación al perder foco
  emailInput.addEventListener('blur', () => {
    validateHeroEmail(emailInput, errorElement);
  });
  
  // Validación al enviar el formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const isValidForm = validateHeroEmail(emailInput, errorElement);
    
    if (isValidForm) {
      // Simular envío exitoso
      hideError(errorElement);
      showSuccess(successElement, '¡Perfecto! Te hemos enviado un email con los detalles de tu prueba gratuita.');
      
      // Opcional: Limpiar formulario
      emailInput.value = '';
      toggleInputError(emailInput, false);
      
      // Opcional: Deshabilitar botón temporalmente
      submitButton.disabled = true;
      submitButton.textContent = 'Enviado ✓';
      
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Comenzar Gratis';
      }, 3000);
    }
  });
}

/**
 * Valida el email del formulario del hero
 * @param {HTMLElement} input - El input de email
 * @param {HTMLElement} errorElement - El elemento de error
 * @returns {boolean} - True si es válido
 */
function validateHeroEmail(input, errorElement) {
  const email = input.value.trim();
  
  // Campo vacío
  if (!email) {
    showError(errorElement, 'Por favor, ingresa tu email');
    toggleInputError(input, true);
    return false;
  }
  
  // Email inválido
  if (!isValidEmail(email)) {
    showError(errorElement, 'Por favor, ingresa un email válido');
    toggleInputError(input, true);
    return false;
  }
  
  // Email válido
  hideError(errorElement);
  toggleInputError(input, false);
  return true;
}

/**
 * Inicializa la validación del formulario del newsletter
 * @param {HTMLElement} form - El formulario del newsletter
 */
function initNewsletterFormValidation(form) {
  const emailInput = form.querySelector('#newsletter-email');
  const errorElement = form.querySelector('#newsletter-email-error');
  const successElement = form.querySelector('#newsletter-form-success');
  const submitButton = form.querySelector('.newsletter__submit');
  
  // Validación en tiempo real mientras escribe
  emailInput.addEventListener('input', () => {
    validateNewsletterEmail(emailInput, errorElement);
  });
  
  // Validación al perder foco
  emailInput.addEventListener('blur', () => {
    validateNewsletterEmail(emailInput, errorElement);
  });
  
  // Validación al enviar el formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const isValidForm = validateNewsletterEmail(emailInput, errorElement);
    
    if (isValidForm) {
      // Simular envío exitoso
      hideError(errorElement);
      showSuccess(successElement, '¡Gracias! Te has suscrito exitosamente a nuestro newsletter.');
      
      // Opcional: Limpiar formulario
      emailInput.value = '';
      toggleInputError(emailInput, false);
      
      // Opcional: Deshabilitar botón temporalmente
      submitButton.disabled = true;
      submitButton.textContent = 'Suscrito ✓';
      
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Suscribirse';
      }, 3000);
    }
  });
}

/**
 * Valida el email del formulario del newsletter
 * @param {HTMLElement} input - El input de email
 * @param {HTMLElement} errorElement - El elemento de error
 * @returns {boolean} - True si es válido
 */
function validateNewsletterEmail(input, errorElement) {
  const email = input.value.trim();
  
  // Campo vacío
  if (!email) {
    showError(errorElement, 'Por favor, ingresa tu email');
    toggleInputError(input, true);
    return false;
  }
  
  // Email inválido
  if (!isValidEmail(email)) {
    showError(errorElement, 'Por favor, ingresa un email válido');
    toggleInputError(input, true);
    return false;
  }
  
  // Email válido
  hideError(errorElement);
  toggleInputError(input, false);
  return true;
}

// ================================
// EXPORT FUNCTIONS (para posible uso en otros archivos)
// ================================

// Si se usa en un entorno de módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    initMobileNavigation,
    initTestimonialsCarousel,
    initCountdownTimer,
    resetCountdownTimer,
    initFaqAccordion,
    toggleFaqItem,
    openFaqItem,
    closeFaqItem,
    closeAllFaqItems,
    initFormValidation,
    isValidEmail,
    showError,
    hideError,
    showSuccess,
    hideSuccess
  };
}
