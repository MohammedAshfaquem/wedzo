import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ─── Sample wedding data for demo ─── */
const SAMPLE_WEDDING = {
  groom_name: 'Ahmad Fariz',
  bride_name: 'Siti Nurhaliza',
  wedding_date: '2025-12-20',
  ceremony_time: '10:00',
  ceremony_venue: 'Grand Ballroom, Hilton Kuala Lumpur',
  ceremony_address: '3 Jalan Stesen Sentral, KL Sentral, 50470 Kuala Lumpur',
  ceremony_maps_url: 'https://maps.google.com',
  reception_time: '19:00',
  reception_venue: 'Dewan Serbaguna Angkasapuri',
  reception_address: 'Bukit Putra, 50614 Kuala Lumpur',
  couple_story: 'We met at university during orientation week. He tripped carrying a stack of books, and she helped him pick them all up. The rest, as they say, is history.',
  dress_code_note: 'Smart Casual — Pastel tones preferred',
  dress_code_colors: ['#F8C8D4', '#E8B4A0', '#D4A0C4', '#B4C8E8'],
  contact_phone: '+60123456789',
  music_url: null,
  gallery_urls: [],
  couple_photo_cutout: null,
  invitation_mode: 'personalized',
  slug: 'ahmad-siti',
  is_active: true,
  id: 'demo',
}

const SAMPLE_GUEST = {
  name: 'Azri Hakim',
  slug: 'azri-hakim',
}

const TEMPLATES = [
  { id: 'EternalRose', name: 'Eternal Rose', emoji: '🌹', desc: 'Blush & Rose Gold', bg: 'bg-gradient-to-br from-rose-100 to-pink-50' },
  { id: 'MidnightGarden', name: 'Midnight Garden', emoji: '🌿', desc: 'Deep Navy & Gold', bg: 'bg-gradient-to-br from-slate-800 to-emerald-900 text-white', dark: true },
  { id: 'GoldenHour', name: 'Golden Hour', emoji: '🌅', desc: 'Warm Terracotta', bg: 'bg-gradient-to-br from-amber-100 to-orange-50' },
  { id: 'CelestialLove', name: 'Celestial Love', emoji: '✨', desc: 'Cosmic & Stars', bg: 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white', dark: true },
  { id: 'TropicalBloom', name: 'Tropical Bloom', emoji: '🌺', desc: 'Jungle & Coral', bg: 'bg-gradient-to-br from-emerald-100 to-lime-50' },
]

export default function TemplateGallery() {
  const [active, setActive] = useState(null)

  return (
    <>
      <Helmet>
        <title>Template Gallery — Wedzo</title>
        <meta name="description" content="Browse all 5 beautiful wedding invitation templates available on Wedzo." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-playfair italic text-xl text-rose-700">Wedzo</span>
          </Link>
          <Link to="/admin" className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition">
            Create Invitation
          </Link>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-14">
            <h1 className="font-playfair text-5xl text-gray-900 mb-4">Template Gallery</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Each template is handcrafted with custom animations, particle effects, and a unique atmosphere.
              Click any template to preview it with sample data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => setActive(t)}
              >
                {/* Template card preview */}
                <div className={`${t.bg} h-52 flex flex-col items-center justify-center relative overflow-hidden`}>
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">{t.emoji}</div>
                  <p className={`font-playfair italic text-xl ${t.dark ? 'text-white' : 'text-gray-800'}`}>
                    Ahmad &amp; Siti
                  </p>
                  <p className={`text-xs mt-1 ${t.dark ? 'text-white/60' : 'text-gray-400'}`}>20 December 2025</p>
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="px-5 py-2 rounded-xl bg-white text-gray-800 text-sm font-semibold">Preview</span>
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="font-semibold text-gray-800 text-lg">{t.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview modal */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
              >
                <div className={`${active.bg} h-48 flex flex-col items-center justify-center`}>
                  <div className="text-5xl mb-2">{active.emoji}</div>
                  <p className={`font-playfair italic text-2xl ${active.dark ? 'text-white' : 'text-gray-800'}`}>
                    Ahmad &amp; Siti
                  </p>
                  <p className={`text-sm mt-1 ${active.dark ? 'text-white/60' : 'text-gray-400'}`}>20 December 2025</p>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-playfair text-2xl text-gray-800 mb-2">{active.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{active.desc}</p>
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/wedding/ahmad-siti`}
                      className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
                      onClick={() => setActive(null)}
                    >
                      View Live Demo
                    </Link>
                    <button
                      onClick={() => setActive(null)}
                      className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
