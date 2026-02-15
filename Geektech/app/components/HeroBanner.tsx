'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroBanner() {
    const [bannerData, setBannerData] = useState<any>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch('/api/products/home');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.imagen_url) {
                        setBannerData(data);
                    }
                }
            } catch {
                // Silent fail — banner will use defaults
            }
        };
        fetchBanner();
    }, []);

    const title = bannerData?.titulo || (
        <>Productos Digitales <br /><span className="text-gradient">Sin Límites</span></>
    );

    return (
        <section className="antigravity-hero" role="banner" aria-label="Destacado">
            <div className="hero-bg-effects">
                <div className="glow-orb orb-1" />
                <div className="glow-orb orb-2" />
            </div>

            <img
                src="/img/principal/banner.svg"
                className="hero-bg-image"
                alt="Banner Geektech"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />

            <div className="hero-content">
                <h1>{title}</h1>
                <p>Eleva tu experiencia gamer con nuestra selección premium de software y complementos.</p>
                <div className="hero-actions">
                    <Link href="/tienda" className="btn-hero primary-glow">Ver Productos</Link>
                </div>
            </div>

            <div className="hero-visuals">
                <div className="floating-card glass-card">
                    <div className="icon-box">🚀</div>
                    <span>Rapido</span>
                </div>
                <div className="floating-card glass-card delayed">
                    <div className="icon-box">⚡</div>
                    <span>Entrega Inmediata</span>
                </div>
            </div>
        </section>
    );
}
