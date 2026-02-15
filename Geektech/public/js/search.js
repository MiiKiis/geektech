import { gamesPageData } from './data_games.js';
import { keysData } from './data_keys.js';
import { tiendaData } from './data_tienda.js';
import { formatPrice } from './common.js';

export function setupGlobalSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.querySelector('.search-container');

    if (!searchInput || !searchContainer) return;

    // Create results container if it doesn't exist
    let resultsDropdown = document.getElementById('searchResults');
    if (!resultsDropdown) {
        resultsDropdown = document.createElement('div');
        resultsDropdown.id = 'searchResults';
        resultsDropdown.className = 'search-results';
        searchContainer.appendChild(resultsDropdown);
    }

    // Combine all data with source links and IDs
    const allProducts = [
        ...gamesPageData.map(p => ({ ...p, link: `games.html?id=${p.id}`, type: 'Juego' })),
        ...keysData.map(p => ({ ...p, link: `windows-keys.html?id=${p.id}`, type: 'Licencia' })),
        // Store items now go to index.html
        ...tiendaData.map(p => ({ ...p, link: `index.html?id=${p.id}`, type: 'Tienda' }))
    ];

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();

        if (term.length < 2) {
            resultsDropdown.classList.remove('active');
            resultsDropdown.innerHTML = '';
            return;
        }

        const matches = allProducts.filter(p =>
            p.title.toLowerCase().includes(term) ||
            (p.genre && p.genre.toLowerCase().includes(term))
        );

        renderResults(matches, resultsDropdown);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            resultsDropdown.classList.remove('active');
        }
    });

    // Re-open if focused and has content
    searchInput.addEventListener('focus', () => {
        if (resultsDropdown.innerHTML.trim() !== '') {
            resultsDropdown.classList.add('active');
        }
    });

    // Handle clicks for animation
    resultsDropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.search-item');
        if (item) {
            e.preventDefault(); // Stop immediate navigation
            const href = item.getAttribute('href');

            // Add animation class
            item.classList.add('clicked');

            // Wait for animation then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 350); // Match animation duration roughly
        }
    });
}

function renderResults(products, container) {
    if (products.length === 0) {
        container.innerHTML = `<div class="search-item empty">No se encontraron resultados</div>`;
        container.classList.add('active');
        return;
    }

    const html = products.slice(0, 5).map(p => `
        <a href="${p.link}" class="search-item">
            <img src="${p.img}" onerror="this.style.display='none'" class="search-img">
            <div class="search-info">
                <div class="search-title">${p.title}</div>
                <div class="search-meta">
                    <span class="search-type">${p.type}</span>
                    <span class="search-price">${formatPrice(p.price)}</span>
                </div>
            </div>
        </a>
    `).join('');

    container.innerHTML = html;
    container.classList.add('active');
}
