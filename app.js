// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    mobileMenuToggle.textContent = isOpen ? 'Cerrar' : 'Menú';
  });
}
// Close on link click (mobile)
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navMenu.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.textContent = 'Menú';
    }
  });
});

// Highlight active nav item
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNav();

// WhatsApp helper
function contactWhatsApp(productName) {
  const phone = '59160142898';
  const message = `Hola GeekTech, me interesa: ${productName}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Búsqueda client-side (filtra las cards visibles)
(function setupLocalSearch(){
  const input = document.querySelector('.search-bar input');
  if (!input) return;

  function normalize(s){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function applyFilter(){
    const q = normalize(input.value.trim());
    const cards = document.querySelectorAll('.products-grid .card');
    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent || '';
      const desc  = card.querySelector('.card-content p')?.textContent || '';
      const hay = normalize(title + ' ' + desc).includes(q);
      card.style.display = q ? (hay ? '' : 'none') : '';
    });
  }

  // Buscar mientras escribe y al pulsar Enter
  input.addEventListener('input', applyFilter);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilter(); });
})();

// Búsqueda local: filtra cards por título o descripción
(function setupLocalSearch(){
  const input = document.querySelector('.search-bar input');
  if (!input) return;

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function applyFilter(){
    const q = norm(input.value.trim());
    const cards = document.querySelectorAll('.products-grid .card');
    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent || '';
      const desc  = card.querySelector('.card-content p')?.textContent || '';
      const hit = norm(title + ' ' + desc).includes(q);
      card.style.display = q ? (hit ? '' : 'none') : '';
    });
  }

  input.addEventListener('input', applyFilter);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilter(); });
})();

// Búsqueda local con espera de parciales y "Sin resultados"
(function setupLocalSearch(){
  function norm(s){ return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function bindSearch(){
    const input = document.querySelector('.search-bar input');
    const grid = document.querySelector('.products-grid');
    if (!input || !grid) return false;

    let empty = document.getElementById('search-empty');
    if (!empty) {
      empty = document.createElement('div');
      empty.id = 'search-empty';
      empty.textContent = 'Sin resultados';
      empty.style.color = '#aaa';
      empty.style.padding = '8px 16px';
      empty.style.display = 'none';
      grid.parentElement.insertBefore(empty, grid.nextSibling);
    }

    function apply(){
      const q = norm(input.value.trim());
      const cards = grid.querySelectorAll('.card');
      let visibles = 0;
      cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent;
        const desc  = card.querySelector('.card-content p')?.textContent;
        const hit = norm(title + ' ' + desc).includes(q);
        card.style.display = q ? (hit ? '' : 'none') : '';
        if (card.style.display !== 'none') visibles++;
      });
      empty.style.display = q && visibles === 0 ? 'block' : 'none';
    }

    input.addEventListener('input', apply);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); });
    return true;
  }

  if (!bindSearch()) {
    const observer = new MutationObserver(() => {
      if (bindSearch()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
