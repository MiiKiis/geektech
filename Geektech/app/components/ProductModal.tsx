'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from './ProductCard';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

function extractPricesFromRawPrice(priceData: string | number): { label: string; value: number }[] {
    if (typeof priceData === 'number') return [];
    if (!priceData) return [];

    const priceString = String(priceData);
    if (!priceString.includes(',') && !priceString.includes(':') && !isNaN(parseFloat(priceString))) {
        return [];
    }

    const parts = priceString.split(',').map(p => p.trim()).filter(p => p !== '');
    const extracted: { label: string; value: number }[] = [];

    for (const part of parts) {
        if (part.includes(':')) {
            const [label, priceStr] = part.split(':').map(s => s.trim());
            const price = parseFloat(priceStr);
            if (!isNaN(price) && isFinite(price)) {
                extracted.push({ label, value: price });
            }
        } else {
            const price = parseFloat(part);
            if (!isNaN(price) && isFinite(price)) {
                extracted.push({ label: `${price} Bs`, value: price });
            }
        }
    }
    return extracted;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: number } | null>(null);

    const parsedOptions = extractPricesFromRawPrice(product.price);
    const options = (product.prices && product.prices.length > 0) ? product.prices : parsedOptions;
    const showOptions = options.length > 0;

    const basePrice = typeof product.price === 'number'
        ? product.price
        : (showOptions ? 0 : parseFloat(String(product.price)));

    const handleAddToCart = () => {
        let finalPrice = basePrice;
        let finalTitle = product.title;
        let finalId = String(product.id);

        if (showOptions) {
            if (!selectedOption) return;
            finalPrice = selectedOption.value;
            finalTitle = `${product.title} - ${selectedOption.label}`;
            finalId = `${product.id}-${selectedOption.label.replace(/\s+/g, '-').toLowerCase()}`;
        }

        addToCart({
            ...product,
            price: finalPrice,
            title: finalTitle,
            id: finalId
        } as any);
        onClose();
        setSelectedOption(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            <div className="relative p-6 border-b border-white/10 bg-[#1a1a1a] flex gap-4 items-start">
                                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black/20">
                                    <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{product.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                        {product.subtitle || 'Excelente elección para tu colección.'}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                >✕</button>
                            </div>

                            <div className="p-6 overflow-y-auto bg-[#121212]">
                                {showOptions ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedOption(option)}
                                                className={`relative w-full py-3 px-4 rounded-xl border transition-all duration-200 flex flex-col items-start gap-1 text-left
                                                    ${selectedOption === option
                                                        ? 'bg-purple-primary/20 border-purple-primary shadow-[0_0_15px_rgba(112,0,255,0.2)]'
                                                        : 'bg-[#1e1e24] border-white/5 hover:border-white/20 hover:bg-[#25252b]'
                                                    }`}
                                            >
                                                <span className={`font-bold text-sm ${selectedOption === option ? 'text-white' : 'text-gray-200'}`}>
                                                    {option.label}
                                                </span>
                                                <span className={`text-xs ${selectedOption === option ? 'text-purple-300' : 'text-gray-500'}`}>
                                                    Bs {option.value.toFixed(2)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-[#1e1e24] border border-white/5 rounded-xl flex justify-between items-center">
                                        <span className="text-gray-300 font-medium">Precio Estándar</span>
                                        <span className="text-xl font-bold text-purple-400">
                                            Bs {typeof basePrice === 'number' && !isNaN(basePrice) ? basePrice.toFixed(2) : 'Consultar'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] shrink-0">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={showOptions && !selectedOption}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center gap-2
                                        ${(!showOptions || selectedOption)
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 hover:scale-[1.02] hover:shadow-purple-900/60'
                                            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    {!showOptions
                                        ? `Añadir al Carrito - Bs ${typeof basePrice === 'number' && !isNaN(basePrice) ? basePrice.toFixed(2) : '?'}`
                                        : selectedOption
                                            ? `Añadir al Carrito - Bs ${selectedOption.value.toFixed(2)}`
                                            : 'Selecciona un Paquete'
                                    }
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
