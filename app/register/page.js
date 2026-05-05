'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            setMessage(data.message)

            if (data.success) {
                setTimeout(() => router.push('/login'), 1500)
            }
        } catch (error) {
            setMessage('Failed to connect to server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="panel" style={{ maxWidth: '450px', margin: '40px auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Secure Account</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        className="input-field"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Choose a unique name"
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
                        placeholder="At least 6 characters"
                    />
                </div>

                <button className="primary-btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                    {loading ? 'Generating Security Keys...' : 'Register & Generate E2EE Keys'}
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
                    Already have an account? <Link href="/login" style={{ color: 'var(--blue)' }}>Sign In</Link>
                </p>
            </form>
        </div>
    )
}
