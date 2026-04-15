import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PhotoGallery({ images = [], primaryColor = '#B76E79', style }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  if (!images || images.length === 0) return null

  const prev = () => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  const next = () => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0))

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightboxIndex(null)
  }

  return (
    <section id="gallery" className="py-20 px-4" style={style}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl sm:text-4xl font-playfair italic mb-12 text-gray-800"
      >
        Photo Gallery
      </motion.h2>

      {/* Masonry grid */}
      <div
        className="columns-2 sm:columns-3 gap-3 max-w-4xl mx-auto"
        style={{ columnGap: '12px' }}
      >
        {images.map((url, i) => (
          <motion.div
            key={url + i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="group relative overflow-hidden rounded-xl mb-3 cursor-pointer break-inside-avoid"
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={url}
              alt={`Gallery photo ${i + 1}`}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-3xl">
                🤍
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white text-3xl p-3 hover:bg-white/10 rounded-full"
            >
              ‹
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={images[lightboxIndex]}
              alt="Full photo"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white text-3xl p-3 hover:bg-white/10 rounded-full"
            >
              ›
            </button>

            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white text-xl p-3 hover:bg-white/10 rounded-full"
            >
              ✕
            </button>

            <p className="absolute bottom-4 text-white/60 text-sm">
              {lightboxIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
