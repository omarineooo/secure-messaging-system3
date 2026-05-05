import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching this route

export async function GET() {
    try {
        const users = db.prepare(`
            SELECT id, username, 
            substr(public_key, 1, 20) || '...' as public_key_preview 
            FROM users
        `).all();

        const messages = db.prepare('SELECT * FROM messages').all();

        return NextResponse.json({
            success: true,
            total_users: users.length,
            total_messages: messages.length,
            users: users,
            messages: messages
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
