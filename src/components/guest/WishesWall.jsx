import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wishesAPI } from '../../api/client'

function WishCard({ wish, delay = 0 }) {
  const initials = wish.guest_name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  const hues = [355, 30, 200, 270, 130]
  const hue = hues[(wish.guest_name.charCodeAt(0) || 0) % hues.length]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: `hsl(${hue}, 60%, 55%)` }}
        >
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{wish.guest_name}</p>
          <p className="text-xs text-gray-400">
            {new Date(wish.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed font-lato italic">"{wish.wish_message}"</p>
    </motion.div>
  )
}

export default function WishesWall({ wedding, primaryColor = '#B76E79', style }) {
  const [wishes, setWishes] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef(null)

  const fetchWishes = async () => {
    if (!wedding?.id) return
    try {
      const res = await wishesAPI.list(wedding.id)
      setWishes(res.data)
    } catch (e) {}
  }

  useEffect(() => {
    fetchWishes()
    intervalRef.current = setInterval(fetchWishes, 30000)
    return () => clearInterval(intervalRef.current)
  }, [wedding?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setLoading(true)
    try {
      await wishesAPI.post({ wedding_id: wedding.id, guest_name: name, wish_message: message })
      setName('')
      setMessage('')
      fetchWishes()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="wishes" className="py-20 px-4" style={style}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl sm:text-4xl font-playfair italic mb-4 text-gray-800"
      >
        Wishes Wall
      </motion.h2>
      <p className="text-center text-gray-400 text-sm mb-10 font-lato">
        Leave your heartfelt wishes for the couple
      </p>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-rose-300 mb-3 font-lato"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your wish..."
          rows={3}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-rose-300 mb-3 font-lato text-sm resize-none"
        />
        <button
          type="submit"
          disabled={loading || !name.trim() || !message.trim()}
          className="w-full py-3 rounded-full font-semibold text-white transition disabled:opacity-40"
          style={{ background: primaryColor }}
        >
          {loading ? 'Sending...' : '💌 Send Wish'}
        </button>
      </form>

      {/* Wishes masonry grid */}
      {wishes.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-5xl mx-auto">
          <AnimatePresence>
            {wishes.map((wish, i) => (
              <div key={wish.id} className="break-inside-avoid mb-4">
                <WishCard wish={wish} delay={i < 6 ? i * 0.05 : 0} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
