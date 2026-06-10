import { useState, useRef, useEffect, useMemo } from 'react'

const images = [
  '/images/phone_images/1.png',
  '/images/phone_images/2.png',
  '/images/phone_images/3.png',
  '/images/phone_images/4.png',
  '/images/phone_images/5.png',
]

const displayOrder = [0, 1, 2, 3, 4]

const baseOffsets = [0, 10, 20, 30, 40]
const baseRotations = [0, 0, 0, 0, 0]

interface PhoneCollageProps {
  video?: string
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

export default function PhoneCollage({ video }: PhoneCollageProps) {
  const isMobile = useIsMobile()
  const [hoveredDisplayIdx, setHoveredDisplayIdx] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const videos = useMemo(() => {
    if (!video) return undefined
    return Array.from({ length: 5 }, (_, i) =>
      video.replace(/demo_\d+/, `demo_${i + 1}`)
    )
  }, [video])

  useEffect(() => {
    videoRefs.current.forEach((el) => {
      if (el) { el.pause(); el.currentTime = 0 }
    })
    if (hoveredDisplayIdx !== null && videoRefs.current[hoveredDisplayIdx]) {
      videoRefs.current[hoveredDisplayIdx]!.play().catch(() => {})
    }
  }, [hoveredDisplayIdx])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {displayOrder.map((imgIdx, di) => {
        const isHov = hoveredDisplayIdx === di
        const isLeft = hoveredDisplayIdx !== null && di < hoveredDisplayIdx
        const isRight = hoveredDisplayIdx !== null && di > hoveredDisplayIdx
        const dist = hoveredDisplayIdx !== null ? Math.abs(hoveredDisplayIdx - di) : 0

        let pushX = 0
        let pushY = 0
        let s = 1
        let z = 5 - di

        if (isHov) {
          pushY = isMobile ? -40 : -28
          s = isMobile ? 3 : 1.12
          z = 10
        } else if (dist === 1) {
          pushX = isLeft ? -35 : 35
          pushY = 8
          s = 1.04
        } else if (dist === 2) {
          pushX = isLeft ? -18 : 18
          pushY = 4
        }

        return (
          <div
            key={imgIdx}
            onMouseEnter={() => setHoveredDisplayIdx(di)}
            onMouseLeave={() => setHoveredDisplayIdx(null)}
            style={{
              position: 'absolute',
              left: `calc(50% + ${baseOffsets[di]}%)`,
              top: '50%',
              width: isMobile && isHov ? '42%' : '42%',
              aspectRatio: '9 / 19.5',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transform: `translate(-50%, -50%) rotate(${baseRotations[di]}deg) translateX(${pushX}px) translateY(${pushY}px) scale(${s})`,
              zIndex: z,
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease',
              boxShadow: isHov
                ? '0 24px 80px rgba(0,0,0,0.6)'
                : '0 4px 20px rgba(0,0,0,0.35)',
            }}
          >
            {videos && videos[di] ? (
              <video
                ref={el => { videoRefs.current[di] = el }}
                src={videos[di]}
                muted
                playsInline
                loop
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <img
                src={images[imgIdx]}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
                opacity: isHov ? 1 : 0,
                transition: 'opacity 0.4s',
                pointerEvents: 'none',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
