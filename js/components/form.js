import { showModal } from './ui.js';


async function submitForm(formData) {
  try {
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        agree: formData.get('agree') === 'on'
      })
    });

    if (!response.ok) throw new Error('Ошибка при отправке формы');

    showModal('Благодарим за обращение!');
    return true;
  } catch (error) {
    console.error('Ошибка отправки:', error);
    showModal('Не удалось отправить обращение!');
    return false;
  }
}

function initForm() {
  const form = document.querySelector('#questions-form');
  if (!form) return;

  const validation = new JustValidate('#questions-form');

  validation
    .addField('#name', [
      { rule: 'required', errorMessage: 'Введите ваше имя' },
      { rule: 'minLength', value: 3, errorMessage: 'Минимальная длина - 3 символа' },
      { rule: 'maxLength', value: 20, errorMessage: 'Максимальная длина - 20 символов' }
    ])
    .addField('#email', [
      { rule: 'required', errorMessage: 'Введите вашу почту' },
      { rule: 'email', errorMessage: 'Почта введена неверно' }
    ])
    .addField('#agree', [
      { rule: 'required', errorMessage: 'Согласие обязательно' }
    ])
    .onSuccess(async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const success = await submitForm(formData);
      if (success) {
        form.reset();
        validation.refresh();
      }
    });
}


export { initForm }