import { useState, useEffect, useRef } from 'react'

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))
  const intervalRef = useRef(null)

  function getTimeLeft(target) {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false }
    const now = new Date().getTime()
    const end = new Date(target).getTime()
    const diff = end - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isOver: false,
    }
  }

  useEffect(() => {
    if (!targetDate) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    // Pause when tab hidden
    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current)
      } else {
        intervalRef.current = setInterval(() => {
          setTimeLeft(getTimeLeft(targetDate))
        }, 1000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [targetDate])

  return timeLeft
}
