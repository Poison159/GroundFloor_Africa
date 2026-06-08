interface HeaderProps {
  activeSection: string
  cursorEnabled: boolean
  onToggleCursor: () => void
}

const links = [
  { id: 'hero', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
]

export default function Header({ activeSection, cursorEnabled, onToggleCursor }: HeaderProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        mixBlendMode: 'difference',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span
          style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          GF<span style={{ color: '#d2ff00' }}>.</span>
        </span>
        <button
          onClick={onToggleCursor}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${cursorEnabled ? '#d2ff00' : 'rgba(255,255,255,0.25)'}`,
            background: cursorEnabled ? '#d2ff00' : 'transparent',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          aria-label="Toggle cursor trail"
        />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            style={{
              color: activeSection === link.id ? '#d2ff00' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
