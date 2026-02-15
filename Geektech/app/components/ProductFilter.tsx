'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
    id: string | number;
    nombre: string;
    imagen_url: string;
    category: string;
    subcategory: string;
    link: string;
    price: number | null;
}

interface ProductFilterProps {
    title: string;
    accentColor?: string;
    // Filter dropdown
    filterLabel?: string;
    filterOptions?: string[];
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    // Search (local filtering)
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    // View mode
    viewMode?: 'grid' | 'list';
    onViewModeChange?: (mode: 'grid' | 'list') => void;
    // Count
    totalCount?: number;
    filteredCount?: number;
}

const accentMap: Record<string, { border: string; focus: string; bg: string; text: string }> = {
    purple: {
        border: 'border-purple-500',
        focus: 'focus:border-purple-500 focus:ring-purple-500/20',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
    },
    blue: {
        border: 'border-blue-500',
        focus: 'focus:border-blue-500 focus:ring-blue-500/20',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
    },
    green: {
        border: 'border-green-500',
        focus: 'focus:border-green-500 focus:ring-green-500/20',
        bg: 'bg-green-500/10',
        text: 'text-green-400',
    },
    cyan: {
        border: 'border-cyan-500',
        focus: 'focus:border-cyan-500 focus:ring-cyan-500/20',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
    },
};

const categoryColors: Record<string, string> = {
    'Juegos': '#a855f7',
    'Tienda': '#8b5cf6',
    'Software & Licencias': '#3b82f6',
    'Streaming': '#22c55e',
};

const categoryIcons: Record<string, string> = {
    'Juegos': '🎮',
    'Tienda': '🛒',
    'Software & Licencias': '💻',
    'Streaming': '📺',
};

