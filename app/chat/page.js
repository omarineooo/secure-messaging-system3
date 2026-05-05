'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Lock, User, Shield, Eye, EyeOff, Terminal, Activity, ChevronLeft } from 'lucide-react'
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
    const [isMobile, setIsMobile] = useState(false)
    const scrollRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

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

    useEffect(() => {
        let interval;
        if (selectedContact && currentUser) {
            fetchMessages()
            interval = setInterval(fetchMessages, 3000)
        }
        return () => clearInterval(interval)
    }, [selectedContact, currentUser])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
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
        if (!selectedContact) return
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
                body: JSON.stringify({
                    from: currentUser.username,
                    to: selectedContact.username,
                    message: inputText
                })
            })
            if (res.ok) {
                setInputText('')
                fetchMessages()
            }
        } catch (e) { console.error(e) }
    }

    if (!currentUser) return null

    return (
        <div className="container">
            <div className={`chat-app-container ${selectedContact ? 'is-chat-open' : ''}`}>
                {/* Contacts Sidebar */}
                <div className="contacts-sidebar">
                    <div className="sidebar-header">
                        <Terminal size={18} color="var(--blue)" />
                        <h3>Active Terminals</h3>
                    </div>
                    <div className="contacts-scroll">
                        {loading ? (
                            <div className="loading-state">Scanning Network...</div>
                        ) : (
                            users.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => setSelectedContact(u)}
                                    className={`contact-card ${selectedContact?.username === u.username ? 'active' : ''}`}
                                >
                                    <div className="contact-avatar">{u.username[0].toUpperCase()}</div>
                                    <div className="contact-info">
                                        <div className="contact-name">{u.username}</div>
                                        <div className="contact-status">RSA ID: {String(u.id).substring(0, 6)}</div>
                                    </div>
                                    {selectedContact?.username === u.username && <div className="active-glow" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Viewport */}
                <div className="chat-viewport">
                    {selectedContact ? (
                        <>
                            <div className="viewport-header">
                                <button className="mobile-back" onClick={() => setSelectedContact(null)}>
                                    <ChevronLeft size={24} />
                                </button>
                                <Shield className="shield-icon" size={24} />
                                <div className="node-identity">
                                    <h3>{selectedContact.username}</h3>
                                    <span><Lock size={10} /> Secure Connection</span>
                                </div>
                                <button className="refresh-btn" onClick={fetchMessages}>
                                    <Activity size={20} />
                                </button>
                            </div>

                            <div className="messages-container" ref={scrollRef}>
                                <AnimatePresence>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={msg.id || idx}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`msg-row ${msg.isMine ? 'is-mine' : 'is-theirs'}`}
                                        >
                                            <div className="msg-bubble">
                                                <div className="msg-content">
                                                    {msg.isMine
                                                        ? (showPlain[msg.id] ? 'Message Ciphertext (AES-256 / RSA-2048)' : msg.ciphertext.substring(0, 60) + '...')
                                                        : (showPlain[msg.id] ? decrypt(msg.ciphertext, currentUser.privateKey) : msg.ciphertext.substring(0, 60) + '...')
                                                    }
                                                </div>
                                                <button
                                                    className="msg-action"
                                                    onClick={() => setShowPlain(p => ({ ...p, [msg.id]: !p[msg.id] }))}
                                                >
                                                    {showPlain[msg.id] ? <><EyeOff size={11} /> Hide</> : <><Eye size={11} /> {msg.isMine ? 'Details' : 'Decrypt'}</>}
                                                </button>
                                            </div>
                                            <div className="msg-time">
                                                {new Date(msg.time + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="input-bar">
                                <form className="input-form" onSubmit={handleSend}>
                                    <input
                                        className="chat-input"
                                        placeholder="Enter encrypted payload..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <button type="submit" className="send-btn">
                                        <Send size={20} />
                                    </button>
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
                <style jsx>{`
                    .chat-app-container {
                        display: grid;
                        grid-template-columns: 320px 1fr;
                        gap: 24px;
                        height: calc(100vh - 140px);
                        width: 100%;
                    }

                    /* Sidebar */
                    .contacts-sidebar {
                        background: var(--panel);
                        border: 1px solid var(--line);
                        border-radius: 28px;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        backdrop-filter: blur(16px);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    }
                    .sidebar-header {
                        padding: 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        border-bottom: 1px solid var(--line);
                        background: rgba(0, 229, 255, 0.03);
                    }
                    .sidebar-header h3 { margin: 0; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--blue); }
                    .contacts-scroll { flex: 1; overflow-y: auto; padding: 16px; }
                    .contact-card {
                        padding: 14px 18px;
                        border-radius: 20px;
                        background: rgba(30, 41, 59, 0.2);
                        border: 1px solid transparent;
                        margin-bottom: 12px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        position: relative;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .contact-card:hover { border-color: rgba(56, 189, 248, 0.3); background: rgba(30, 41, 59, 0.4); transform: translateY(-1px); }
                    .contact-card.active { background: rgba(0, 229, 255, 0.06); border-color: var(--blue); box-shadow: 0 0 20px rgba(0, 229, 255, 0.05); }
                    .contact-avatar { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 18px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
                    .contact-name { font-weight: 600; font-size: 15px; color: var(--text); }
                    .contact-status { font-size: 10px; color: var(--muted); margin-top: 2px; }
                    .active-glow { position: absolute; right: 18px; width: 8px; height: 8px; background: var(--blue); border-radius: 50%; box-shadow: 0 0 12px var(--blue); }

                    /* Viewport */
                    .chat-viewport {
                        background: var(--panel);
                        border: 1px solid var(--line);
                        border-radius: 28px;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        backdrop-filter: blur(16px);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    }
                    .viewport-header {
                        padding: 18px 28px;
                        background: rgba(0, 229, 255, 0.04);
                        border-bottom: 1px solid var(--line);
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    .mobile-back { display: none; background: none; border: none; color: var(--blue); cursor: pointer; padding: 0; }
                    .shield-icon { color: var(--blue); filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.3)); }
                    .node-identity h3 { margin: 0; font-size: 18px; font-weight: 700; color: #fff; }
                    .node-identity span { font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px; font-weight: 500; }
                    .refresh-btn { background: none; border: none; color: var(--muted); cursor: pointer; margin-left: auto; transition: color 0.2s; }
                    .refresh-btn:hover { color: var(--blue); }
                    
                    .messages-container { flex: 1; padding: 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
                    .msg-row { max-width: 80%; display: flex; flex-direction: column; gap: 6px; }
                    .is-mine { align-self: flex-end; align-items: flex-end; }
                    .is-theirs { align-self: flex-start; align-items: flex-start; }
                    
                    .msg-bubble { padding: 14px 20px; border-radius: 22px; position: relative; width: fit-content; max-width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
                    .is-mine .msg-bubble { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; border-bottom-right-radius: 4px; border: none; }
                    .is-theirs .msg-bubble { background: #1e293b; border: 1px solid rgba(56, 189, 248, 0.2); border-bottom-left-radius: 4px; backdrop-filter: blur(8px); }
                    
                    .msg-content { font-size: 14.5px; word-break: break-all; line-height: 1.6; }
                    .is-theirs .msg-content { color: #f1f5f9; }
                    .is-mine .msg-content { color: #ffffff; font-weight: 450; }
                    
                    .msg-action { background: none; border: none; font-size: 11px; cursor: pointer; padding: 0; margin-top: 10px; display: flex; align-items: center; gap: 5px; font-weight: 600; opacity: 0.8; transition: opacity 0.2s; }
                    .msg-action:hover { opacity: 1; }
                    .is-mine .msg-action { color: rgba(255,255,255,0.85); }
                    .is-theirs .msg-action { color: var(--blue); }
                    .msg-time { font-size: 10px; color: var(--muted); padding: 0 6px; font-weight: 500; }

                    .input-bar { padding: 24px 28px; background: rgba(0,0,0,0.3); border-top: 1px solid var(--line); }
                    .input-form { display: flex; gap: 14px; }
                    .chat-input { flex: 1; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--line); border-radius: 18px; padding: 16px 22px; color: #fff; outline: none; transition: all 0.2s; font-size: 15px; }
                    .chat-input:focus { border-color: var(--blue); box-shadow: 0 0 15px rgba(0, 229, 255, 0.1); background: rgba(15, 23, 42, 0.8); }
                    .send-btn { width: 56px; height: 56px; border-radius: 18px; background: linear-gradient(135deg, #00e5ff, #2563eb); border: none; color: #fff; display: grid; place-items: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
                    .send-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }

                    .empty-viewport { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.6; text-align: center; padding: 40px; }
                    .empty-viewport h2 { margin: 24px 0 10px; font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
                    .empty-viewport p { color: var(--muted); max-width: 250px; line-height: 1.5; font-size: 15px; }

                    @media (max-width: 900px) {
                        .chat-app-container { 
                            grid-template-columns: 1fr; 
                            height: calc(100vh - 120px); 
                            width: 100%;
                            position: relative;
                            gap: 0;
                        }
                        .contacts-sidebar { 
                            width: 100%; 
                            height: 100%; 
                            position: absolute;
                            z-index: 10;
                            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            background: var(--panel);
                            border-radius: 0;
                            border: none;
                        }
                        .is-chat-open .contacts-sidebar { transform: translateX(-100%); }
                        
                        .chat-viewport { 
                            width: 100%; 
                            height: 100%;
                            position: absolute;
                            z-index: 5;
                            transform: translateX(100%);
                            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            background: var(--panel);
                            border: none;
                            border-radius: 0;
                        }
                        .is-chat-open .chat-viewport { transform: translateX(0); z-index: 20; }
                        
                        .mobile-back { display: block; }
                        .viewport-header { padding: 14px 20px; }
                        .messages-container { padding: 20px; }
                        .input-bar { padding: 16px 20px; }
                        .msg-row { max-width: 92%; }
                    }
                `}</style>
            </div>
        </div>
    )
}
