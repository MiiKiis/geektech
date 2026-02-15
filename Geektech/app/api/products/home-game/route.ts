import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL!);
        const products = await sql`SELECT * FROM home_game`;
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
