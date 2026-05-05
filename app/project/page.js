'use client'
import { motion } from 'framer-motion'
import { Shield, Lock, Key, Server } from 'lucide-react'

export default function ProjectPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container">
            <div className="hero">
                <h2>🛡️ Technical Overview</h2>
                <p>How we implemented a full-stack secure messaging system.</p>
            </div>

            <div className="steps-grid" style={{ marginTop: '30px' }}>
                <div className="panel">
                    <div style={{ color: 'var(--blue)', marginBottom: '15px' }}><Lock size={32} /></div>
                    <h3>Password Hashing</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
                        Passwords are never stored in plaintext. We use <strong>Bcrypt</strong> with a cost factor of 10 to hash credentials before they touch the database.
                    </p>
                </div>

                <div className="panel">
                    <div style={{ color: 'var(--blue)', marginBottom: '15px' }}><Key size={32} /></div>
                    <h3>RSA Key Generation</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
                        Upon registration, every user gets a unique <strong>2048-bit RSA</strong> key pair generated via <code>node-forge</code>.
                    </p>
                </div>

                <div className="panel">
                    <div style={{ color: 'var(--blue)', marginBottom: '15px' }}><Server size={32} /></div>
                    <h3>Encrypted Storage</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
                        All messages are stored as **Ciphertexts** in the SQLite database. Even the administrator cannot read the messages without the private key.
                    </p>
                </div>
            </div>

            <div className="panel" style={{ marginTop: '30px', background: 'rgba(56,189,248,0.05)' }}>
                <h3 style={{ color: 'var(--blue)' }}>End-to-End Encryption Flow</h3>
                <div style={{ padding: '20px', borderLeft: '3px solid var(--blue)', marginTop: '15px' }}>
                    <p>1. Sender fetches Receiver's <strong>Public Key</strong>.</p>
                    <p>2. Sender encrypts the message using <strong>RSA-OAEP</strong>.</p>
                    <p>3. Ciphertext is stored in the database.</p>
                    <p>4. Receiver decrypts the ciphertext using their <strong>Private Key</strong>.</p>
                </div>
            </div>
        </motion.div>
    )
}
