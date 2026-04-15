import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCountdown } from '../../hooks/useCountdown'

function FlipDigit({ value }) {
  const prev = useRef(value)
  const changed = prev.current !== value
  prev.current = value

  return (
    <div className="relative w-14 h-16 sm:w-16 sm:h-20 overflow-hidden perspective-[300px]">
      <motion.span
        key={value}
        initial={{ rotateX: changed ? 90 : 0 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-cormorant font-semibold"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
    </div>
  )
}

export default function CountdownTimer({ weddingDate, primaryColor = '#B76E79', style }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(weddingDate)

  if (isOver) {
    return (
      <section id="countdown" className="py-16 px-4 text-center" style={style}>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-playfair"
          style={{ color: primaryColor }}
        >
          Today is the Day! 🎊
        </motion.p>
      </section>
    )
  }

  const units = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HOURS' },
    { value: minutes, label: 'MINS' },
    { value: seconds, label: 'SECS' },
  ]

  return (
    <section id="countdown" className="py-16 px-4 text-center" style={style}>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs tracking-[0.3em] uppercase mb-8 opacity-60"
        style={{ fontFamily: 'Lato, sans-serif' }}
      >
        Countdown to Reception
      </motion.p>

      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {units.map(({ value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <div
              className="flex items-center justify-center w-16 h-18 sm:w-20 sm:h-22 rounded-xl border-2 bg-white/50"
              style={{ borderColor: primaryColor + '40' }}
            >
              <FlipDigit value={value} />
            </div>
            <span
              className="text-[10px] tracking-widest uppercase mt-2 font-lato"
              style={{ color: primaryColor }}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