const ProductFilter: React.FC<ProductFilterProps> = ({
    title,
    accentColor = 'purple',
    filterLabel = 'Categoría',
    filterOptions = [],
    filterValue = 'all',
    onFilterChange,
    searchQuery = '',
    onSearchChange,
    viewMode = 'grid',
    onViewModeChange,
    totalCount,
    filteredCount,
}) => {
    const router = useRouter();
    const accent = accentMap[accentColor] || accentMap.purple;
    const showCount = totalCount !== undefined && filteredCount !== undefined;

    // Global search state
    const [globalQuery, setGlobalQuery] = useState('');
    const [globalResults, setGlobalResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Debounced global search
    const doGlobalSearch = useCallback(async (term: string) => {
        if (term.trim().length < 2) {
            setGlobalResults([]);
            setShowDropdown(false);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            setGlobalResults(data);
            setShowDropdown(true);
        } catch {
            setGlobalResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setGlobalQuery(val);
        // Also filter locally
        onSearchChange?.(val);
        // Debounce global search
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doGlobalSearch(val), 350);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') setShowDropdown(false);
    };

    const handleResultClick = (result: SearchResult) => {
        setShowDropdown(false);
        setGlobalQuery('');
        onSearchChange?.('');
        router.push(`${result.link}?search=${encodeURIComponent(result.nombre)}`);
    };

    const clearSearch = () => {
        setGlobalQuery('');
        setGlobalResults([]);
        setShowDropdown(false);
        onSearchChange?.('');
    };

    // Group results by category
    const grouped = globalResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
        if (!acc[r.category]) acc[r.category] = [];
        acc[r.category].push(r);
        return acc;
    }, {});

    return (
        <div className="mb-8 border-b border-white/5 pb-6">
            {/* Row 1: Title + Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h1 className={`text-3xl font-bold text-white border-l-4 ${accent.border} pl-4`}>
                        {title}
                    </h1>
                    {showCount && (
                        <motion.span
                            key={filteredCount}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${accent.bg} ${accent.text} border border-white/5`}
                        >
                            {filteredCount === totalCount
                                ? `${totalCount} productos`
                                : `${filteredCount} de ${totalCount}`}
                        </motion.span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    {/* Global Search Bar */}
                    <div className="relative" ref={searchContainerRef}>
                        <div className="relative">
                            <svg
                                suppressHydrationWarning
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar en todas las categorías..."
                                value={globalQuery}
                                onChange={handleSearchInput}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => { if (globalResults.length > 0) setShowDropdown(true); }}
                                className={`w-full min-w-[260px] bg-[#1e1e24] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${accent.focus} transition-all hover:border-white/20`}
                                autoComplete="off"
                            />
                            {globalQuery.length > 0 && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Global Search Dropdown */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        left: 0,
                                        right: 0,
                                        minWidth: '360px',
                                        maxHeight: '440px',
                                        overflowY: 'auto',
                                        background: '#1a1a22',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(112,0,255,0.1)',
                                        zIndex: 9999,
                                    }}
                                >
                                    {isSearching ? (
                                        <div style={{ padding: '24px', textAlign: 'center' }}>
                                            <div style={{
                                                width: '28px', height: '28px',
                                                border: '3px solid rgba(168,85,247,0.3)',
                                                borderTop: '3px solid #a855f7',
                                                borderRadius: '50%',
                                                animation: 'spin 0.8s linear infinite',
                                                margin: '0 auto 8px',
                                            }} />
                                            <span style={{ color: '#9ca3af', fontSize: '13px' }}>Buscando en todas las categorías...</span>
                                        </div>
                                    ) : globalResults.length === 0 ? (
                                        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                                            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                                                No se encontraron resultados para &quot;{globalQuery}&quot;
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '8px 0' }}>
                                            {Object.entries(grouped).map(([category, items]) => (
                                                <div key={category}>
                                                    <div style={{
                                                        padding: '10px 16px 6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                    }}>
                                                        <span style={{ fontSize: '14px' }}>{categoryIcons[category] || '📦'}</span>
                                                        <span style={{
                                                            fontSize: '11px',
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.08em',
                                                            color: categoryColors[category] || '#9ca3af',
                                                        }}>
                                                            {category}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '10px',
                                                            color: '#4b5563',
                                                            background: 'rgba(255,255,255,0.05)',
                                                            padding: '2px 8px',
                                                            borderRadius: '10px',
                                                        }}>
                                                            {items.length}
                                                        </span>
                                                    </div>

                                                    {items.map((item) => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => handleResultClick(item)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px',
                                                                width: '100%',
                                                                padding: '10px 16px',
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                textAlign: 'left',
                                                                transition: 'background 0.15s',
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <div style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '10px',
                                                                overflow: 'hidden',
                                                                flexShrink: 0,
                                                                border: '1px solid rgba(255,255,255,0.08)',
                                                                background: '#0f0f12',
                                                            }}>
                                                                <img
                                                                    src={item.imagen_url || '/img/placeholder.jpg'}
                                                                    alt={item.nombre}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    onError={(e) => { e.currentTarget.src = '/img/placeholder.jpg'; }}
                                                                />
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{
                                                                    color: '#fff',
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}>
                                                                    {item.nombre}
                                                                </div>
                                                                <div style={{
                                                                    color: '#6b7280',
                                                                    fontSize: '12px',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}>
                                                                    {item.subcategory}
                                                                </div>
                                                            </div>
                                                            {item.price !== null && item.price > 0 && (
                                                                <span style={{
                                                                    color: '#a855f7',
                                                                    fontSize: '14px',
                                                                    fontWeight: 700,
                                                                    flexShrink: 0,
                                                                }}>
                                                                    Bs {item.price.toFixed(2)}
                                                                </span>
                                                            )}
                                                            <svg style={{ flexShrink: 0, color: '#4b5563' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Category filter dropdown */}
                    {filterOptions.length > 0 && (
                        <div className="relative">
                            <select
                                className={`bg-[#1e1e24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none ${accent.focus} transition-colors appearance-none cursor-pointer pr-10 hover:border-white/20`}
                                value={filterValue}
                                onChange={(e) => onFilterChange?.(e.target.value)}
                            >
                                <option value="all">Todos — {filterLabel}</option>
                                {filterOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* View mode toggle */}
                    <div className="flex bg-[#1e1e24] p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => onViewModeChange?.('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            aria-label="Vista Cuadrícula"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onViewModeChange?.('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            aria-label="Vista Lista"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Active filters row */}
            <AnimatePresence>
                {(globalQuery.length > 0 || filterValue !== 'all') && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Filtros activos:</span>
                            {globalQuery.length > 0 && (
                                <button
                                    onClick={clearSearch}
                                    className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 transition-colors"
                                >
                                    <span>🔍 &quot;{globalQuery}&quot;</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            {filterValue !== 'all' && (
                                <button
                                    onClick={() => onFilterChange?.('all')}
                                    className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 transition-colors"
                                >
                                    <span>📂 {filterValue}</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    clearSearch();
                                    onFilterChange?.('all');
                                }}
                                className={`ml-auto text-xs ${accent.text} hover:underline`}
                            >
                                Limpiar todo
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductFilter;
