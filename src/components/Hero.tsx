import { useState } from 'react'
import FlipWord from './FlipWord'
import SpinningGlobe from './SpinningGlobe'

export default function Hero() {
  const [heroFlipped, setHeroFlipped] = useState(false)

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(210,255,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero title */}
      <h1
        onMouseEnter={() => setHeroFlipped(true)}
        onMouseLeave={() => setHeroFlipped(false)}
        style={{
          fontSize: 'clamp(3rem, 12vw, 10rem)',
          fontWeight: 700,
          lineHeight: 0.9,
          textAlign: 'center',
          letterSpacing: '-0.04em',
          margin: 0,
          color: '#fff',
          animation: 'fadeUp 1s 0.5s both ease-out',
          cursor: 'default',
        }}
      >
        Building{' '}
        <FlipWord word="the" flipTo="for" as="span" flipped={heroFlipped} />
        <br />
        <FlipWord
          word="Future"
          flipTo="Africa"
          as="span"
          style={{ color: '#d2ff00', fontSize: 'inherit' }}
          flipped={heroFlipped}
        />
      </h1>

      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          marginTop: '1.5rem',
          textAlign: 'center',
          maxWidth: 500,
          animation: 'fadeUp 1s 0.8s both ease-out',
        }}
      >
        Modern apps, websites, and data analytics —{' '}
        <FlipWord word="built" flipTo="tailored" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} />{' '}
        for Africa.
      </p>

      {/* Spinning globe */}
      <div
        style={{
          marginTop: '1.5rem',
          animation: 'fadeUp 1s 1s both ease-out',
        }}
      >
        <SpinningGlobe size={64} />
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeUp 1s 1.2s both ease-out',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
          }}
        />
      </div>
    </section>
  )
}
