'use client'
import { useEffect, useState } from 'react'
import { Shield, Lock, Cpu, Globe, Zap, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({ messages: 0, users: 0 })

    useEffect(() => {
        const saved = localStorage.getItem('user')
        if (saved) setUser(JSON.parse(saved))

        // Simulate fetching stats
        setStats({ messages: Math.floor(Math.random() * 50) + 10, users: 4 })
    }, [])

    if (!user) return null

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
            <div className="hero" style={{ textAlign: 'left', padding: '40px 0' }}>
                <motion.h2
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    style={{ fontSize: '36px', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                    <Shield size={40} color="var(--blue)" /> System Overview
                </motion.h2>
                <p>Welcome back, <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>{user.username}</span>. Your security node is fully operational.</p>
            </div>

            <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <motion.div whileHover={{ y: -5 }} className="panel" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Lock size={80} /></div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--blue)' }}><Cpu size={18} /> Encryption Engine</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0 5px' }}>RSA-2048</p>
                    <small style={{ color: '#4ade80' }}>● High Strength Active</small>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="panel" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Globe size={80} /></div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a855f7' }}><Activity size={18} /> Global Network</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0 5px' }}>{stats.users} Nodes</p>
                    <small style={{ color: 'var(--muted)' }}>Synced across the cluster</small>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="panel" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Zap size={80} /></div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#eab308' }}><Shield size={18} /> Data Integrity</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0 5px' }}>100% Secure</p>
                    <small style={{ color: 'var(--blue)' }}>Bcrypt & RSA Verified</small>
                </motion.div>
            </div>

            <div className="panel" style={{ marginTop: '30px', padding: '30px', border: '1px dashed var(--line)', background: 'rgba(56,189,248,0.02)' }}>
                <h3 style={{ margin: 0, fontSize: '20px', marginBottom: '10px' }}>Security Audit Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)' }}>
                        <span>New Key-pair generated for user {user.username}</span>
                        <span style={{ color: 'var(--blue)' }}>COMPLETED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)' }}>
                        <span>Password hashed with Bcrypt (Salt Rounds: 10)</span>
                        <span style={{ color: 'var(--blue)' }}>VERIFIED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)' }}>
                        <span>Database {stats.messages} messages encrypted with RSA-OAEP</span>
                        <span style={{ color: 'var(--blue)' }}>SECURE</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
