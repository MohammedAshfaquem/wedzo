import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const DEFAULT_MILESTONES = [
  { title: 'How We Met', icon: '✨' },
  { title: 'First Date', icon: '🌹' },
  { title: 'The Proposal', icon: '💍' },
  { title: 'Wedding Day', icon: '💒' },
]

export default function OurStory({ story, primaryColor = '#B76E79', style }) {
  if (!story) return null

  const sentences = story.split(/\.\s+/).filter(Boolean)
  const milestones = sentences.slice(0, 4).map((text, i) => ({
    ...DEFAULT_MILESTONES[i],
    text: text.trim() + (text.endsWith('.') ? '' : '.'),
  }))

  return (
    <section id="story" className="py-20 px-4 max-w-3xl mx-auto" style={style}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl sm:text-4xl font-playfair italic mb-16"
        style={{ color: primaryColor }}
      >
        Our Story
      </motion.h2>

      <div className="relative">
        {/* SVG connecting line */}
        <svg
          className="absolute left-6 top-0 bottom-0 hidden md:block"
          width="2"
          height="100%"
          style={{ height: '100%' }}
        >
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke={primaryColor}
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            initial={{ strokeDashoffset: 1000 }}
            whileInView={{ strokeDashoffset: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>

        <div className="space-y-12">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex gap-6 items-start"
            >
              {/* Dot */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl bg-white shadow-md z-10"
                style={{ borderColor: primaryColor }}
              >
                {m.icon}
              </div>

              <div className="flex-1 bg-white/80 rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3
                  className="font-playfair text-lg font-semibold mb-2"
                  style={{ color: primaryColor }}
                >
                  {m.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-lato">{m.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
