interface HeaderProps {
  activeSection: string
}

const links = [
  { id: 'hero', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
]

export default function Header({ activeSection }: HeaderProps) {
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
