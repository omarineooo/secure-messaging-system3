'use client'
import './chat.css'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Lock, Shield, Eye, EyeOff, Terminal, Activity, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { decrypt } from '@/lib/crypto-client'

export default function ChatPage() {
    const [currentUser, setCurrentUser] = useState(null)
    const [users, setUsers] = useState([])
    const [selectedContact, setSelectedContact] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(true)
    const [showPlain, setShowPlain] = useState({})
    const scrollRef = useRef(null)
    const router = useRouter()

    // Redirect if not logged in
    useEffect(() => {
        const saved = localStorage.getItem('user')
        if (!saved) {
            router.push('/login')
        } else {
            const u = JSON.parse(saved)
            setCurrentUser(u)
            fetchUsers(u.username)
        }
    }, [])

    // Auto-refresh messages every 3 seconds when a contact is open
    useEffect(() => {
        let interval
        if (selectedContact && currentUser) {
            fetchMessages()
            interval = setInterval(fetchMessages, 3000)
        }
        return () => clearInterval(interval)
    }, [selectedContact, currentUser])

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [messages])

    const fetchUsers = async (myUsername) => {
        try {
            const res = await fetch('/api/users', { cache: 'no-store' })
            const data = await res.json()
            setUsers(data.filter(u => u.username !== myUsername))
            setLoading(false)
        } catch (e) { console.error(e) }
    }

    const fetchMessages = async () => {
        if (!selectedContact || !currentUser) return
        try {
            const res = await fetch(`/api/messages/inbox?username=${currentUser.username}`, { cache: 'no-store' })
            const data = await res.json()
            if (!Array.isArray(data)) return
            const filtered = data.filter(m =>
                (m.sender === selectedContact.username && m.receiver === currentUser.username) ||
                (m.sender === currentUser.username && m.receiver === selectedContact.username)
            )
            setMessages(filtered)
        } catch (e) { console.error(e) }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!inputText.trim() || !selectedContact) return
        try {
            const res = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: currentUser.username, to: selectedContact.username, message: inputText })
            })
            if (res.ok) { setInputText(''); fetchMessages() }
        } catch (e) { console.error(e) }
    }

    if (!currentUser) return null

    return (
        <div className="container">
            <div className={`chat-app-container ${selectedContact ? 'is-chat-open' : ''}`}>

                {/* ── CONTACTS SIDEBAR ── */}
                <div className="contacts-sidebar">
                    <div className="sidebar-header">
                        <Terminal size={18} color="var(--blue)" />
                        <h3>Active Terminals</h3>
                    </div>
                    <div className="contacts-scroll">
                        {loading ? (
                            <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 20 }}>
                                Scanning network...
                            </p>
                        ) : users.length === 0 ? (
                            <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 20 }}>
                                No other nodes found.
                            </p>
                        ) : users.map(u => (
                            <div
                                key={u.id}
                                className={`contact-card ${selectedContact?.username === u.username ? 'active' : ''}`}
                                onClick={() => { setSelectedContact(u); setShowPlain({}) }}
                            >
                                <div className="contact-avatar">{u.username[0].toUpperCase()}</div>
                                <div>
                                    <div className="contact-name">{u.username}</div>
                                    <div className="contact-status">RSA ID: {u.id}</div>
                                </div>
                                {selectedContact?.username === u.username && <span className="active-glow" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CHAT VIEWPORT ── */}
                <div className="chat-viewport">
                    {selectedContact ? (
                        <>
                            {/* Header */}
                            <div className="viewport-header">
                                <button className="mobile-back" onClick={() => setSelectedContact(null)}>
                                    <ChevronLeft size={22} />
                                </button>
                                <Shield size={22} className="shield-icon" />
                                <div className="node-identity">
                                    <h3>{selectedContact.username}</h3>
                                    <span><Lock size={10} /> Secure Connection</span>
                                </div>
                                <button className="refresh-btn" onClick={fetchMessages}>
                                    <Activity size={20} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="messages-container" ref={scrollRef}>
                                <AnimatePresence>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={msg.id || idx}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`msg-row ${msg.isMine ? 'is-mine' : 'is-theirs'}`}
                                        >
                                            <div className="msg-bubble">
                                                <div className="msg-content">
                                                    {msg.isMine
                                                        ? (showPlain[msg.id] ? 'Message Ciphertext (AES-256 / RSA-2048)' : msg.ciphertext.substring(0, 60) + '...')
                                                        : (showPlain[msg.id] ? decrypt(msg.ciphertext, currentUser.privateKey) : msg.ciphertext.substring(0, 60) + '...')}
                                                </div>
                                                <button
                                                    className="msg-action"
                                                    onClick={() => setShowPlain(p => ({ ...p, [msg.id]: !p[msg.id] }))}
                                                >
                                                    {showPlain[msg.id]
                                                        ? <><EyeOff size={11} /> Hide</>
                                                        : <><Eye size={11} /> {msg.isMine ? 'Details' : 'Decrypt'}</>}
                                                </button>
                                            </div>
                                            <div className="msg-time">
                                                {new Date(msg.time + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Input */}
                            <div className="input-bar">
                                <form className="input-form" onSubmit={handleSend}>
                                    <input
                                        className="chat-input"
                                        placeholder="Enter encrypted payload..."
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                    />
                                    <button type="submit" className="send-btn"><Send size={20} /></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="empty-viewport">
                            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                <Lock size={80} color="var(--line)" />
                            </motion.div>
                            <h2>Secure Node Offline</h2>
                            <p>Select a terminal target to begin encrypted handshake.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
