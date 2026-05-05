import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { encrypt } from '@/lib/crypto';

export async function POST(request) {
    try {
        const { from, to, message } = await request.json();

        if (!from || !to || !message) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // Get Receiver's Public Key
        const receiver = db.prepare('SELECT public_key FROM users WHERE username = ?').get(to);

        if (!receiver) {
            return NextResponse.json({ success: false, message: 'Recipient not found' }, { status: 404 });
        }

        // Encrypt Message
        const ciphertext = encrypt(message, receiver.public_key);

        // Store in DB
        const stmt = db.prepare(`
      INSERT INTO messages (sender_username, receiver_username, ciphertext)
      VALUES (?, ?, ?)
    `);
        stmt.run(from, to, ciphertext);

        return NextResponse.json({ success: true, message: 'Message sent securely (Encrypted with RSA)' });

    } catch (error) {
        console.error('Send Error:', error);
        return NextResponse.json({ success: false, message: 'Encryption/Send failed' }, { status: 500 });
    }
}
