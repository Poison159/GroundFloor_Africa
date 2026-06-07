import { useScrollReveal } from '../hooks/useScrollReveal'
import PhoneCollage from './PhoneCollage'

interface AnimatedCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  color: string
  index: number
  phoneCollage?: boolean
}

export default function AnimatedCard({ title, description, tags, image, color, index, phoneCollage }: AnimatedCardProps) {
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
        transform: visible
          ? 'translateY(0) scale(1)'
          : `translateY(${index % 2 === 0 ? '60px' : '60px'}) scale(0.95)`,
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
            background: color,
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
          {title}
        </h3>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginTop: '1rem',
          }}
        >
          {description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '0.35rem 0.85rem',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 100,
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {phoneCollage ? (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            aspectRatio: '4/3',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        >
          <PhoneCollage />
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            aspectRatio: '4/3',
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
          }}
        >
          <img
            src={image}
            alt={title}
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
      )}
    </div>
  )
}
