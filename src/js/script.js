////////////////////////////////////////////////////////////////////////////////
/// Elements
////////////////////////////////////////////////////////////////////////////////

const el = {};

function setElements() {
  el.container = document.querySelector('.container');
  el.heading = document.querySelector('.heading');
  el.form = document.querySelector('.form');
  el.fieldset = document.querySelector('.form__fieldset');
  el.email = document.querySelector('input[name="email"]');
  el.password = document.querySelector('input[name="password"]');
  el.button = document.querySelector('.btn');
}


////////////////////////////////////////////////////////////////////////////////
/// Helpers
////////////////////////////////////////////////////////////////////////////////

function disableForm() {
  el.fieldset.disabled = true;
  el.button.textContent = 'Вхожу...';
}

function enableForm() {
  el.fieldset.disabled = false;
  el.button.textContent = 'Войти';
}

function replaceFormWithUserData(name, bonus) {
  el.heading.textContent = 'Привет';

  const userData = document.createElement('div'),
        userName = document.createElement('p'),
        userBonus = document.createElement('p');

  userName.textContent = `Пользователь: ${name}`;
  userBonus.textContent = `Количество баллов: ${bonus}`;
  userData.appendChild(userName);
  userData.appendChild(userBonus);

  el.container.replaceChild(userData, el.form);
}

function showError() {
  el.form.classList.add('form_error');
}

function hideError() {
  el.form.classList.remove('form_error');
}


////////////////////////////////////////////////////////////////////////////////
/// API requests
////////////////////////////////////////////////////////////////////////////////

function getUserData() {
  return fetch('http://test.kluatr.ru/api/user/data', {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }
      return jsonResponse.data;
    });
}

function login(email, password) {
  const params = {email, password},
        body = Object.keys(params).map(key => (
          encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        )).join('&');

  return fetch('http://test.kluatr.ru/api/user/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }
      return getUserData();
    });
}


////////////////////////////////////////////////////////////////////////////////
/// App logic
////////////////////////////////////////////////////////////////////////////////

function handleSubmit(event) {
  event.preventDefault();
  disableForm();

  login(el.email.value, el.password.value)
    .then(data => {
      replaceFormWithUserData(data.name, data.bonus);
    })
    .catch(error => {
      console.error(`Server error: ${error.message}`);
      showError();
      enableForm();
    });
}

function main() {
  setElements();
  el.email.addEventListener('input', hideError);
  el.password.addEventListener('input', hideError);
  el.form.addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', main);
