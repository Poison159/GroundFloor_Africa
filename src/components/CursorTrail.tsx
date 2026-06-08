import { useEffect, useRef } from 'react'

const TRAIL_LENGTH = 20
const SPACING = 1

export default function CursorTrail() {
  const trailRef = useRef<{ x: number; y: number }[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const dots: HTMLDivElement[] = []
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999'
    document.body.appendChild(container)

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const dot = document.createElement('div')
      const opacity = 1 - i / TRAIL_LENGTH
      const scale = 1 - i / TRAIL_LENGTH
      dot.style.cssText = `
        position:absolute;
        width:6px;
        height:6px;
        border-radius:50%;
        background:#d2ff00;
        opacity:${opacity};
        transform:translate(-50%,-50%) scale(${scale});
        transition:opacity 0.1s, transform 0.1s;
        pointer-events:none;
      `
      container.appendChild(dot)
      dots.push(dot)
    }

    function update(x: number, y: number) {
      trailRef.current.push({ x, y })
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current = trailRef.current.slice(-TRAIL_LENGTH)
      }
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const pt = trailRef.current[trailRef.current.length - 1 - i]
        if (pt) {
          dots[i].style.transform = `translate(${pt.x}px,${pt.y}px) translate(-50%,-50%) scale(${1 - i / TRAIL_LENGTH})`
          dots[i].style.opacity = `${1 - i / TRAIL_LENGTH}`
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => update(e.clientX, e.clientY))
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
      container.remove()
    }
  }, [])

  return null
}
