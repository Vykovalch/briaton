import { state } from "../state.js";
import { createProductCard } from "./catalog.js"

function createSlide(product) {
  return `
    <li class="day-products__item swiper-slide">
      ${createProductCard(product)}
    </li>
  `;
}

function createDayProductsSlides() {
  const dayProducts = state.products.filter(product => product.goodsOfDay === true);

  return dayProducts
    .map(product => createSlide(product))
    .join('');
}

function initSwiper() {
  const swiper = new Swiper('.day-products__slider', {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
  });

  return swiper;
}

function renderDayProducts() {
  const swiperWrapper = document.querySelector('.day-products__list');

  if (!swiperWrapper) {
    console.error('Контейнер .day-products__list не найден');
    return;
  }

  swiperWrapper.innerHTML = createDayProductsSlides();

  initSwiper();
}

export { renderDayProducts }