import { state } from "../state.js";
import { formatPrice } from "../utils.js";


function addToCart(productId) {
  const id = Number(productId);
  const product = state.products.find(p => p.id === id);

  if (!product) {
    console.error('Товар не найден');
    return;
  }

  // Проверяем, есть ли уже такой товар в корзине
  const existingProduct = state.cart.find(item => item.id === id);

  if (existingProduct) {
    console.log('Товар уже в корзине');
    return;
  }

  state.cart.push(product);

  updateCartCounter();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== Number(productId));

  updateCartCounter();
  renderCart();
}

function updateCartCounter() {
  const counterEl = document.querySelector('.header__user-count');

  if (!counterEl) return;

  counterEl.textContent = state.cart.length;
}

function renderCart() {
  const basketList = document.querySelector('.basket__list');
  const emptyBlock = document.querySelector('.basket__empty-block');
  const checkoutLink = document.querySelector('.basket__link');

  if (!basketList || !emptyBlock) return;

  // Если в корзине нет товаров
  if (state.cart.length === 0) {
    basketList.innerHTML = '';
    emptyBlock.style.display = 'block';

    if (checkoutLink) {
      checkoutLink.style.display = 'none';
    }

    return;
  }

  // Если в корзине есть товары
  emptyBlock.style.display = 'none';

  if (checkoutLink) {
    checkoutLink.style.display = 'block';
  }

  // Генерируем HTML для каждого товара в корзине
  basketList.innerHTML = state.cart.map(product => `
    <li class="basket__item">
      <div class="basket__img">
        <img src="${product.image}" alt="Фотография товара" height="60" width="60">
      </div>
      <span class="basket__name">${product.name}</span>
      <span class="basket__price">${formatPrice(product.price.new)} руб</span>
      <button class="basket__close" type="button" data-id="${product.id}">
        <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    </li>
  `).join('');

  // Добавляем обработчики на кнопки удаления
  initRemoveFromCartListeners();
}

function initAddToCartListeners() {
  const addToCartBtns = document.querySelectorAll('.product-card__link.btn--icon');

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const productId = btn.getAttribute('data-id');
      addToCart(productId);
    });
  });
}

function initRemoveFromCartListeners() {
  const removeButtons = document.querySelectorAll('.basket__close');

  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const productId = btn.getAttribute('data-id');
      removeFromCart(productId);
    });
  });
}

function initCartToggleListener() {
  const cartBtn = document.querySelector('.header__user-item:first-child .header__user-btn');
  const basketEl = document.querySelector('.basket');

  if (!cartBtn || !basketEl) return;

  const toggleBasket = (isOpen) => {
    basketEl.classList.toggle('basket--active', isOpen);
  };

  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = !basketEl.classList.contains('basket--active');
    toggleBasket(isOpen);
  });
}

function initCart() {
  updateCartCounter();
  renderCart();
  initCartToggleListener();
}

export {
  initCart,
  initAddToCartListeners
}