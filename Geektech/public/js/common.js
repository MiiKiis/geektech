/* ================= COMMON LOGIC ================= */
// Shared between all pages

// Configuration
export const CONFIG = {
    WHATSAPP_PHONE: '59168190472',
    CURRENCY_SYMBOL: 'Bs',
    CURRENCY_CODE: 'BOB' // Using BOB for Boliviano standard, though display is Bs
};

// Global State
// Theme Logic
export function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize Theme
(function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
})();

export const cart = JSON.parse(localStorage.getItem('eneba_cart')) || [];

if (!Array.isArray(cart)) cart = [];

// --- Cart Actions ---

// --- Cart Actions (Bridge to React) ---

export function addToCart(product) {
    // Dispatch event for React CartContext
    window.dispatchEvent(new CustomEvent('addToCart', { detail: product }));

    // Optional: Visual feedback if needed, but React sidebar should open
    // console.log("Bridged to React:", product);
}

export function removeFromCart(index) {
    // Legacy support removal - React handles this
}

export function saveCart() {
    // React handles persistence
}

export function getCartTotal() {
    return 0; // React handles this
}

export function clearCart() {
    // React handles this
}

// --- WhatsApp Logic ---
// ... (Keep existing helpers if used elsewhere) ...

export function openWhatsAppCheckout(items) {
    // ... existing logic ...
    if (!items || items.length === 0) return;
    let total = 0;
    let message = "Hola, quisiera finalizar la siguiente compra:\n\n";
    items.forEach(item => {
        message += `• ${item.title} - ${formatPrice(item.price)}\n`;
        total += item.price;
    });
    message += `\nTotal a Pagar: ${formatPrice(total)}`;
    openWhatsApp(message);
}

export function openWhatsAppProduct(product) {
    const message = `Hola, quiero adquirir el producto: ${product.title} - Precio: ${formatPrice(product.price)}`;
    openWhatsApp(message);
}

function openWhatsApp(text) {
    const url = `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// --- UI Helpers ---

export function formatPrice(amount) {
    return `${CONFIG.CURRENCY_SYMBOL} ${amount.toFixed(2)}`;
}

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = type === 'success' ?
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}` :
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Shared UI Components ---

export function setupCommonUI() {
    // Only Initialize Global Product Modal
    initGlobalProductModal();
}

function updateCartIcon() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;

    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length === 0 ? 'none' : 'flex';
}

function renderCartDropdown() {
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    if (!container || !totalEl) return;

    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-msg">Tu carrito está vacío</p>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
            <img src="${item.img}" alt="${item.title}" onerror="this.style.display='none'">
            <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-price">${formatPrice(item.price)}</div>
            </div>
            <button class="remove-btn" aria-label="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ff4a4a;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          `;

            div.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromCart(index);
            });

            container.appendChild(div);
        });
    }

    totalEl.textContent = formatPrice(total);
}

