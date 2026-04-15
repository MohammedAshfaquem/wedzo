import { motion } from 'framer-motion'

const TEMPLATES = [
  {
    id: 'EternalRose',
    name: 'Eternal Rose',
    palette: ['#F8E8EE', '#B76E79', '#D4AF37', '#8B0000'],
    description: 'Blush & Rose Gold — Timeless elegance with floral motifs',
    preview: '🌹',
    fonts: 'Playfair Display',
  },
  {
    id: 'MidnightGarden',
    name: 'Midnight Garden',
    palette: ['#1A2A3A', '#2D4A3E', '#D4AF37', '#F5F0E8'],
    description: 'Deep Navy & Gold — Romantic botanical elegance',
    preview: '🌿',
    fonts: 'Cormorant Garamond',
  },
  {
    id: 'GoldenHour',
    name: 'Golden Hour',
    palette: ['#F5DEB3', '#C4713E', '#6B4226', '#FFFFF0'],
    description: 'Warm Terracotta — Sunset warmth and earthy tones',
    preview: '🌅',
    fonts: 'Libre Baskerville',
  },
  {
    id: 'CelestialLove',
    name: 'Celestial Love',
    palette: ['#0D0D2B', '#2A1A5E', '#FFD700', '#C0C0C0'],
    description: 'Deep Space & Stars — Mystical cosmic romance',
    preview: '✨',
    fonts: 'Cinzel',
  },
  {
    id: 'TropicalBloom',
    name: 'Tropical Bloom',
    palette: ['#1B4332', '#FF6B6B', '#FFE66D', '#FFFFFF'],
    description: 'Jungle & Coral — Vibrant tropical paradise',
    preview: '🌺',
    fonts: 'Pacifico',
  },
]

export default function TemplateSelector({ value, onChange }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Choose a template for this wedding invitation:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(t.id)}
            className={`relative cursor-pointer rounded-2xl border-2 p-5 transition ${
              value === t.id ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200 hover:border-rose-300'
            }`}
          >
            {value === t.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
            )}
            {/* Palette swatch */}
            <div className="flex gap-1 mb-4">
              {t.palette.map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border border-white/50 shadow-sm"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="text-3xl mb-2">{t.preview}</div>
            <h3 className="font-semibold text-gray-800">{t.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{t.description}</p>
            <p className="text-xs text-gray-400 mt-2 italic">{t.fonts}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
