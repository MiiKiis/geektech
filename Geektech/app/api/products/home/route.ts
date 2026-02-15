import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined');
        }
        const sql = neon(process.env.DATABASE_URL);
        const data = await sql`SELECT * FROM home LIMIT 1`; // Get the first banner
        return NextResponse.json(data[0] || {});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
