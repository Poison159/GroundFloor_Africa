import { useEffect, useRef } from 'react'

const africaOutline: [number, number][] = [
  [37, -10], [35, -5], [34, 0], [33, 10], [30, 20],
  [27, 30], [22, 35], [18, 38], [12, 42], [5, 42],
  [2, 45], [0, 42], [-2, 40], [-5, 39], [-8, 39],
  [-10, 40], [-15, 40], [-20, 35], [-25, 33], [-30, 30],
  [-34, 25], [-30, 15], [-25, 14], [-20, 12], [-15, 10],
  [-10, 10], [-5, 10], [0, 10], [4, 5], [5, 0],
  [5, -5], [7, -8], [10, -14], [15, -17], [20, -15],
  [25, -15], [30, -10],
]

function latLonTo3D(lat: number, lon: number, r: number): [number, number, number] {
  const φ = (lat * Math.PI) / 180
  const λ = (lon * Math.PI) / 180
  return [
    r * Math.cos(φ) * Math.cos(λ),
    r * Math.sin(φ),
    r * Math.cos(φ) * Math.sin(λ),
  ]
}

function rotateY(p: [number, number, number], angle: number): [number, number, number] {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]
}

export default function SpinningGlobe({ size = 64 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const r = size / 2 - 3
    const cx = size / 2
    const cy = size / 2

    let angle = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, size, size)

      // Shadow glow
      ctx.beginPath()
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(210, 255, 0, 0.06)'
      ctx.fill()

      // Sphere
      const grad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, 0, cx, cy, r)
      grad.addColorStop(0, '#4fc3f7')
      grad.addColorStop(0.5, '#0288d1')
      grad.addColorStop(1, '#01579b')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()

      // Latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        const p3d = rotateY(latLonTo3D(lat, 0, r), angle)
        if (p3d[2] > -0.5) {
          const scale = 1 / (1 + p3d[2] / (r * 2))
          const rx = r * Math.cos((lat * Math.PI) / 180) * scale
          const ry = r * Math.cos((lat * Math.PI) / 180) * 0.15 * scale
          ctx.beginPath()
          ctx.ellipse(cx, cy + p3d[1], rx, ry, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 0.12 * (1 - p3d[2] / (r * 2)))})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Longitude lines
      for (let lon = 0; lon < 360; lon += 30) {
        const points: [number, number][] = []
        for (let lat = -90; lat <= 90; lat += 5) {
          const p3d = rotateY(latLonTo3D(lat, lon, r), angle)
          if (p3d[2] > -1) {
            points.push([cx + p3d[0], cy - p3d[1]])
          }
        }
        if (points.length > 1) {
          ctx.beginPath()
          ctx.moveTo(points[0][0], points[0][1])
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1])
          }
          const avgZ = rotateY(latLonTo3D(0, lon, r), angle)[2]
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 0.1 * (1 - avgZ / (r * 2)))})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Africa continent
      const africaPoints2D: [number, number][] = []
      let africaAvgZ = 0
      for (const [lat, lon] of africaOutline) {
        const p3d = rotateY(latLonTo3D(lat, lon, r), angle)
        africaAvgZ += p3d[2]
        africaPoints2D.push([cx + p3d[0], cy - p3d[1]])
      }
      africaAvgZ /= africaOutline.length

      const alpha = Math.max(0, Math.min(1, (africaAvgZ + r) / (r * 1.2)))
      ctx.beginPath()
      ctx.moveTo(africaPoints2D[0][0], africaPoints2D[0][1])
      for (let i = 1; i < africaPoints2D.length; i++) {
        ctx.lineTo(africaPoints2D[i][0], africaPoints2D[i][1])
      }
      ctx.closePath()
      ctx.fillStyle = `rgba(210, 255, 0, ${(alpha * 0.45).toFixed(3)})`
      ctx.fill()
      ctx.strokeStyle = `rgba(210, 255, 0, ${(alpha * 0.65).toFixed(3)})`
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.restore()

      // Thin border
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      angle += 0.008
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        borderRadius: '50%',
      }}
    />
  )
}
