'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Inbox, Shield, Eye, EyeOff } from 'lucide-react'

export default function InboxPage() {
    const [user, setUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPlain, setShowPlain] = useState({})
    const router = useRouter()

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (!savedUser) {
            router.push('/login')
        } else {
            const u = JSON.parse(savedUser)
            setUser(u)
            fetchMessages(u.username)
        }
    }, [])

    const fetchMessages = async (username) => {
        try {
            const res = await fetch(`/api/messages/inbox?username=${username}`)
            const data = await res.json()
            setMessages(data)
        } catch (error) {
            console.error('Failed to load inbox')
        } finally {
            setLoading(false)
        }
    }

    const toggleMsg = (id) => {
        setShowPlain(prev => ({ ...prev, [id]: !prev[id] }))
    }

    if (!user) return null

    return (
        <div className="container">
            <div className="hero" style={{ padding: '30px 0', textAlign: 'left' }}>
                <h3><Inbox size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Secure Inbox</h3>
                <p>Messages are decrypted using your local RSA private key session.</p>
            </div>

            {loading ? (
                <div className="panel" style={{ textAlign: 'center' }}>Loading encrypted messages...</div>
            ) : messages.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center' }}>No messages found.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className="panel" style={{ margin: 0, position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong style={{ color: 'var(--blue)' }}>From: {msg.sender}</strong>
                                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{new Date(msg.time).toLocaleString()}</span>
                            </div>

                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '15px',
                                borderRadius: '10px',
                                border: '1px solid var(--line)',
                                wordBreak: 'break-all',
                                fontFamily: showPlain[idx] ? 'inherit' : 'monospace',
                                fontSize: showPlain[idx] ? '16px' : '12px',
                                color: showPlain[idx] ? 'white' : 'var(--muted)'
                            }}>
                                {showPlain[idx] ? msg.plaintext : msg.ciphertext}
                            </div>

                            <button
                                onClick={() => toggleMsg(idx)}
                                style={{
                                    marginTop: '15px',
                                    background: 'transparent',
                                    border: '1px solid var(--blue)',
                                    color: 'var(--blue)',
                                    padding: '5px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '13px'
                                }}
                            >
                                {showPlain[idx] ? <><EyeOff size={14} /> Hide Secret</> : <><Eye size={14} /> Decrypt with RSA</>}
                            </button>

                            <Shield size={16} style={{ position: 'absolute', bottom: '25px', right: '28px', color: '#4ade80', opacity: 0.5 }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
