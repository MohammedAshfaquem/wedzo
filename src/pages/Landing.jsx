import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ─── Floating canvas petals ─── */
function HeroPetals() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 30 + 340,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width }
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, p.x * 0.01, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.opacity})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

const TEMPLATES = [
  { id: 'EternalRose', name: 'Eternal Rose', emoji: '🌹', bg: 'from-rose-100 to-pink-50', accent: '#B76E79', desc: 'Blush & Rose Gold' },
  { id: 'MidnightGarden', name: 'Midnight Garden', emoji: '🌿', bg: 'from-slate-800 to-emerald-900', accent: '#D4AF37', desc: 'Deep Navy & Gold', dark: true },
  { id: 'GoldenHour', name: 'Golden Hour', emoji: '🌅', bg: 'from-amber-100 to-orange-50', accent: '#C4713E', desc: 'Warm Terracotta' },
  { id: 'CelestialLove', name: 'Celestial Love', emoji: '✨', bg: 'from-indigo-900 to-purple-900', accent: '#FFD700', desc: 'Cosmic & Stars', dark: true },
  { id: 'TropicalBloom', name: 'Tropical Bloom', emoji: '🌺', bg: 'from-emerald-100 to-lime-50', accent: '#FF6B6B', desc: 'Jungle & Coral' },
]

const FEATURES = [
  { icon: '🎯', title: 'Personalized Invitations', desc: 'Each guest gets a unique link with their name pre-filled. Track who opened what and follow up easily.' },
  { icon: '📱', title: 'WhatsApp Blast', desc: 'Send personalized invitation links directly via WhatsApp to all your guests in one click.' },
  { icon: '💃', title: 'RSVP with Confetti', desc: 'Guests enjoy a beautiful animated RSVP experience — complete with confetti rain when they say yes!' },
  { icon: '🎨', title: '5 Stunning Templates', desc: 'Choose from Eternal Rose, Midnight Garden, Golden Hour, Celestial Love, or Tropical Bloom.' },
  { icon: '🎵', title: 'Background Music', desc: 'Set the mood with your favourite song playing as guests browse your invitation.' },
  { icon: '📸', title: 'Photo Gallery', desc: 'Upload up to 8 beautiful photos with our masonry gallery and AI-powered background removal on portrait shots.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Wedding', desc: 'Fill in your couple details, ceremony info, and upload your photos.' },
  { step: '02', title: 'Choose Template & Publish', desc: 'Pick a template, upload your song, and publish with one click.' },
  { step: '03', title: 'Share with Guests', desc: 'Copy your link or use our WhatsApp blast to send personalized invites instantly.' },
]

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>Wedzo — Beautiful Digital Wedding Invitations</title>
        <meta name="description" content="Create stunning digital wedding invitations with personalized guest links, RSVP tracking, beautiful templates, and WhatsApp blast." />
      </Helmet>

      <div className="min-h-screen bg-white font-lato overflow-x-hidden">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-rose-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💍</span>
              <span className="font-playfair italic text-xl text-rose-700">Wedzo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/templates" className="text-sm text-gray-500 hover:text-rose-500 transition hidden sm:block">Templates</Link>
              <Link to="/admin" className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition">
                Admin Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
          <HeroPetals />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold mb-6">
              ✨ Beautiful Digital Wedding Invitations
            </div>
            <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl text-gray-900 leading-tight mb-6">
              Your Love Story,
              <br />
              <span className="italic text-rose-500">Beautifully Told</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
              Create stunning digital wedding invitations in minutes. Personalized guest links, RSVP tracking, WhatsApp blast, and 5 gorgeous templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="px-8 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition shadow-lg shadow-rose-200"
              >
                Create Your Invitation →
              </Link>
              <Link
                to="/templates"
                className="px-8 py-4 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition"
              >
                View Templates
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10 mt-16 grid grid-cols-3 gap-8 text-center"
          >
            {[['500+', 'Weddings'], ['50K+', 'Guests Invited'], ['98%', 'Happy Couples']].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-rose-500">{num}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Templates preview */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-playfair text-4xl text-gray-900 mb-4">5 Stunning Templates</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Each template is carefully crafted with custom animations, particles, and a unique personality.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${t.bg} p-8 shadow-sm cursor-pointer`}
                >
                  <div className="text-5xl mb-4">{t.emoji}</div>
                  <h3 className={`font-semibold text-lg mb-1 ${t.dark ? 'text-white' : 'text-gray-800'}`}>{t.name}</h3>
                  <p className={`text-sm ${t.dark ? 'text-white/60' : 'text-gray-500'}`}>{t.desc}</p>
                  <div className="mt-4 w-8 h-1 rounded-full" style={{ background: t.accent }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Two Modes */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-playfair text-4xl text-gray-900 mb-4">Two Invitation Modes</h2>
              <p className="text-gray-500">Choose the style that fits your wedding.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: '🎯', title: 'Personalized Mode',
                  features: ['Unique URL per guest', 'Name pre-filled in invitation', 'WhatsApp blast tool', 'Individual RSVP tracking', 'Guest list CSV import'],
                  color: 'from-purple-50 to-violet-50',
                  accent: '#7C3AED',
                },
                {
                  icon: '📨', title: 'General Mode',
                  features: ['Single link for everyone', 'Guests enter their name', 'Easy to share on social media', 'Open RSVP collection', 'Wishes wall for all'],
                  color: 'from-blue-50 to-cyan-50',
                  accent: '#2563EB',
                },
              ].map((mode, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`rounded-3xl bg-gradient-to-br ${mode.color} p-8 shadow-sm`}
                >
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-5">{mode.title}</h3>
                  <ul className="space-y-3">
                    {mode.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs text-white" style={{ background: mode.accent }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 bg-rose-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-playfair text-4xl text-gray-900 mb-4">Everything You Need</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-playfair text-4xl text-gray-900 mb-4">Up &amp; Running in Minutes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-gradient-to-br from-rose-500 to-pink-500 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-8xl">💍</div>
            <div className="absolute bottom-10 right-10 text-8xl">🌹</div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-playfair text-4xl sm:text-5xl mb-6">Ready to Begin?</h2>
            <p className="text-white/80 mb-10 text-lg">Create your beautiful digital wedding invitation today.</p>
            <Link
              to="/admin"
              className="px-10 py-4 rounded-2xl bg-white text-rose-500 font-bold text-lg hover:bg-rose-50 transition shadow-lg inline-block"
            >
              Get Started →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">💍</span>
            <span className="font-playfair italic text-white text-base">Wedzo</span>
          </div>
          <p>Made with ❤️ for every couple's special day.</p>
        </footer>
      </div>
    </>
  )
}
