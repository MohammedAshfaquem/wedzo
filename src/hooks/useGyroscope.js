import { useEffect, useRef } from 'react'
import { useSpring } from 'framer-motion'

export function useGyroscope(strength = 15) {
  const rotateX = useSpring(0, { stiffness: 80, damping: 15 })
  const rotateY = useSpring(0, { stiffness: 80, damping: 15 })
  const isSupported = useRef(
    typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
  )

  useEffect(() => {
    if (!isSupported.current) return

    const handleOrientation = (e) => {
      const { beta, gamma } = e
      // beta: front-back tilt [-180,180], gamma: left-right tilt [-90,90]
      const x = Math.max(-1, Math.min(1, (beta ?? 0) / 90))
      const y = Math.max(-1, Math.min(1, (gamma ?? 0) / 45))

      rotateX.set(-x * strength)
      rotateY.set(y * strength)
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [rotateX, rotateY, strength])

  return { rotateX, rotateY, isSupported: isSupported.current }
}
