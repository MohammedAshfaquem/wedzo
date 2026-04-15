import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'story', label: 'Our Story' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'dresscode', label: 'Dress Code' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'wishes', label: 'Wishes' },
  { id: 'share', label: 'Share' },
]

export default function StickyNav({ accentColor = '#B76E79' }) {
  const [activeId, setActiveId] = useState('hero')

  useEffect(() => {
    const observers = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 hidden md:flex">
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          title={label}
          className="group relative flex items-center justify-end"
        >
          {/* Tooltip */}
          <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            {label}
          </span>

          <motion.div
            animate={{
              width: activeId === id ? 12 : 8,
              height: activeId === id ? 12 : 8,
              backgroundColor: activeId === id ? accentColor : 'rgba(255,255,255,0.5)',
            }}
            className="rounded-full border"
            style={{ borderColor: activeId === id ? accentColor : 'rgba(255,255,255,0.4)' }}
          />
        </button>
      ))}
    </nav>
  )
}
