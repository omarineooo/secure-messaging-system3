'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user))
                setMessage('Login successful!')
                setTimeout(() => router.push('/dashboard'), 1000)
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage('Failed to connect to server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="panel" style={{ maxWidth: '450px', margin: '40px auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        className="input-field"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        className="input-field"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button className="primary-btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
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

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
                    Don't have an account? <Link href="/register" style={{ color: 'var(--blue)' }}>Create One</Link>
                </p>
            </form>
        </div>
    )
}
