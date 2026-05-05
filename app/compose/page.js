'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, Lock } from 'lucide-react'

export default function ComposePage() {
    const [user, setUser] = useState(null)
    const [formData, setFormData] = useState({ to: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (!savedUser) router.push('/login')
        else setUser(JSON.parse(savedUser))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: user.username,
                    to: formData.to,
                    message: formData.message
                }),
            })

            const data = await res.json()
            setMessage(data.message)
            if (data.success) setFormData({ to: '', message: '' })
        } catch (error) {
            setMessage('Failed to send message')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="panel" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={20} /> Compose Secure Message
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
                Your message will be encrypted using the recipient's RSA public key.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Recipient Username</label>
                    <input
                        className="input-field"
                        type="text"
                        required
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        placeholder="Energy the recipient's name"
                    />
                </div>

                <div className="input-group">
                    <label>Message</label>
                    <textarea
                        className="input-field"
                        style={{ minHeight: '150px', resize: 'vertical' }}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Type your private message here..."
                    />
                </div>

                <button className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} disabled={loading}>
                    <Lock size={16} /> {loading ? 'Encrypting...' : 'Encrypt & Send'}
                </button>

                {message && (
                    <p style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        color: message.toLowerCase().includes('success') ? '#4ade80' : '#f87171'
                    }}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}
