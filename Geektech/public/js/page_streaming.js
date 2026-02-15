import { renderHeader, renderFooter } from './layout.js';
import { streamingData } from './data_streaming.js';
import { setupCommonUI, formatPrice, preloadImages, checkHighlight } from './common.js';

const grid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const viewGridBtn = document.getElementById("viewGrid");
const viewListBtn = document.getElementById("viewList");

function init() {
    renderHeader('streaming'); // Active page identifier
    renderFooter();
    setupCommonUI();

    // Preload images
    const images = streamingData.map(item => item.img);
    preloadImages(images);

    renderItems(streamingData);
    setupEventListeners();
    checkHighlight();
}

function renderItems(data) {
    grid.innerHTML = "";
    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">No hay resultados.</div>`;
        return;
    }

    data.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "game-card";
        card.dataset.id = item.id;
        card.dataset.platform = item.platform;

        const loadingAttr = index < 3 ? 'eager' : 'lazy';

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
              <div style="width: 100%;">
                  <button class="btn-view-options" aria-label="Seleccionar producto">
                    Seleccionar
                  </button>
              </div>
            </div>
          </div>
        `;

        // Card Click -> Global Modal
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            if (window.openGlobalProduct) {
                window.openGlobalProduct(item);
            }
        });

        // Button Click -> Global Modal
        const btn = card.querySelector(".btn-view-options");
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (window.openGlobalProduct) {
                window.openGlobalProduct(item);
            }
        });

        grid.appendChild(card);
    });
}

function filterItems() {
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = streamingData.filter(i => {
        return i.title.toLowerCase().includes(term);
    });
    renderItems(filtered);
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
    if (viewGridBtn) viewGridBtn.addEventListener("click", () => setView('grid'));
    if (viewListBtn) viewListBtn.addEventListener("click", () => setView('list'));
}

document.addEventListener('DOMContentLoaded', init);
