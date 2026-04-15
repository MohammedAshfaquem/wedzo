import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

function FallingPetals() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const petals = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      size: Math.random() * 5 + 3,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      petals.forEach((p) => {
        p.y += p.speedY; p.x += p.speedX
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width }
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, p.x * 0.01, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(183,110,121,${p.opacity})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <FallingPetals />
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-8xl mb-6"
        >
          💔
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-playfair italic text-6xl text-rose-500 mb-3"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-gray-600 text-lg mb-2"
        >
          This page has wandered off...
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-gray-400 text-sm mb-8 max-w-sm"
        >
          The page you're looking for doesn't exist, or the invitation link may have changed. Please check with the couple.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Link
            to="/"
            className="px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition shadow-lg shadow-rose-200"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
