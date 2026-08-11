import { isChaosActive } from '../config.js';

export function init() {
  document.querySelectorAll('nav a[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      let targetId = link.dataset.target;
      if (!isChaosActive('menuRedirection')) {
        const label = link.textContent.trim().toLowerCase();
        if (label.includes('home')) targetId = 'home';
        else if (label.includes('about')) targetId = 'about';
        else if (label.includes('services')) targetId = 'services';
        else if (label.includes('help')) targetId = 'help';
        else if (label.includes('pay-to-fix')) targetId = 'bounties';
        else if (label.includes('contribute')) targetId = 'contribute';
      }
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
