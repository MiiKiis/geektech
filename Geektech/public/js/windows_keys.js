import { renderHeader, renderFooter } from './layout.js';
import { keysData } from './data_keys.js';
import { setupCommonUI, addToCart, formatPrice, openWhatsAppProduct, preloadImages, checkHighlight } from './common.js';

// Grid elements are now handled in renderGames via 'grids' object
const searchInput = document.getElementById("searchInput");
const viewGridBtn = document.getElementById("viewGrid");
const viewListBtn = document.getElementById("viewList");

function init() {
    renderHeader('keys');
    renderFooter();
    setupCommonUI();
    preloadImages(keysData.map(k => k.img));
    // Immediate render
    renderGames(keysData);
    setupEventListeners();
    checkHighlight();
}

function renderSkeleton() {
    grid.innerHTML = "";
}

// DOM Elements for Filters
const categoryFilter = document.getElementById("category");

const grids = {
    win10: document.getElementById("gridWin10"),
    win11: document.getElementById("gridWin11"),
    office: document.getElementById("gridOffice"),
    other: document.getElementById("gridOther")
};

function renderGames(data) {
    // Clear all grids
    Object.values(grids).forEach(g => { if (g) g.innerHTML = ""; });

    if (data.length === 0) {
        // Handle empty state if needed, or check per section
        return;
    }

    data.forEach((item, index) => {
        const card = createCard(item, index);

        const title = item.title.toLowerCase();
        let targetGrid = grids.other;

        if (title.includes("windows 10")) targetGrid = grids.win10;
        else if (title.includes("windows 11")) targetGrid = grids.win11;
        else if (title.includes("office")) targetGrid = grids.office;

        if (targetGrid) targetGrid.appendChild(card);
    });
}

function createCard(item, index) {
    const card = document.createElement("article");
    card.className = "game-card";
    // Data attributes
    card.dataset.id = item.id;
    card.dataset.genre = item.genre || 'all';
    card.dataset.platform = item.platform || 'all';

    const formattedPrice = formatPrice(item.price);
    const loadingAttr = index < 3 ? 'eager' : 'lazy';

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${item.img}" alt="${item.title}" class="card-image" loading="${loadingAttr}" onerror="this.style.display='none'">
      </div>
      <div class="card-content">
        <div class="game-info-left">
            <h3 class="game-title" title="${item.title}">${item.title}</h3>
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

    card.querySelector(".btn-cart-icon").addEventListener("click", () => addToCart(item));
    card.querySelector(".btn-buy").addEventListener("click", () => openWhatsAppProduct(item));

    return card;
}

function filterItems() {
    const category = categoryFilter ? categoryFilter.value : 'all';
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = keysData.filter(i => {
        const title = i.title.toLowerCase();
        const matchesSearch = title.includes(term);

        // Determine item category based on title
        let itemCategory = 'other';
        if (title.includes('windows 10')) itemCategory = 'win10';
        else if (title.includes('windows 11')) itemCategory = 'win11';
        else if (title.includes('office')) itemCategory = 'office';

        const matchesCategory = category === 'all' || itemCategory === category;

        return matchesSearch && matchesCategory;
    });
    renderGames(filtered);

    // Show/hide category sections based on filter
    toggleCategorySections(category);
}

function toggleCategorySections(category) {
    const sections = {
        win10: document.getElementById('gridWin10')?.closest('.category-section'),
        win11: document.getElementById('gridWin11')?.closest('.category-section'),
        office: document.getElementById('gridOffice')?.closest('.category-section'),
        other: document.getElementById('gridOther')?.closest('.category-section')
    };

    Object.entries(sections).forEach(([key, section]) => {
        if (section) {
            if (category === 'all' || key === category) {
                section.style.display = '';
            } else {
                section.style.display = 'none';
            }
        }
    });
}

function setView(view) {
    const allGrids = Object.values(grids).filter(g => g !== null);

    if (view === 'list') {
        allGrids.forEach(g => g.classList.add('list-view'));
        if (viewListBtn) viewListBtn.classList.add('active');
        if (viewGridBtn) viewGridBtn.classList.remove('active');
    } else {
        allGrids.forEach(g => g.classList.remove('list-view'));
        if (viewGridBtn) viewGridBtn.classList.add('active');
        if (viewListBtn) viewListBtn.classList.remove('active');
    }
}

function setupEventListeners() {
    if (searchInput) searchInput.addEventListener("input", filterItems);
    // Category filter listener
    if (categoryFilter) categoryFilter.addEventListener("change", filterItems);

    if (viewGridBtn) viewGridBtn.addEventListener("click", () => setView('grid'));
    if (viewListBtn) viewListBtn.addEventListener("click", () => setView('list'));
}

document.addEventListener('DOMContentLoaded', init);
