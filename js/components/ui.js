import { state } from '../state.js';
import { CITY_KEYS } from '../constants.js';


function initTooltips() {
  const tooltipButtons = document.querySelectorAll('.tooltip__btn');

  tooltipButtons.forEach(button => {
    const tooltipContent = button.nextElementSibling;

    if (tooltipContent && tooltipContent.classList.contains('tooltip__content')) {
      tippy(button, {
        content: tooltipContent.innerHTML,
        allowHTML: true,
        theme: 'lightwhite',
        placement: 'left-end',
        interactive: true,
        arrow: false,
        offset: [-9, 8],
        trigger: 'mouseenter focus',
        animation: 'fade',
        duration: [200, 150]
      });
    }
  });
}

function updateCity(cityName) {
  state.selectedCity = CITY_KEYS[cityName];
}

function showModal(message) {
  const existingModal = document.querySelector('.message');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'message';
  modal.innerHTML = `
    <div class="message__content">
      <button class="message__close" type="button" aria-label="Закрыть">
        <svg width="24" height="24" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
      ${message}
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
  };

  modal.querySelector('.message__close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function initCatalogMenuListeners() {
  const catalogBtnEl = document.querySelector('.header__catalog-btn');
  const catalogCloseBtnEl = document.querySelector('.main-menu__close');
  const mainMenuEl = document.querySelector('.main-menu');

  if (!catalogBtnEl || !catalogCloseBtnEl || !mainMenuEl) return;

  const toggleMenu = (isOpen) => {
    mainMenuEl.classList.toggle('main-menu--active', isOpen);
  };

  catalogBtnEl.addEventListener('click', () => toggleMenu(true));
  catalogCloseBtnEl.addEventListener('click', () => toggleMenu(false));
}

function initCitySelectorListeners() {
  const locationBtnEl = document.querySelector('.location__city');
  const cityOptionEls = document.querySelectorAll('.location__sublink');
  const cityNameEl = document.querySelector('.location__city-name');

  if (!locationBtnEl || !cityNameEl) return;

  const toggleCityMenu = (isOpen) => {
    locationBtnEl.classList.toggle('location__city--active', isOpen);
  };

  // Открытие/закрытие меню
  locationBtnEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !locationBtnEl.classList.contains('location__city--active');
    toggleCityMenu(isOpen);
  });

  // Выбор города
  cityOptionEls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const cityName = btn.textContent.trim();
      cityNameEl.textContent = cityName;
      updateCity(cityName);
      toggleCityMenu(false);
    });
  });
}

function initAccordionListener() {
  const accordionBtns = document.querySelectorAll('.accordion__btn');

  if (!accordionBtns.length) return;

  accordionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const isActive = btn.classList.contains('accordion__btn--active');
      const content = btn.nextElementSibling;

      // Закрываем все открытые аккордеоны
      accordionBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove('accordion__btn--active');
          const otherContent = otherBtn.nextElementSibling;
          if (otherContent) {
            otherContent.style.display = 'none';
          }
        }
      });

      // Переключаем текущий аккордеон
      if (isActive) {
        // Если уже активен - закрываем
        btn.classList.remove('accordion__btn--active');
        if (content) {
          content.style.display = 'none';
        }
      } else {
        // Если не активен - открываем
        btn.classList.add('accordion__btn--active');
        if (content) {
          content.style.display = 'flex';
        }
      }
    });
  });
}

function initUI() {
  initTooltips(); // для продуктов дня
  initCatalogMenuListeners();
  initCitySelectorListeners();
  initAccordionListener();
}

export { initUI, showModal, initTooltips }