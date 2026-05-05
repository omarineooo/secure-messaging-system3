import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        // Run a simple query to physically interact with the file
        const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();

        if (tableCheck) {
            return NextResponse.json({
                success: true,
                message: 'Database is successfully initialized and ready.',
                environment: process.cwd()
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Database file created, but tables missing!'
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Init DB Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to access database',
            error: error.message
        }, { status: 500 });
    }
}