// --- Preload Helpers ---
export function preloadImages(imageUrls) {
    if (!imageUrls || imageUrls.length === 0) return;
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// --- Highlight Search Result ---
export function checkHighlight() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        // Wait for DOM to stabilize/render (since setupEventListeners calls init which calls render)
        // We might need a MutationObserver or just a small timeout if render is async-ish or immediate.
        // Since render is immediate in current code, a small timeout ensures execution stack clears.
        setTimeout(() => {
            const card = document.querySelector(`.game-card[data-id="${id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight-card');

                // Remove class after animation to clean up
                setTimeout(() => {
                    card.classList.remove('highlight-card');
                    // Optional: remove query param from URL without refresh
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }, 2000);
            }
        }, 100);
    }
}

// --- Global Product Modal System ---

export function initGlobalProductModal() {
    // 1. Inject HTML if not present
    if (!document.getElementById('global-product-modal')) {
        const modalHTML = `
    <!-- Global Product View Modal (Immersive Layer) -->
    <div id="global-product-modal" class="global-modal hidden" aria-hidden="true">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <button id="modal-close" class="modal-close-btn" aria-label="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div class="modal-grid">
                <!-- Left: Product Identity -->
                <div class="modal-product-identity">
                    <img id="modal-img" src="" alt="Producto" class="modal-img">
                    <div class="modal-header">
                        <span class="modal-badge" id="modal-badge">PREMIUM</span>
                        <h2 id="modal-title">Título del Producto</h2>
                        <p class="modal-subtitle">Selecciona un paquete para continuar</p>
                    </div>
                </div>

                <!-- Right: Package Selection -->
                <div class="modal-packages-section">
                    <div id="package-grid" class="package-grid">
                        <!-- JS Generated Packages -->
                    </div>

                    <div class="checkout-zone">
                        <div class="checkout-total">
                            <span>Total a Pagar:</span>
                            <span id="modal-total-price">Bs 0.00</span>
                        </div>
                        <button id="modal-buy-btn" class="modal-buy-btn pulse-animation" disabled>
                            Selecciona un Paquete
                        </button>
                        <button id="modal-add-cart-btn" class="modal-secondary-btn" disabled style="margin-top: 10px; width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                            Añadir al Carrito
                        </button>
                        <p class="checkout-note">Entrega inmediata vía WhatsApp</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 2. Setup Elements & Events
    const globalModal = document.getElementById('global-product-modal');
    const modalBackdrop = globalModal.querySelector('.modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalBuyBtn = document.getElementById('modal-buy-btn');
    const modalAddCartBtn = document.getElementById('modal-add-cart-btn');

    // Close Events
    const closeModal = () => {
        globalModal.classList.remove('active');
        setTimeout(() => {
            globalModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400);
        window.currentGlobalProduct = null;
        window.currentSelectedPackage = null;
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && globalModal.classList.contains('active')) closeModal();
    });

    // Buy Event
    modalBuyBtn.addEventListener('click', () => {
        const product = window.currentGlobalProduct;
        const pkg = window.currentSelectedPackage;
        if (!product || !pkg) return;

        const message = `Hola, quiero comprar: ${product.title}\nOpción: ${pkg.label}\nPrecio: ${formatPrice(pkg.price)}`;
        const url = `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    // Add to Cart Event
    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
            const product = window.currentGlobalProduct;
            const pkg = window.currentSelectedPackage;
            if (!product || !pkg) return;

            // Create a cart item with specific package details
            const cartItem = {
                ...product,
                id: `${product.id}-${pkg.id}`, // Unique ID for variant
                title: `${product.title} (${pkg.label})`,
                price: pkg.price,
                img: product.img
            };

            addToCart(cartItem);
            closeModal();
        });
    }

    // 3. Expose Open Function - OPTIMIZED FOR PRODUCTION
    window.openGlobalProduct = function (product) {
        // === STEP 1: COMPLETE STATE CLEANUP ===
        // Reset global state immediately to prevent visual artifacts
        window.currentGlobalProduct = null;
        window.currentSelectedPackage = null;

        // Get DOM references
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalBadge = document.getElementById('modal-badge');
        const packageGrid = document.getElementById('package-grid');
        const modalTotalPrice = document.getElementById('modal-total-price');
        const modalAddCartBtn = document.getElementById('modal-add-cart-btn');

        // Clear all previous content BEFORE populating new data
        modalImg.src = '';
        modalImg.alt = 'Cargando...';
        modalTitle.textContent = '';
        modalBadge.textContent = '';
        packageGrid.innerHTML = '';
        modalTotalPrice.textContent = '---';

        modalBuyBtn.disabled = true;
        modalBuyBtn.textContent = 'Selecciona un Paquete';

        if (modalAddCartBtn) {
            modalAddCartBtn.disabled = true;
            modalAddCartBtn.style.opacity = '0.5';
            modalAddCartBtn.style.cursor = 'not-allowed';
        }

        // Remove any lingering selected states
        document.querySelectorAll('.package-card.selected').forEach(card => {
            card.classList.remove('selected');
        });

        // === STEP 2: SET NEW PRODUCT DATA ===
        window.currentGlobalProduct = product;

        // Populate Identity with optimized image handling
        modalImg.src = product.img;
        modalImg.alt = product.title;
        modalImg.style.maxWidth = '100%';
        modalImg.style.maxHeight = '400px';
        modalImg.style.objectFit = 'cover';
        modalImg.style.borderRadius = 'var(--border-radius-md)';

        modalTitle.textContent = product.title;
        modalBadge.textContent = product.badge || 'PREMIUM';

        // === STEP 3: GENERATE PACKAGES ===
        let packages = [];
        if (product.prices && product.prices.length > 0) {
            // Convert prices array to package format
            packages = product.prices.map((priceItem, index) => ({
                id: `price-${index}`,
                label: priceItem.label,
                amount: priceItem.label,
                price: priceItem.value,
                discount: ''
            }));
        } else {
            // Single price product - create one package option
            packages = [{
                id: 'single',
                label: product.subtitle || 'Licencia Digital',
                amount: product.title,
                price: product.price,
                discount: ''
            }];
        }

        // === STEP 4: RENDER PACKAGES WITH ENHANCED SELECTION LOGIC ===
        packages.forEach((pkg, index) => {
            const card = document.createElement('div');
            card.className = 'package-card';
            card.setAttribute('data-package-id', pkg.id);
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Seleccionar ${pkg.label} por ${formatPrice(pkg.price)}`);

            // Enhanced click handler with proper state management
            const selectPackage = () => {
                // Update global state
                window.currentSelectedPackage = pkg;

                // Visual Update - Remove all selected states first
                document.querySelectorAll('.package-card').forEach(c => {
                    c.classList.remove('selected');
                    c.setAttribute('aria-selected', 'false');
                });

                // Add selected state to clicked card
                card.classList.add('selected');
                card.setAttribute('aria-selected', 'true');

                // Update price display
                modalTotalPrice.textContent = formatPrice(pkg.price);

                // Enable buy button
                modalBuyBtn.disabled = false;
                modalBuyBtn.textContent = 'Comprar Ahora';
                modalBuyBtn.classList.add('pulse-animation');

                // Enable Cart Button
                if (modalAddCartBtn) {
                    modalAddCartBtn.disabled = false;
                    modalAddCartBtn.style.opacity = '1';
                    modalAddCartBtn.style.cursor = 'pointer';
                }
            };

            card.onclick = selectPackage;
            card.onkeypress = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectPackage();
                }
            };

            card.innerHTML = `
                <span class="package-amount">${pkg.amount}</span>
                <span class="package-price">${formatPrice(pkg.price)}</span>
                ${pkg.discount ? `<span class="package-discount">${pkg.discount}</span>` : ''}
            `;
            packageGrid.appendChild(card);
        });

        // === STEP 5: SHOW MODAL WITH SMOOTH TRANSITION ===
        globalModal.classList.remove('hidden');
        void globalModal.offsetWidth; // Force Reflow for smooth animation
        globalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
}

function generateMockPackages(basePrice) {
    return [
        { id: 'p1', label: 'Licencia Básica', amount: '1 Dispositivo', price: basePrice, discount: '' },
        { id: 'p2', label: 'Licencia Pro', amount: '3 Dispositivos', price: Math.round(basePrice * 2.5), discount: 'Ahorra 15%' },
        { id: 'p3', label: 'Licencia Ultimate', amount: 'ILIMITADO', price: Math.round(basePrice * 4), discount: 'Mejor Valor' }
    ];
}

