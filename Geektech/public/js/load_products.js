const FALLBACK_DATA = [
    {
        id: 2999,
        title: "Creditos Server Naerzone 3.3.5a",
        subtitle: "Codigo o Regalo (equipo o profesiones)",
        price: 400,
        prices: [
            { label: "1 Crédito", value: 14 },
            { label: "5 Créditos", value: 74 },
            { label: "10 Créditos", value: 140 },
            { label: "15 Créditos", value: 210 },
            { label: "20 Créditos", value: 260 },
            { label: "32 Créditos", value: 400 },
            { label: "44 Créditos", value: 550 },
            { label: "62 Créditos", value: 640 },
            { label: "124 Créditos", value: 1250 },
            { label: "248 Créditos", value: 2450 },
        ],
        genre: "mmorpg",
        platform: "pc",
        img: "/img/game/creditos-n.webp"
    },
    {
        id: 2998,
        title: "Gif card STEAM",
        subtitle: "Sujeto a variación del dólar",
        price: 60,
        prices: [
            { label: "$5 USD", value: 60 },
            { label: "$10 USD", value: 115 },
            { label: "$25 USD", value: 285 },
            { label: "$50 USD", value: 560 },
            { label: "$100 USD", value: 1100 },
        ],
        platform: "pc",
        img: "/img/game/steam.webp"
    },
    {
        id: 2997,
        title: "Mobile Legends",
        subtitle: "Sujeto a variación del dólar",
        price: 60,
        prices: [
            { label: "100 💎", value: 11 },
            { label: "300 💎", value: 26 },
            { label: "500 💎", value: 45 },
            { label: "1000 💎", value: 90 },
        ],
        platform: "pc",
        img: "/img/game/mobile-legends.webp"
    },
    {
        id: 2008,
        title: "Tekken 8",
        subtitle: "edicion normal/avanzada",
        price: 260,
        prices: [
            { label: "Edición Normal", value: 260 },
            { label: "Edición Avanzada", value: 400 },
        ],
        genre: "shoter",
        platform: "pc",
        img: "/img/game/tekken-8.webp"
    },
    {
        id: 2007,
        title: "Paquete de vibraciones relajadas",
        subtitle: "600V-Bucks + skin",
        price: 45,
        genre: "shoter",
        platform: "pc,xbox",
        img: "/img/game/chiil-vibes.webp"
    },
    {
        id: 2006,
        title: "Paquete de exploradores rebeldes",
        subtitle: "1500V-Bucks + skin",
        price: 100,
        genre: "shoter",
        platform: "pc,xbox",
        img: "/img/game/rogue-scout.webp"
    },
    {
        id: 2005,
        title: "paquete de exilio",
        subtitle: "1000V-Bucks + skin",
        price: 60,
        genre: "shoter",
        platform: "pc,xbox",
        img: "/img/game/paquete-de-exilio.webp"
    },
    {
        id: 2004,
        title: "Pase de batalla FORNITE",
        subtitle: "Pase via Regalo",
        price: 95,
        genre: "shoter",
        platform: "pc",
        img: "/img/game/pasefort.webp"
    },
    {
        id: 2003,
        title: "HYTALE",
        price: 320,
        prices: [
            { label: "Standard", value: 140 },
            { label: "Supporter", value: 240 },
            { label: "Cursebreaker", value: 450 },
        ],
        genre: "mmorpg",
        platform: "pc",
        img: "/img/game/hytale.webp"
    },
    {
        id: 2002,
        title: "Spider man Remastered",
        price: 250,
        genre: "action",
        platform: "pc",
        img: "/img/game/SPIDERMAN.webp"
    },
    {
        id: 2001,
        title: "Arc Raiders",
        price: 280,
        genre: "Shooter",
        platform: "pc",
        img: "/img/game/Arc-raider.webp"
    },
    {
        id: 2000,
        title: "BLACK MYTH WUKONG",
        price: 600,
        genre: "ACTION",
        platform: "pc",
        img: "/img/game/wukong.webp"
    }
];

export async function loadProductsFromAPI(categoryOverride = null) {
    try {
        let url = '/api/productos';

        // Determinamos la categoría basada en la URL o el argumento
        let category = categoryOverride;
        if (!category && typeof window !== 'undefined') {
            const path = window.location.pathname;
            // Quitamos la barra inicial
            const segment = path.substring(1);

            // Mapeamos rutas a categorías de la BD
            if (segment === 'windows') category = 'windows';
            else if (segment === 'streaming') category = 'streaming';
            else if (segment === 'juegos' || segment === 'tienda.html') category = 'juegos';
            else if (segment === 'software' || segment === 'windows-keys.html') category = 'software';
            // Home ('') carga todo
        }

        if (category) {
            url += `?categoria=${category}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`API returned ${response.status}, using fallback data.`);
            return filterFallbackData(category);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.warn("API returned empty data, using fallback data.");
            return filterFallbackData(category);
        }

        // Mapeo de campos de BD (Español/Postgres) -> Frontend (Inglés/Legacy JS)
        const mappedProducts = data.map(dbProduct => ({
            id: dbProduct.id,
            title: dbProduct.nombre,      // Mapeo
            subtitle: dbProduct.descripcion, // Mapeo
            price: Number(dbProduct.precio_base), // Asegurar que sea número
            img: dbProduct.imagen,        // Mapeo
            prices: dbProduct.opciones,   // Mapeo directo del JSONB

            // Campos adicionales
            genre: dbProduct.categoria || "software",
            platform: "pc"
        }));

        console.log(`Productos cargados (${category || 'todos'}):`, mappedProducts);
        return mappedProducts;

    } catch (error) {
        console.error("Fallo al cargar productos (usando fallback):", error);
        return filterFallbackData(categoryOverride);
    }
}

function filterFallbackData(category) {
    if (!category && typeof window !== 'undefined') {
        const path = window.location.pathname;
        const segment = path.substring(1);
        if (segment === 'windows') category = 'windows';
        else if (segment === 'streaming') category = 'streaming';
        else if (segment === 'juegos') category = 'juegos';
        else if (segment === 'software') category = 'software';
    }

    if (!category) return FALLBACK_DATA;

    // Map categories to genres/logic in FALLBACK_DATA
    return FALLBACK_DATA.filter(item => {
        const itemGenre = item.genre ? item.genre.toLowerCase() : '';
        const itemTitle = item.title.toLowerCase();

        if (category === 'windows' || category === 'software') {
            return itemGenre.includes('software') || itemTitle.includes('windows') || itemTitle.includes('office') || itemTitle.includes('antivirus');
        }
        if (category === 'streaming') {
            return itemTitle.includes('netflix') || itemTitle.includes('spotify') || itemTitle.includes('youtube') || itemTitle.includes('disney') || itemTitle.includes('star+');
        }
        if (category === 'juegos') {
            return itemGenre !== 'software' && !itemTitle.includes('netflix') && !itemTitle.includes('spotify');
        }
        return true;
    });
}
