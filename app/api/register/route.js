import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateKeyPair } from '@/lib/crypto';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ success: false, message: 'Please fill all fields' }, { status: 400 });
        }

        if (username.length < 3 || password.length < 6) {
            return NextResponse.json({ success: false, message: 'Username (3+) or Password (6+) too short' }, { status: 400 });
        }

        // Check if user exists
        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 409 });
        }

        // Generate Security Layer
        const passwordHash = await hashPassword(password);
        const { publicKey, privateKey } = await generateKeyPair();

        // Store User
        const stmt = db.prepare(`
      INSERT INTO users (username, password_hash, public_key, private_key)
      VALUES (?, ?, ?, ?)
    `);

        stmt.run(username, passwordHash, publicKey, privateKey);

        return NextResponse.json({
            success: true,
            message: 'Account created with secure E2EE keys'
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ success: false, message: 'Server error during registration' }, { status: 500 });
    }
}
