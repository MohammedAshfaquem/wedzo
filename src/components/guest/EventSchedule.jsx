import { useState } from 'react'
import { motion } from 'framer-motion'

function VenueCard({ type, time, venue, address, mapsUrl, icon, primaryColor }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flip-card w-full max-w-sm mx-auto h-64 cursor-pointer">
      <motion.div
        className="flip-card-inner relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0.2, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* FRONT */}
        <div
          className="flip-card-front absolute inset-0 rounded-2xl border-2 bg-white shadow-xl flex flex-col items-center justify-center p-6"
          style={{ borderColor: primaryColor + '40', backfaceVisibility: 'hidden' }}
        >
          <div
            className="text-4xl mb-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: primaryColor + '20' }}
          >
            {icon}
          </div>
          <p className="text-xs tracking-[0.2em] uppercase opacity-60 mb-1 font-lato">{type}</p>
          <h3 className="font-playfair text-xl font-semibold text-center mb-1 text-gray-800">
            {venue}
          </h3>
          <p className="text-sm font-semibold" style={{ color: primaryColor }}>
            {time}
          </p>
          <p className="text-xs text-gray-400 mt-3">Tap to see details</p>
        </div>

        {/* BACK */}
        <div
          className="flip-card-back absolute inset-0 rounded-2xl border-2 bg-white shadow-xl flex flex-col items-center justify-center p-6 text-center"
          style={{
            borderColor: primaryColor + '40',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="font-playfair text-lg font-semibold text-gray-800 mb-2">{venue}</p>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{address}</p>

          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition"
              style={{ background: primaryColor }}
            >
              📍 Get Directions
            </a>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setFlipped(false) }}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600"
          >
            ← Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function EventSchedule({ wedding, primaryColor = '#B76E79', style }) {
  return (
    <section id="schedule" className="py-20 px-4" style={style}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl sm:text-4xl font-playfair italic mb-4 text-gray-800"
      >
        Event Details
      </motion.h2>
      <p className="text-center text-gray-400 text-sm mb-12 font-lato">Tap cards to see full details</p>

      <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
        {wedding?.ceremony_venue && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <VenueCard
              type="Ceremony"
              icon="🕌"
              time={wedding.ceremony_time}
              venue={wedding.ceremony_venue}
              address={wedding.ceremony_address}
              mapsUrl={wedding.ceremony_maps_url}
              primaryColor={primaryColor}
            />
          </motion.div>
        )}

        {wedding?.reception_venue && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex-1"
          >
            <VenueCard
              type="Reception"
              icon="🎀"
              time={wedding.reception_time}
              venue={wedding.reception_venue}
              address={wedding.reception_address}
              mapsUrl={wedding.reception_maps_url}
              primaryColor={primaryColor}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
