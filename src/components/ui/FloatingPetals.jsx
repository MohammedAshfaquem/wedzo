import { useEffect, useRef } from 'react'

const TEMPLATES = {
  EternalRose: { colors: ['#F4C6C6', '#E8A4A4', '#C97B84', '#D4687A'], shape: 'petal' },
  MidnightGarden: { colors: ['#90EE90', '#98FB98', '#7CFC00', '#ADFF2F'], shape: 'firefly' },
  GoldenHour: { colors: ['#FFD700', '#FFA500', '#FFB347', '#FFDAB9'], shape: 'bokeh' },
  CelestialLove: { colors: ['#FFFFFF', '#E0E0FF', '#C0C0FF', '#FFD700'], shape: 'star' },
  TropicalBloom: { colors: ['#FF6B6B', '#FFE66D', '#FF8E53', '#4ECDC4'], shape: 'petal' },
}

export default function FloatingPetals({ template = 'EternalRose' }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  const config = TEMPLATES[template] || TEMPLATES.EternalRose

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create 60 particles
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 0.8 + Math.random() * 1.2,
      opacity: 0.4 + Math.random() * 0.6,
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
    })

    particlesRef.current = Array.from({ length: 60 }, createParticle)

    const drawPetal = (ctx, p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color

      if (config.shape === 'firefly') {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
        // Glow
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
        grd.addColorStop(0, p.color + 'CC')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (config.shape === 'star') {
        const spikes = 4, outer = p.size, inner = p.size / 2
        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes - Math.PI / 2
          const r = i % 2 === 0 ? outer : inner
          if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
          else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill()
      } else {
        // Petal / bokeh
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx + Math.sin(Date.now() * 0.001 + i) * 0.3
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.y > canvas.height + 20) {
          particlesRef.current[i] = { ...createParticle(), y: -20 }
        }

        drawPetal(ctx, p)
      })

      animRef.current = requestAnimationFrame(animate)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current)
      } else {
        animate()
      }
    }

    animate()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [template])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
