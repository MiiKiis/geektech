import { toggleTheme } from './common.js';
import { setupGlobalSearch } from './search.js';

export function renderHeader(activePage = 'home') {
    const isHome = activePage === 'home' ? 'active' : '';
    const isStore = activePage === 'store' ? 'active' : '';
    const isKeys = activePage === 'keys' ? 'active' : '';

    const headerHTML = `
    <header role="banner">
        <div class="header-inner">
            <div class="brand-wrapper">
                <a href="#" class="logo-link" aria-label="Cambiar tema">
                    <img src="/img/principal/logo.png" alt="Geektech Logo" class="logo-img" onerror="this.style.display='none'">
                </a>
                <span class="brand-name">Geektech</span>
            </div>

            <nav class="main-nav">
                <a href="/" class="nav-link ${isHome}">Inicio</a>
                <a href="tienda.html" class="nav-link ${isStore}">Tienda</a>
                <a href="windows-keys.html" class="nav-link ${isKeys}">Windows Keys</a>
                <a href="streaming.html" class="nav-link ${activePage === 'streaming' ? 'active' : ''}">Cuentas Streaming</a>
            </nav>

            <div class="search-container">
                <input type="search" id="searchInput" class="search-input" aria-label="Buscar juegos"
                    placeholder="Buscar juegos, tarjetas de regalo y más..." />
                <!-- Results container injected on demand or exists by default for structure -->
                <div id="searchResults" class="search-results"></div>
            </div>

            <div class="nav-actions">
                <div class="cart-wrapper">
                    <div class="cart-icon" aria-label="Carrito de compras" id="cartBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span class="cart-count" id="cartCount">0</span>
                    </div>

                    <!-- Dropdown Carrito -->
                    <div class="cart-dropdown" id="cartDropdown">
                        <div class="cart-items" id="cartItems">
                            <!-- Items insertados con JS -->
                            <p class="empty-msg">Tu carrito está vacío</p>
                        </div>
                        <div class="cart-total">
                            <span>Total:</span>
                            <span id="cartTotal">Bs 0.00</span>
                        </div>
                        <button class="btn-checkout">Finalizar Compra</button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;

    // Try to find the container first, otherwise fallback to body
    const container = document.getElementById('header-container');
    if (container) {
        container.innerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // Theme Toggle on Logo
    // We need to re-query because we just inserted the HTML
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    // Initialize Global Search
    setupGlobalSearch();

    // Initialize Chat Widget
    setupChatWidget();
}

function setupChatWidget() {
    // ... (Chat widget extraction removed for brevity in this tool call, but keeping logic same)
    // For now I'll just keep the function body empty here or assume it's part of the original file if I used replace_file_content smartly.
    // BUT replace_file_content replaces the whole block. I need to be careful.
    // I will include the chat widget logic below.
    const chatHTML = `
    <div class="chat-widget">
        <div class="chat-menu" id="chatMenu">
            <a href="https://.gg/qq6qfH3CDw" target="_blank" class="chat-option ">
                <!--  Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.966 2.419-2.176 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.966 2.419-2.176 2.419z"/></svg>
                
            </a>
            <a href="https://wa.me/59168190472" target="_blank" class="chat-option whatsapp">
                <!-- WhatsApp Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
            </a>
        </div>
        <button class="chat-toggle-btn" id="chatToggle" aria-label="Abrir Chat">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chat-icon-svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const toggle = document.getElementById('chatToggle');
    const menu = document.getElementById('chatMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }
}

export function renderFooter() {
    const footerHTML = `
    <footer role="contentinfo">
        <div class="footer-links">
            <a href="#">Sobre nosotros</a>
            <a href="#">Soporte</a>
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
        </div>
        <div class="copyright">
            &copy; 2026 Geektech.onl Derechos reservados.
        </div>
    </footer>
    `;

    const container = document.getElementById('footer-container');
    if (container) {
        container.innerHTML = footerHTML;
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}
