import { useScrollReveal } from '../hooks/useScrollReveal'
import data from '../data/portfolio.json'

function TeamCard({ member, index }: { member: typeof data.team[0]; index: number }) {
  const { ref, visible } = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
        gap: '3rem',
        alignItems: 'center',
        padding: '3rem 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : `translateY(60px) scale(0.95)`,
        transition: `all 0.8s cubic-bezier(0.65, 0, 0.35, 1) ${index * 0.15}s`,
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            background: '#667eea',
            borderRadius: 2,
            marginBottom: '1rem',
          }}
        />
        <h3
          style={{
            color: '#fff',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            color: '#667eea',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginTop: '0.5rem',
            letterSpacing: '0.02em',
          }}
        >
          {member.role}
        </p>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginTop: '0.75rem',
          }}
        >
          {member.description}
        </p>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(102,126,234,0.3)',
            transition: 'border-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#667eea')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)')}
        >
          LinkedIn →
        </a>
      </div>

      <div
          style={{
            flex: 1,
            minWidth: 0,
            aspectRatio: '1/1',
            borderRadius: 24,
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
            maxWidth: 300,
            border: '2px solid #d2ff00',
          }}
      >
        <img
          src={member.image}
          alt={member.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: visible ? 'scale(1)' : 'scale(1.15)',
            transition: 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        />
      </div>
    </div>
  )
}

export default function Team() {
  const { ref, visible } = useScrollReveal(0.05)

  return (
    <section
      id="team"
      ref={ref}
      style={{
        padding: '6rem 3rem',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            background: '#667eea',
            borderRadius: 2,
            marginBottom: '1rem',
          }}
        />
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          The{' '}
          <span style={{ color: '#d2ff00' }}>Team</span>
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1rem',
            marginTop: '0.75rem',
            maxWidth: 500,
          }}
        >
          Meet the people behind Groundfloor — senior engineers with decades of combined experience.
        </p>

        <div style={{ marginTop: '2rem' }}>
          {data.team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
