'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
    const [message, setMessage] = useState('')
    const [step1Visible, setStep1Visible] = useState(false)
    const [step2Visible, setStep2Visible] = useState(false)
    const [outEnc, setOutEnc] = useState('')

    const executeRSA = () => {
        if (!message.trim()) return
        const enc = btoa(unescape(encodeURIComponent(message)))
        setStep1Visible(true)
        setOutEnc("RSA_SEC_KEY_" + enc)
        setTimeout(() => {
            setStep2Visible(true)
        }, 600)
    }

    const resetRSA = () => {
        setMessage('')
        setStep1Visible(false)
        setStep2Visible(false)
    }

    return (
        <main>
            <style jsx global>{`
        :root {
            --main-blue: #00d4ff;
            --glass: rgba(10, 10, 10, 0.85);
        }
        .glass-panel {
            background: var(--glass);
            backdrop-filter: blur(35px);
            border: 2px solid rgba(0, 212, 255, 0.2);
            border-radius: 25px;
            padding: 40px;
            box-shadow: 0 0 50px rgba(0, 212, 255, 0.1);
        }
        .btn-encrypt { flex: 1; padding: 16px; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; background: var(--main-blue); color: black; }
        .btn-clear { flex: 0.3; padding: 16px; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; background: #ff4444; color: white; }
        .result-card { background: rgba(5, 5, 5, 0.9); border-left: 5px solid var(--main-blue); padding: 20px; border-radius: 10px; margin-top: 15px; }
      `}</style>

            <section className="hero">
                <p className="eyebrow">Welcome to Secure Messaging</p>
                <h2>Experience Total Privacy</h2>
                <p>A simple yet powerful secure messaging project that demonstrates the power of RSA encryption and Bcrypt hashing.</p>

                <div className="hero-actions">
                    <Link href="/register" className="primary-btn">Start Communcating Securely</Link>
                </div>
            </section>

            <div className="glass-panel" style={{ marginTop: '30px' }}>
                <h3 style={{ color: 'var(--main-blue)', marginBottom: '20px', textAlign: 'center' }}>🛡️ RSA PROCESS SIMULATOR</h3>
                <textarea
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'var(--main-blue)', border: '1px solid #333', padding: '15px', borderRadius: '15px', outline: 'none', marginBottom: '20px' }}
                    rows="3"
                    placeholder="Enter a message to simulate RSA encryption..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn-encrypt" onClick={executeRSA}>EXECUTE RSA 🔒</button>
                    <button className="btn-clear" onClick={resetRSA}>CLEAR 🗑️</button>
                </div>

                {step1Visible && (
                    <div className="result-card">
                        <small style={{ color: '#555' }}>[CIPHERTEXT]</small>
                        <div style={{ color: 'var(--main-blue)', wordBreak: 'break-all', marginTop: '5px' }}>{outEnc}</div>
                    </div>
                )}

                {step2Visible && (
                    <div className="result-card" style={{ borderLeftColor: 'white' }}>
                        <small style={{ color: '#555' }}>[PLAINTEXT]</small>
                        <div style={{ color: 'white', marginTop: '5px' }}>{message}</div>
                    </div>
                )}
            </div>

            <section className="panel" style={{ marginTop: '40px' }}>
                <h3 style={{ color: 'var(--blue)', marginBottom: '25px' }}>How to Use the Project</h3>
                <div className="steps-grid">
                    <div className="step-card">
                        <h4>1. Register</h4>
                        <p>Create a new account with a username and password.</p>
                    </div>

                    <div className="step-card">
                        <h4>2. Login</h4>
                        <p>Log in using your registered account.</p>
                    </div>

                    <div className="step-card">
                        <h4>3. Chat Interface</h4>
                        <p>Select a user and start sending encrypted messages.</p>
                    </div>

                    <div className="step-card">
                        <h4>4. Security Layers</h4>
                        <p>Toggle between encrypted data and decrypted text to see the RSA logic in action.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
