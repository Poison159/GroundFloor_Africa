interface HoverImageProps {
  src: string
  srcHover: string
  alt: string
  aspectRatio?: string
}

export default function HoverImage({ src, srcHover, alt, aspectRatio = '3/4' }: HoverImageProps) {
  return (
    <div
      style={{
        aspectRatio,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        background: '#111',
      }}
      className="hover-image"
    >
      <img
        src={src}
        alt={alt}
        className="hover-image-default"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <img
        src={srcHover}
        alt={`${alt} hover`}
        className="hover-image-hover"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Overlay gradient on hover */}
      <div
        className="hover-image-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        .hover-image-default {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1), transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .hover-image-hover {
          opacity: 0;
          transform: scale(1.1);
          transition: opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1), transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .hover-image-overlay {
          opacity: 0;
          transition: opacity 0.4s;
        }
        .hover-image:hover .hover-image-default { opacity: 0; transform: scale(0.95); }
        .hover-image:hover .hover-image-hover { opacity: 1; transform: scale(1); }
        .hover-image:hover .hover-image-overlay { opacity: 1; }
      `}</style>
    </div>
  )
}
