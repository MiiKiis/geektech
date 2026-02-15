import { renderHeader, renderFooter } from './layout.js';
import { tiendaData as games } from './data_tienda.js';
import { setupCommonUI, addToCart, formatPrice, openWhatsAppProduct, preloadImages, checkHighlight } from './common.js';
// Carousel removed for Antigravity concept

// DOM Elements
const grid = document.getElementById("gameGrid");
const genreFilter = document.getElementById("genre");
const platformFilter = document.getElementById("platform");
const searchInput = document.getElementById("searchInput");
const viewGridBtn = document.getElementById("viewGrid");
const viewListBtn = document.getElementById("viewList");

// Global Modal Elements - Managed by common.js

let currentGlobalProduct = null;
let currentSelectedPackage = null;

let currentCategory = 'all';
window.currentPlatform = 'all';
window.currentGenre = 'all';

// Global Product Logic - Managed by common.js via window.openGlobalProduct

function init() {
    renderHeader('store');
    renderFooter();
    setupCommonUI();

    // Carousel removed in favor of "Antigravity Hero"

    // Preload top images for performance
    const topImages = games.slice(0, 4).map(g => g.img);
    preloadImages(topImages);

    // Remove artificial delay for speed
    renderGames(games);
    setupEventListeners();

    // Check for search highlight
    checkHighlight();
}

function renderGames(data) {
    grid.innerHTML = "";

    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">No se encontraron productos en esta categoría.</div>`;
        return;
    }

    data.forEach((game, index) => {
        const card = document.createElement("article");
        card.className = "game-card";
        // Adding data-* attributes as requested
        card.dataset.id = game.id; // Search Highlight ID
        card.dataset.genre = game.genre;
        card.dataset.platform = game.platform;

        const formattedPrice = formatPrice(game.price);

        // Eager load first 3 images
        const loadingAttr = index < 3 ? 'eager' : 'lazy';

        card.innerHTML = `
      <div class="card-image-wrapper" style="cursor: pointer;">
        <img src="${game.img}" alt="${game.title}" class="card-image" loading="${loadingAttr}" onerror="this.style.display='none'">
      </div>
      <div class="card-content">
        <div class="game-info-left">
        <div class="game-info-left">
            <h3 class="game-title" title="${game.title}">${game.title}</h3>
            ${game.subtitle ? `<p class="game-subtitle">${game.subtitle}</p>` : ''}
        </div>
        <div class="card-footer">
          <div class="price">${formattedPrice}</div>
          <div style="display: flex; gap: 0.5rem;">
              <button class="btn-cart-icon" aria-label="Agregar al carrito">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </button>
              <button class="btn-buy" aria-label="Comprar en WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Comprar
              </button>
          </div>
        </div>
      </div>
    `;

        // Cart Action
        const cartBtn = card.querySelector(".btn-cart-icon");
        cartBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(game);
        });

        // Buy Action (Card Click for Detail View)
        // We attach click to the entire card (except buttons) to open detail view
        card.addEventListener('click', (e) => {
            // Prevent if clicked on buttons
            if (e.target.closest('button')) return;
            window.openGlobalProduct(game);
        });

        // Direct Buy Button (Keep functionality or remove if redundant)
        const buyBtn = card.querySelector(".btn-buy");
        buyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            // Option: Open detail view instead of direct whatsapp?
            // openProductDetail(game);
            openWhatsAppProduct(game);
        });

        grid.appendChild(card);
    });
}

function filterGames() {
    const genre = window.currentGenre || 'all';
    const platform = window.currentPlatform || 'all';
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = games.filter(game => {
        // Robust filtering: check includes for multi-genre or exact match
        const gameGenre = game.genre ? game.genre.toLowerCase() : '';
        const gamePlatform = game.platform ? game.platform.toLowerCase() : '';
        const gameCategory = game.category ? game.category.toLowerCase() : 'juegos'; // Default to juegos

        const matchesGenre = genre === "all" || gameGenre.includes(genre.toLowerCase());
        const matchesPlatform = platform === "all" || gamePlatform.includes(platform.toLowerCase());
        const matchesSearch = game.title.toLowerCase().includes(term);
        // Category Logic
        const matchesCategory = currentCategory === 'all' || gameCategory === currentCategory;

        return matchesGenre && matchesPlatform && matchesSearch && matchesCategory;
    });

    renderGames(filtered);
}

function setView(view) {
    if (view === 'list') {
        grid.classList.add('list-view');
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
    } else {
        grid.classList.remove('list-view');
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
    }
}

function setupEventListeners() {
    if (genreFilter) genreFilter.addEventListener("change", filterGames);
    if (platformFilter) platformFilter.addEventListener("change", filterGames);
    if (searchInput) searchInput.addEventListener("input", filterGames);

    if (viewGridBtn) viewGridBtn.addEventListener("click", () => setView('grid'));
    if (viewListBtn) viewListBtn.addEventListener("click", () => setView('list'));

    // Category Select Filter
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            filterGames();
        });
    }

    // Global Modal Events - Managed by common.js
}

document.addEventListener('DOMContentLoaded', init);
