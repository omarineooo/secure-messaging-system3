'use client'
import './globals.css'
import Navbar from './Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
    const pathname = usePathname()

    return (
        <html lang="en">
            <body>
                <div className="grid-bg"></div>
                <Navbar />
                <AnimatePresence mode="wait">
                    <motion.main
                        key={pathname}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="container"
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
            </body>
        </html>
    )
}
