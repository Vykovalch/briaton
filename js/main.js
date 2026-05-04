import { loadProducts } from './api.js';
import { initCart } from './components/cart.js'
import { initCatalog } from './components/catalog.js';
import { renderDayProducts } from './components/slider.js';
import { initForm } from './components/form.js';
import { initUI } from './components/ui.js';


async function init() {
  // Загружаем данные
  await loadProducts();

  // Инициализируем каталог товаров 
  initCatalog()

  // Инициализируем корзину
  initCart();

  // Генерируем слайдер
  renderDayProducts();

  // Инициализируем форму
  initForm();

  // Инициализируем UI
  initUI();
}

window.addEventListener('DOMContentLoaded', () => {
  init();
}); 