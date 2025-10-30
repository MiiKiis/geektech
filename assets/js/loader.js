async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const partialUrl = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now();
  try {
    const res = await fetch(partialUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' -> ' + url);
    el.innerHTML = await res.text();

    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-menu');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.textContent = nav.classList.contains('active') ? 'Cerrar' : 'Menú';
      });
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            nav.classList.remove('active');
            toggle.textContent = 'Menú';
          }
        });
      });
      const current = location.pathname.split('/').pop() || 'index.html';
      nav.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
      });
    }
  } catch (e) {
    console.error('Parcial no cargado:', e);
    el.innerHTML = '<!-- Error cargando ' + url + ' -->';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartial('#site-header', 'partials/header.html');
  loadPartial('#site-footer', 'partials/footer.html');
});
