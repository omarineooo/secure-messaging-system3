import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const users = db.prepare('SELECT id, username FROM users').all();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
    }
}
