/* AdTrim landing — tiny enhancements.
   Smooth-scroll for in-page anchors. No tracking, no analytics. */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const viewer = document.querySelector('.screenshot-dialog');
  if (viewer && typeof viewer.showModal === 'function') {
    let opener;
    let current = 0;
    const screenshots = Array.from(document.querySelectorAll('.screenshot-link'));
    function showScreenshot(index) {
      current = (index + screenshots.length) % screenshots.length;
      const link = screenshots[current];
      viewer.querySelector('h2').textContent = link.dataset.caption;
      const image = viewer.querySelector('img');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
    }
    screenshots.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        opener = link;
        showScreenshot(index);
        viewer.showModal();
      });
    });
    viewer.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      showScreenshot(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    viewer.querySelector('.screenshot-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', (event) => {
      const bounds = viewer.getBoundingClientRect();
      if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
    });
    viewer.addEventListener('close', () => opener?.focus());
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();
