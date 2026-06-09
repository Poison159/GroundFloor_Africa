import { useState, useEffect, useRef } from 'react'

const ease = '0.6s cubic-bezier(0.65, 0, 0.35, 1)'

interface ImageCyclerProps {
  images: string[]
  alt: string
  duration?: number
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

export default function ImageCycler({ images, alt, duration = 2000 }: ImageCyclerProps) {
  const isMobile = useIsMobile()
  const [hovering, setHovering] = useState(false)
  const [base, setBase] = useState(images[0])
  const [baseOpacity, setBaseOpacity] = useState(1)
  const [enterSrc, setEnterSrc] = useState<string | null>(null)
  const [enterOpacity, setEnterOpacity] = useState(0)
  const [noTransition, setNoTransition] = useState(false)
  const idxRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!hovering) {
      if (timerRef.current) clearTimeout(timerRef.current)
      idxRef.current = 0
      setBase(images[0])
      setBaseOpacity(1)
      setEnterSrc(null)
      setEnterOpacity(0)
      return
    }

    timerRef.current = window.setTimeout(() => {
      const nextIdx = (idxRef.current + 1) % images.length
      idxRef.current = nextIdx
      const nextSrc = images[nextIdx]

      setEnterSrc(nextSrc)
      setBaseOpacity(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterOpacity(1)
        })
      })

      setTimeout(() => {
        setNoTransition(true)
        setBase(nextSrc)
        setBaseOpacity(1)
        setEnterSrc(null)
        setEnterOpacity(0)
        requestAnimationFrame(() => setNoTransition(false))
      }, 600)
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [hovering, base, duration, images])

  const zoom = hovering && isMobile ? 3 : 1
  const baseZoomOut = isMobile ? (hovering ? 2.8 : 1) : 0.95

  return (
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
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        src={base}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: baseOpacity,
          transform: baseOpacity === 0 ? `scale(${baseZoomOut})` : `scale(${zoom})`,
          transition: noTransition ? 'none' : `opacity ${ease}, transform ${ease}`,
        }}
      />
      {enterSrc && (
        <img
          src={enterSrc}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: enterOpacity,
            transform: enterOpacity === 1 ? `scale(${zoom})` : `scale(${isMobile ? 2.8 : 1.1})`,
            transition: `opacity ${ease}, transform ${ease}`,
          }}
        />
      )}
    </div>
  )
}
