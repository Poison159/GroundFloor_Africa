import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import Loader from './components/Loader'
import Hero from './components/Hero'
import HorizontalScroll from './components/HorizontalScroll'
import Projects from './components/Projects'
import Team from './components/Team'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import CursorTrail from './components/CursorTrail'
import Cube3D from './components/Cube3D'
import { useActiveSection } from './hooks/useScrollReveal'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [cursorEnabled, setCursorEnabled] = useState(false)
  const [cubeProgress, setCubeProgress] = useState(0)
  const activeSection = useActiveSection()

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero')
      const work = document.getElementById('work')
      if (!hero || !work) return

      const heroTop = hero.offsetTop
      const workTop = work.offsetTop
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const start = heroTop
      const end = workTop - windowHeight * 0.3
      const raw = (scrollY - start) / (end - start)
      setCubeProgress(Math.max(0, Math.min(1.3, raw)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLoaderComplete = useCallback(() => {
    setLoading(false)
  }, [])

  return (
      <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        {cursorEnabled && <CursorTrail />}
        {loading && <Loader onComplete={handleLoaderComplete} />}

      <Cube3D progress={cubeProgress} />
      <Header activeSection={activeSection} cursorEnabled={cursorEnabled} onToggleCursor={() => setCursorEnabled(c => !c)} />

      <main
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <Hero />
        <HorizontalScroll />
        <Projects />
        <Team />
        <Pricing />
        <Contact />
      </main>

      <footer
        style={{
          padding: '2rem 3rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          © 2026 GroundFloor Technologies. All rights reserved.
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
          Built with passion in South Africa
        </span>
      </footer>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; scrollbar-width: none; }
        body { background: #0a0a0a; }
        ::-webkit-scrollbar { display: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        a { color: inherit; }
      `}</style>
    </div>
  )
}
