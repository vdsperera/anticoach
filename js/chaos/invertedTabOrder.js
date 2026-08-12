import { isChaosActive } from '../config.js';

export function init() {
  if (!isChaosActive('invertedTabOrder')) return;
  const fields = document.querySelectorAll('#chaos-form input, #chaos-form textarea, #chaos-form button');
  const count = fields.length;
  fields.forEach((field, i) => {
    field.setAttribute('tabindex', count - i);
  });
}
