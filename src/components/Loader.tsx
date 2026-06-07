import { useEffect, useState } from 'react'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<'expand' | 'zoom' | 'done'>('expand')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('zoom'), 1200)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: phase === 'done' ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0a0a0a',
          clipPath:
            phase === 'expand'
              ? 'circle(8% at 50% 50%)'
              : phase === 'zoom'
              ? 'circle(200% at 50% 50%)'
              : 'none',
          transition:
            phase === 'expand'
              ? 'clip-path 1.2s cubic-bezier(0.65, 0, 0.35, 1)'
              : phase === 'zoom'
              ? 'clip-path 1s cubic-bezier(0.65, 0, 0.35, 1)'
              : 'none',
          opacity: phase === 'done' ? 0 : 1,
          transitionDelay: phase === 'done' ? '0s' : '0s',
          transitionProperty: phase === 'done' ? 'opacity' : undefined,
          transitionDuration: phase === 'done' ? '0.5s' : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#d2ff00',
              fontFamily: 'monospace',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '0.15em',
              opacity: phase === 'expand' ? 1 : phase === 'zoom' ? 0 : 0,
              transform:
                phase === 'expand'
                  ? 'scale(1)'
                  : phase === 'zoom'
                  ? 'scale(2.5)'
                  : 'scale(3)',
              transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          >
            GROUND<span style={{ color: '#fff' }}>FLOOR</span>
          </span>
        </div>
      </div>
    </div>
  )
}
