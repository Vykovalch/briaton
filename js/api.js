import { state } from './state.js';


async function loadProducts() {
  try {
    const response = await fetch('data/data.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    state.products = await response.json();
    state.filteredProducts = [...state.products];
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}


export { loadProducts }