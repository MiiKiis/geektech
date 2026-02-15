import { renderHeader, renderFooter } from './layout.js';
// import { gamesPageData } from './data_games.js'; 
import { loadProductsFromAPI } from './load_products.js';
import { setupCommonUI, addToCart, formatPrice, openWhatsAppProduct, preloadImages, checkHighlight } from './common.js';

const grid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const viewGridBtn = document.getElementById("viewGrid");
const viewListBtn = document.getElementById("viewList");

let pageData = [];

async function init() {
    // renderHeader('home'); // Handled by Next.js Layout
    // renderFooter();       // Handled by Next.js Layout
    setupCommonUI();

    // Load products from API
    try {
        pageData = await loadProductsFromAPI();
    } catch (e) {
        console.error("Error loading products:", e);
        pageData = [];
    }

    if (pageData.length > 0) {
        const topImages = pageData.slice(0, 4).map(g => g.img);
        preloadImages(topImages);
    }

    // Immediate render
    renderGames(pageData);
    setupEventListeners();
    checkHighlight();
}

function renderSkeleton() {
    grid.innerHTML = "";
}

const genreFilter = document.getElementById("genre");
const platformFilter = document.getElementById("platform");

function renderGames(data) {
    grid.innerHTML = "";
    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">No hay resultados.</div>`;
        return;
    }

    data.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "game-card";
        // Data attributes
        card.dataset.id = item.id;
        card.dataset.genre = item.genre || 'all';
        card.dataset.platform = item.platform || 'all';

        const loadingAttr = index < 3 ? 'eager' : 'lazy';

        // Multi-price/Variant Logic removal in favor of Global Modal
        let formattedPrice = formatPrice(item.price);

        card.innerHTML = `
          <div class="card-image-wrapper">
            <img src="${item.img}" alt="${item.title}" class="card-image" loading="${loadingAttr}" onerror="this.style.display='none'">
          </div>
          <div class="card-content">
            <div class="game-info-left">
                <h3 class="game-title" title="${item.title}">${item.title}</h3>
                ${item.subtitle ? `<p class="game-subtitle">${item.subtitle}</p>` : ''}
                <span class="badge-options">Opciones Disponibles</span>
            </div>
            
            <div class="card-footer">
              <!-- Price removed for visual catalog -->
              <div style="width: 100%;">
                  <button class="btn-view-options" aria-label="Seleccionar producto">
                    Seleccionar
                  </button>
              </div>
            </div>
          </div>
        `;

        // Dynamic Price Update Logic Removed
        // Global Modal handles variants now


        // Cart button removed from index view


        // Card Click -> Global Modal
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) {
                // If button is clicked, logic is handled below
                return;
            }
            if (window.openGlobalProduct) {
                window.openGlobalProduct(item);
            }
        });

        // "Seleccionar" button -> Add to Cart
        const selectBtn = card.querySelector(".btn-view-options");
        selectBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            // Directly add to cart or open modal depending on preference.
            // For this request, we bridge to the new Cart.
            addToCart(item);
        });

        grid.appendChild(card);
    });
}

function filterItems() {
    const genre = genreFilter ? genreFilter.value : 'all';
    const platform = platformFilter ? platformFilter.value : 'all';
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = pageData.filter(i => {
        const matchesSearch = i.title.toLowerCase().includes(term);

        const itemGenre = i.genre ? i.genre.toLowerCase() : '';
        const itemPlatform = i.platform ? i.platform.toLowerCase() : '';

        const matchesGenre = genre === "all" || itemGenre.includes(genre.toLowerCase());
        const matchesPlatform = platform === "all" || itemPlatform.includes(platform.toLowerCase());

        return matchesSearch && matchesGenre && matchesPlatform;
    });
    renderGames(filtered);
}

function setView(view) {
    if (view === 'list') {
        grid.classList.add('list-view');
        if (viewListBtn) viewListBtn.classList.add('active');
        if (viewGridBtn) viewGridBtn.classList.remove('active');
    } else {
        grid.classList.remove('list-view');
        if (viewGridBtn) viewGridBtn.classList.add('active');
        if (viewListBtn) viewListBtn.classList.remove('active');
    }
}

function setupEventListeners() {
    if (searchInput) searchInput.addEventListener("input", filterItems);
    // Add missing listeners for filters
    if (genreFilter) genreFilter.addEventListener("change", filterItems);
    if (platformFilter) platformFilter.addEventListener("change", filterItems);

    if (viewGridBtn) viewGridBtn.addEventListener("click", () => setView('grid'));
    if (viewListBtn) viewListBtn.addEventListener("click", () => setView('list'));
}

// Ensure init runs even if loaded after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
