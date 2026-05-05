import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        // Drop existing tables to completely wipe the slate clean
        db.exec("DROP TABLE IF EXISTS messages");
        db.exec("DROP TABLE IF EXISTS users");

        // Recreate users table
        db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                public_key TEXT NOT NULL
            );
        `);

        // Recreate messages table
        db.exec(`
            CREATE TABLE messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_username TEXT NOT NULL,
                receiver_username TEXT NOT NULL,
                ciphertext TEXT NOT NULL,
                time DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(sender_username) REFERENCES users(username),
                FOREIGN KEY(receiver_username) REFERENCES users(username)
            );
        `);

        // Test connection by writing and reading a dummy node
        const stmt = db.prepare("INSERT INTO users (username, password_hash, public_key) VALUES (?, ?, ?)");
        stmt.run('node_admin_test_123', 'dummy_hash', 'dummy_key');

        const testUser = db.prepare("SELECT * FROM users WHERE username = ?").get('node_admin_test_123');

        // Clean up dummy node
        db.prepare("DELETE FROM users WHERE username = ?").run('node_admin_test_123');

        // Verify tables exist
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

        if (testUser) {
            return NextResponse.json({
                success: true,
                message: 'Database dropped, successfully rebuilt from scratch, and Read/Write capabilities verified!',
                active_tables: tables.map(t => t.name)
            }, { status: 200 });
        } else {
            throw new Error("Read/Write test failed silently.");
        }

    } catch (error) {
        console.error('Reset DB Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Database Reset/Connection Failed',
            error: String(error)
        }, { status: 500 });
    }
}
