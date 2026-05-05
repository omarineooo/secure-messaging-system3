'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Shield, Lock, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [user, setUser] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) setUser(JSON.parse(savedUser))

        setIsMenuOpen(false) // Close menu on route change
    }, [pathname])

    const handleLogout = () => {
        localStorage.removeItem('user')
        setUser(null)
        router.push('/')
    }

    return (
        <header className="topbar" style={{ position: 'relative' }}>
            <div className="brand">
                <div className="logo">S</div>
                <div>
                    <h1>Secure Messaging System</h1>
                    <p>Cyber Security Project Presentation</p>
                </div>
            </div>

            <button
                className="mobile-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ background: 'transparent', border: 'none', color: 'var(--blue)', cursor: 'pointer', display: 'none' }}
            >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
                <Link href="/project" className={pathname === '/project' ? 'active' : ''}>About Project</Link>
                <Link href="/team" className={pathname === '/team' ? 'active' : ''}>Members</Link>

                {user ? (
                    <>
                        <Link href="/chat" className={pathname === '/chat' ? 'active' : ''}>Chats</Link>
                        <Link href="/security" className={pathname === '/security' ? 'active' : ''}>Dashboard</Link>
                        <div className="user-section">
                            <span className="user-tag">
                                <Lock size={12} /> {user.username}
                            </span>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login" className={pathname === '/login' ? 'active' : ''}>Login</Link>
                )}
            </nav>

            <style jsx>{`
                .user-section { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    margin-left: auto; 
                    border-left: 1px solid var(--line); 
                    padding-left: 20px; 
                }
                .user-tag { fontSize: 14px; color: var(--blue); display: flex; alignItems: center; gap: 5px; }
                .logout-btn { background: transparent; border: 1px solid #f87171; color: #f87171; padding: 6px 14px; border-radius: 10px; cursor: pointer; font-size: 11px; transition: 0.2s; }
                .logout-btn:hover { background: rgba(248, 113, 113, 0.1); }

                @media (max-width: 980px) {
                    .mobile-toggle { display: block !important; }
                    .user-section { 
                        margin: 10px 0 0 0; 
                        padding: 15px 0 0 0; 
                        border-left: none; 
                        border-top: 1px solid rgba(56, 189, 248, 0.1); 
                        flex-direction: column; 
                        align-items: flex-start;
                        width: 100%;
                    }
                    .logout-btn { width: 100%; text-align: center; padding: 12px; }
                }
            `}</style>
        </header>
    )
}
