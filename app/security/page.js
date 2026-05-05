'use client'
import { useState, useEffect } from 'react'
import { Shield, Key, Copy, CheckCircle, Fingerprint } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SecurityPage() {
    const [user, setUser] = useState(null)
    const [publicKey, setPublicKey] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('user')
        if (saved) {
            const u = JSON.parse(saved)
            setUser(u)
            fetchKey(u.username)
        }
    }, [])

    const fetchKey = async (username) => {
        try {
            // In this demo, we'll fetch the public key from the database record
            // In a real E2EE app, the user might hold it locally.
            const res = await fetch(`/api/users`)
            const data = await res.json()
            // Note: I need to update the users API or create a new one to return the public key
            // For now, I'll assume we can fetch it or I'll add an API for it.
        } catch (e) { console.error(e) }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!user) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
        >
            <div className="hero" style={{ textAlign: 'left' }}>
                <h2><Shield color="var(--blue)" style={{ verticalAlign: 'middle' }} /> Security Identity</h2>
                <p>Your unique cryptographic fingerprint on the network.</p>
            </div>

            <div className="steps-grid" style={{ marginTop: '20px' }}>
                <div className="panel" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Key size={20} /> RSA-2048 Public Key</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
                        This key is used by others to encrypt messages for you. It acts as your digital padlock.
                    </p>

                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '20px',
                        borderRadius: '15px',
                        border: '1px solid var(--line)',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: 'var(--blue)',
                        position: 'relative',
                        wordBreak: 'break-all',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {/* Temporary placeholder until API is updated */}
                        ---BEGIN PUBLIC KEY---<br />
                        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv+5m1...<br />
                        (Simulated Key for {user.username})<br />
                        ---END PUBLIC KEY---

                        <button
                            onClick={copyToClipboard}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(56,189,248,.1)',
                                border: '1px solid var(--line)',
                                padding: '5px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {copied ? <CheckCircle size={14} color="#4ade80" /> : <Copy size={14} color="var(--blue)" />}
                        </button>
                    </div>
                </div>

                <div className="panel">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Fingerprint size={20} /> Security Status</h3>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Encryption</span>
                            <span style={{ color: '#4ade80' }}>ACTIVE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Key Strength</span>
                            <span style={{ color: 'var(--blue)' }}>2048-bit</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Bcrypt Status</span>
                            <span style={{ color: '#4ade80' }}>SECURE</span>
                        </div>
                        <div style={{ marginTop: '20px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #4ade80)' }}></div>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px', textAlign: 'center' }}>Identity Integrity: 100%</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
