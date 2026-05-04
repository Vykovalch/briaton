import { state } from "../state.js";
import { formatPrice } from "../utils.js";
import { initAddToCartListeners } from "./cart.js";
import { initTooltips } from "./ui.js";

function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-card__visual">
        <img class="product-card__img" src="${product.image}" height="436" width="290"
             alt="Изображение товара">
        <div class="product-card__more">
          <a href="#" class="product-card__link btn btn--icon" data-id="${product.id}">
            <span class="btn__text">В корзину</span>
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-basket"></use>
            </svg>
          </a>
          <a href="#" class="product-card__link btn btn--secondary">
            <span class="btn__text">Подробнее</span>
          </a>
        </div>
      </div>
      <div class="product-card__info">
        <h2 class="product-card__title">${product.name}</h2>
        <span class="product-card__old">
          <span class="product-card__old-number">${formatPrice(product.price.old)}</span>
          <span class="product-card__old-add">₽</span>
        </span>
        <span class="product-card__price">
          <span class="product-card__price-number">${formatPrice(product.price.new)}</span>
          <span class="product-card__price-add">₽</span>
        </span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" aria-label="Показать подсказку">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            <span class="tooltip__text">Наличие товара по городам:</span>
            <ul class="tooltip__list">
              <li class="tooltip__item">
                <span class="tooltip__text">Москва: <span class="tooltip__count">${product.availability.moscow}</span></span>
              </li>
              <li class="tooltip__item">
                <span class="tooltip__text">Оренбург: <span class="tooltip__count">${product.availability.orenburg}</span></span>
              </li>
              <li class="tooltip__item">
                <span class="tooltip__text">Санкт-Петербург: <span class="tooltip__count">${product.availability.saintPetersburg}</span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createEmptyState() {
  return `
    <li class="catalog__empty">
      <p>Товары не найдены. Попробуйте изменить фильтры.</p>
    </li>
  `;
}

function renderProducts() {
  const container = document.querySelector('.catalog__list');

  if (!container) {
    console.error('Контейнер .catalog__list не найден');
    return;
  }

  if (state.filteredProducts.length === 0) {
    container.innerHTML = createEmptyState();
    return;
  }

  // Вычисляем индексы для текущей страницы
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;

  // Получаем товары для текущей страницы
  const productsToShow = state.filteredProducts.slice(startIndex, endIndex);

  container.innerHTML = productsToShow
    .map(product => `<li class="catalog__item">${createProductCard(product)}</li>`)
    .join('');

  initAddToCartListeners();
  initTooltips();
}

function renderPagination() {
  const paginationContainer = document.querySelector('.catalog__pagination');

  if (!paginationContainer) {
    console.error('Контейнер пагинации не найден');
    return;
  }

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);

  // Если товаров 6 или меньше, скрываем пагинацию
  if (state.filteredProducts.length <= state.itemsPerPage) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';

  // Генерируем HTML для кнопок пагинации
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = 'catalog__pagination-item';

    const pageButton = document.createElement('button');
    pageButton.className = 'catalog__pagination-link';
    pageButton.textContent = i;

    // Деактивируем текущую страницу
    if (i === state.currentPage) {
      pageButton.disabled = true;
    }

    // Добавляем обработчик клика
    pageButton.addEventListener('click', () => {
      state.currentPage = i;
      renderProducts();
      renderPagination();

      // Прокручиваем страницу к началу каталога
      const catalogTitle = document.querySelector('.catalog__title');
      if (catalogTitle) {
        catalogTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    pageItem.appendChild(pageButton);
    paginationContainer.appendChild(pageItem);
  }
}

function sortProducts() {
  if (state.sortBy === 'price-min') {
    state.filteredProducts.sort((a, b) => a.price.new - b.price.new);
  } else if (state.sortBy === 'price-max') {
    state.filteredProducts.sort((a, b) => b.price.new - a.price.new);
  } else if (state.sortBy === 'rating-max') {
    state.filteredProducts.sort((a, b) => b.rating - a.rating);
  }
}

function applyFilters() {
  const { types, status } = state.filters;
  state.filteredProducts = state.products.filter(product => {

    if (types.length > 0) {
      const hasMatchingType = types.some(type => product.type.includes(type));
      if (!hasMatchingType) return false;
    }

    if (status === 'instock') {
      const isInStock = Object.values(product.availability).some(count => count > 0);
      if (!isInStock) return false;
    }

    return true;
  });

  sortProducts();
  state.currentPage = 1;
  renderProducts();
  renderPagination();
}

function updateFilter(key, value) {
  state.filters[key] = value;
  applyFilters();
}

function updateSort(sortType) {
  state.sortBy = sortType;
  sortProducts();
  state.currentPage = 1;
  renderProducts();
  renderPagination();
}

function resetFilters() {
  state.filters = {
    types: [],
    status: 'all-item'
  };

  // Сбрасываем чекбоксы типов
  document.querySelectorAll('input[name="type"]').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Сбрасываем радиокнопки статуса
  const allItemRadio = document.getElementById('all-item');
  if (allItemRadio) {
    allItemRadio.checked = true;
  }

  applyFilters();
}

function setFilterCounters() {
  const typeCheckboxes = document.querySelectorAll('input[name="type"]');

  typeCheckboxes.forEach(checkbox => {
    const type = checkbox.value;
    const countEl = checkbox.closest('.custom-checkbox').querySelector('.custom-checkbox__count');

    if (countEl) {
      // Подсчитываем количество товаров с данным типом
      const count = state.products.filter(product =>
        product.type.includes(type)
      ).length;

      countEl.textContent = count;
    }
  });
}

function initFiltersListeners() {
  // Чекбоксы типов товаров
  const typeCheckboxes = document.querySelectorAll('input[name="type"]');
  typeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const type = checkbox.value;
      const isChecked = checkbox.checked;

      let newTypes = [...state.filters.types];

      if (isChecked) {
        newTypes.push(type);
      } else {
        newTypes = newTypes.filter(t => t !== type);
      }

      updateFilter('types', newTypes);
    });
  });

  // Радиокнопки статуса
  const statusRadios = document.querySelectorAll('input[name="status"]');
  statusRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateFilter('status', radio.value);
    });
  });

  // Кнопка сброса фильтров
  const resetButton = document.querySelector('.catalog-form__reset');
  if (resetButton) {
    resetButton.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
    });
  }
}

function initSortListener() {
  const sortSelect = document.querySelector('.catalog__sort-select');

  if (!sortSelect) {
    console.error('Элемент сортировки не найден');
    return;
  }

  sortSelect.addEventListener('change', (e) => {
    updateSort(e.target.value);
  });
}

function initCatalog() {
  setFilterCounters();
  sortProducts();
  renderProducts();
  renderPagination();

  initFiltersListeners();
  initSortListener();
}

export { initCatalog, createProductCard }