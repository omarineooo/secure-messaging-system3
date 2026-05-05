'use client'
export default function TeamPage() {
    const team = [
        { name: 'Omar Mohammed Fahim', id: '2520652', role: 'Team Leader & Project Manager' },
        { name: 'Omar Mahmoud Basili', id: '2520654', role: 'HTML Semantics & JS Core Logic' },
        { name: 'Fatima Mohammed Atallah', id: '2520687', role: 'CSS Expert & Responsiveness' },
        { name: 'Salma Mohamed Ibrahim', id: '2520475', role: 'API Integration & Dynamic Content' },
        { name: 'Aya Mohamed Mahmoud', id: '2520010', role: 'Testing & Bug Fixing Specialist' },
    ]

    return (
        <main className="container">
            <style jsx>{`
        .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 18px; }
        .team-card {
          padding: 22px; border-radius: 20px; background: rgba(2, 6, 23, 0.65);
          border: 1px solid rgba(56,189,248,.22); transition: .25s;
        }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 0 28px rgba(56,189,248,.24); }
        .team-card h4 { margin: 0 0 10px; color: var(--blue); font-size: 20px; }
        .team-card p { margin: 0 0 8px; color: var(--muted); line-height: 1.7; }
        .team-card span { color: var(--text); font-weight: 600; font-size: 14px; }
        @media (max-width: 980px) {
          .team-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            <section className="hero">
                <p className="eyebrow">Development Team</p>
                <h2>Team Members</h2>
                <p>The team behind the secure messaging project and their implementation roles.</p>
            </section>

            <section className="panel">
                <h3 style={{ color: 'var(--blue)' }}>Project Team</h3>
                <div className="team-grid">
                    {team.map((m, i) => (
                        <div key={i} className="team-card">
                            <h4>{m.name}</h4>
                            <p>ID: {m.id}</p>
                            <span>{m.role}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
