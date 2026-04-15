import { useEffect, useRef } from 'react'
import { useSpring } from 'framer-motion'

export function useParallax(strength = 15) {
  const rotateX = useSpring(0, { stiffness: 120, damping: 20, mass: 0.5 })
  const rotateY = useSpring(0, { stiffness: 120, damping: 20, mass: 0.5 })
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = (e.clientX - centerX) / (rect.width / 2)
      const y = (e.clientY - centerY) / (rect.height / 2)

      rotateY.set(x * strength)
      rotateX.set(-y * strength)
    }

    const handleMouseLeave = () => {
      rotateX.set(0)
      rotateY.set(0)
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [rotateX, rotateY, strength])

  return { containerRef, rotateX, rotateY }
}
