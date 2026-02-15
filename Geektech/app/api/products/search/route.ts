import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined');
        }

        const sql = neon(process.env.DATABASE_URL);
        const searchTerm = `%${query}%`;

        // Search across all 4 tables in parallel
        const [homeGame, tienda, windowsKeys, streaming] = await Promise.all([
            sql`SELECT id, nombre, imagen_url, categoria, variantes_precio FROM home_game WHERE LOWER(nombre) LIKE LOWER(${searchTerm}) OR LOWER(categoria) LIKE LOWER(${searchTerm}) LIMIT 5`,
            sql`SELECT id, nombre, imagen_url, categoria FROM tienda WHERE LOWER(nombre) LIKE LOWER(${searchTerm}) OR LOWER(categoria) LIKE LOWER(${searchTerm}) LIMIT 5`,
            sql`SELECT id, nombre, imagen_url, tipo, precio FROM windows_keys WHERE LOWER(nombre) LIKE LOWER(${searchTerm}) OR LOWER(tipo) LIKE LOWER(${searchTerm}) LIMIT 5`,
            sql`SELECT id, nombre, imagen_url, plataforma, duracion, precio FROM cuentas_streaming WHERE LOWER(nombre) LIKE LOWER(${searchTerm}) OR LOWER(plataforma) LIKE LOWER(${searchTerm}) LIMIT 5`,
        ]);

        const results = [
            ...homeGame.map((p: any) => ({
                id: p.id,
                nombre: p.nombre,
                imagen_url: p.imagen_url,
                category: 'Juegos',
                subcategory: p.categoria,
                link: '/',
                price: null,
            })),
            ...tienda.map((p: any) => ({
                id: `t-${p.id}`,
                nombre: p.nombre,
                imagen_url: p.imagen_url,
                category: 'Tienda',
                subcategory: p.categoria,
                link: '/tienda',
                price: null,
            })),
            ...windowsKeys.map((p: any) => ({
                id: `w-${p.id}`,
                nombre: p.nombre,
                imagen_url: p.imagen_url,
                category: 'Software & Licencias',
                subcategory: p.tipo,
                link: '/windows-keys',
                price: p.precio ? parseFloat(p.precio) : null,
            })),
            ...streaming.map((p: any) => ({
                id: `s-${p.id}`,
                nombre: p.nombre,
                imagen_url: p.imagen_url,
                category: 'Streaming',
                subcategory: `${p.plataforma} - ${p.duracion}`,
                link: '/cuentas-streaming',
                price: p.precio ? parseFloat(p.precio) : null,
            })),
        ];

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
