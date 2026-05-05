import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { comparePassword } from '@/lib/crypto';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const match = await comparePassword(password, user.password_hash);
        if (!match) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Return user info and keys for client-side E2EE
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                publicKey: user.public_key,
                privateKey: user.private_key
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
