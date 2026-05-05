import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
    }

    try {
        // Fetch messages where user is sender OR receiver
        const messages = db.prepare(`
            SELECT * FROM messages 
            WHERE sender_username = ? OR receiver_username = ?
            ORDER BY time ASC
        `).all(username, username);

        return NextResponse.json(messages.map(m => ({
            id: m.id,
            sender: m.sender_username,
            receiver: m.receiver_username,
            ciphertext: m.ciphertext,
            plaintext: '*********', // Decryption logic is on the client
            time: m.time,
            isMine: m.sender_username === username
        })));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
    }
}
