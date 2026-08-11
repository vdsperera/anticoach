import { isChaosActive } from '../config.js';

export function init() {
  const nameInput = document.getElementById('name');
  const consentBox = document.getElementById('consent');
  const formMsg = document.getElementById('form-msg');

  nameInput.addEventListener('input', (e) => {
    if (!isChaosActive('formSabotage')) return;
    const v = e.target.value;
    e.target.value = v.split('').reverse().join('');
    e.target.setSelectionRange(0, 0);
  });

  consentBox.addEventListener('click', (e) => {
    if (!isChaosActive('formSabotage')) return;
    e.preventDefault();
    consentBox.checked = false;
    formMsg.textContent = 'consent denied. try harder.';
    formMsg.style.color = 'var(--yellow)';
    setTimeout(() => { formMsg.textContent = ''; }, 1600);
  });

  document.getElementById('submit-btn').addEventListener('click', () => {
    if (!isChaosActive('formSabotage')) {
      formMsg.textContent = 'Success! Your session has been booked cleanly.';
      formMsg.style.color = 'var(--cyan)';
      return;
    }
    formMsg.textContent = 'ERROR: your request was too successful. try failing instead.';
    formMsg.style.color = 'var(--magenta)';
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    formMsg.textContent = 'Message sent! We will never respond.';
    formMsg.style.color = 'var(--cyan)';
  });
}
