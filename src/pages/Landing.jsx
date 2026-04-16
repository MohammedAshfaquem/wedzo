import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ─── Cursor glow tracker ─── */
function CursorGlow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 80, damping: 20 })
  const sy = useSpring(y, { stiffness: 80, damping: 20 })
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <motion.div
      className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full"
      style={{
        left: sx, top: sy,
        x: '-50%', y: '-50%',
        background: 'radial-gradient(circle, rgba(183,110,121,0.12) 0%, transparent 70%)',
      }}
    />
  )
}

/* ─── Animated petal canvas ─── */
function PetalCanvas({ count = 55, colorA = 340, colorB = 370 }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: Math.random() * 1.0 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * (colorB - colorA) + colorA,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      wobble: Math.random() * 2,
      wobbleSpeed: Math.random() * 0.03,
      wobbleOffset: Math.random() * Math.PI * 2,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.wobbleOffset += p.wobbleSpeed
        p.x += p.speedX + Math.sin(p.wobbleOffset) * p.wobble * 0.05
        p.y += p.speedY
        p.angle += p.angleSpeed
        if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 65%, 80%, ${p.opacity})`
        ctx.fill()
        ctx.restore()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = () => {
          start += Math.ceil((to - start) / 12) || 1
          if (start >= to) { setVal(to); return }
          setVal(start)
          requestAnimationFrame(step)
        }
        step()
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Scroll reveal wrapper ─── */
function Reveal({ children, delay = 0, y = 30, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Magnetic button wrapper ─── */
function MagneticBtn({ children, className, to }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })
  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className="inline-block">
      <Link to={to} className={className}>{children}</Link>
    </motion.div>
  )
}

/* ─── Word-by-word animated heading ─── */
function AnimatedHeading({ text, italic, className }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-block mr-[0.25em] ${italic ? 'italic' : ''}`}
        >
          {w}
        </motion.span>
      ))}
    </span>
  )
}

const TEMPLATES = [
  { id: 'EternalRose', name: 'Eternal Rose', emoji: '🌹', bg: 'from-rose-200 via-pink-100 to-rose-50', accent: '#B76E79', desc: 'Blush & Rose Gold', textClass: 'text-rose-900' },
  { id: 'MidnightGarden', name: 'Midnight Garden', emoji: '🌿', bg: 'from-slate-800 via-emerald-900 to-slate-900', accent: '#D4AF37', desc: 'Deep Navy & Gold', dark: true },
  { id: 'GoldenHour', name: 'Golden Hour', emoji: '🌅', bg: 'from-amber-200 via-orange-100 to-yellow-50', accent: '#C4713E', desc: 'Warm Terracotta', textClass: 'text-amber-900' },
  { id: 'CelestialLove', name: 'Celestial Love', emoji: '✨', bg: 'from-indigo-900 via-purple-900 to-slate-900', accent: '#FFD700', desc: 'Cosmic & Stars', dark: true },
  { id: 'TropicalBloom', name: 'Tropical Bloom', emoji: '🌺', bg: 'from-emerald-200 via-lime-100 to-green-50', accent: '#FF6B6B', desc: 'Jungle & Coral', textClass: 'text-emerald-900' },
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
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <>
      <Helmet>
        <title>Wedzo — Beautiful Digital Wedding Invitations</title>
        <meta name="description" content="Create stunning digital wedding invitations with personalized guest links, RSVP tracking, beautiful templates, and WhatsApp blast." />
      </Helmet>

      <CursorGlow />

      <div className="min-h-screen bg-[#fdfaf8] font-lato overflow-x-hidden">

        {/* ── Nav ── */}
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-100/60"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-2 cursor-pointer">
              <motion.span
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                className="text-2xl"
              >💍</motion.span>
              <span className="font-playfair italic text-xl text-rose-700">Wedzo</span>
            </motion.div>
            <div className="flex items-center gap-4">
              <Link to="/templates" className="text-sm text-gray-500 hover:text-rose-500 transition-colors hidden sm:block">Templates</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link to="/admin" className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors shadow-md shadow-rose-200">
                  Admin Login
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.nav>

        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #fff8f8 40%, #fdf2ff 70%, #fff0f6 100%)' }}
        >
          <PetalCanvas count={60} />

          {/* floating rings */}
          {[120, 240, 380].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-rose-200/40 pointer-events-none"
              style={{ width: size, height: size, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4 + i * 1.5, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 backdrop-blur text-rose-600 text-xs font-semibold mb-8 border border-rose-200/50"
            >
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>✨</motion.span>
              Beautiful Digital Wedding Invitations
            </motion.div>

            <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl text-gray-900 leading-tight mb-4">
              <AnimatedHeading text="Your Love Story," />
              <br />
              <AnimatedHeading text="Beautifully Told" italic className="text-rose-500" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10"
            >
              Create stunning digital wedding invitations in minutes. Personalized guest links, RSVP tracking, WhatsApp blast, and 5 gorgeous templates.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <MagneticBtn
                to="/admin"
                className="px-9 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors shadow-xl shadow-rose-300/50 text-base inline-block"
              >
                Create Your Invitation →
              </MagneticBtn>
              <MagneticBtn
                to="/templates"
                className="px-9 py-4 rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition-colors text-base inline-block"
              >
                View Templates
              </MagneticBtn>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="relative z-10 mt-16 flex flex-wrap gap-10 justify-center"
          >
            {[['500', '+', 'Weddings Created'], ['50000', '+', 'Guests Invited'], ['98', '%', 'Happy Couples']].map(([num, sfx, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-rose-500 font-playfair">
                  <Counter to={parseInt(num)} suffix={sfx} />
                </div>
                <div className="text-xs text-gray-400 mt-1 tracking-wide uppercase">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 text-xs"
          >
            <span className="tracking-widest uppercase text-[10px]">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-0.5 h-7 bg-gradient-to-b from-rose-300 to-transparent rounded-full"
            />
          </motion.div>
        </section>

        {/* ── Marquee strip ── */}
        <div className="bg-rose-500 text-white py-3 overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-10 whitespace-nowrap"
          >
            {Array(4).fill(['🌹 Eternal Rose', '🌿 Midnight Garden', '🌅 Golden Hour', '✨ Celestial Love', '🌺 Tropical Bloom', '💍 RSVP Tracking', '📱 WhatsApp Blast', '🎵 Background Music']).flat().map((item, i) => (
              <span key={i} className="text-sm font-medium px-6">{item}</span>
            ))}
          </motion.div>
        </div>

        {/* ── Templates ── */}
        <section className="py-28 px-6 bg-[#fdfaf8] overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3 block">Our Designs</span>
              <h2 className="font-playfair text-4xl sm:text-5xl text-gray-900 mb-4">5 Stunning Templates</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Each template is crafted with custom animations, particles, and a unique personality.</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${t.bg} p-8 shadow-lg cursor-pointer group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="text-5xl mb-4 inline-block"
                  >{t.emoji}</motion.div>
                  <h3 className={`font-semibold text-lg mb-1 ${t.dark ? 'text-white' : (t.textClass || 'text-gray-800')}`}>{t.name}</h3>
                  <p className={`text-sm ${t.dark ? 'text-white/60' : 'text-gray-500'}`}>{t.desc}</p>
                  <motion.div
                    whileHover={{ width: 64 }}
                    className="mt-4 h-1 rounded-full w-8 transition-all duration-300"
                    style={{ background: t.accent }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Two Modes ── */}
        <section className="py-28 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3 block">Flexibility</span>
              <h2 className="font-playfair text-4xl sm:text-5xl text-gray-900 mb-4">Two Invitation Modes</h2>
              <p className="text-gray-500">Choose the style that fits your wedding.</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: '🎯', title: 'Personalized Mode',
                  features: ['Unique URL per guest', 'Name pre‑filled in invitation', 'WhatsApp blast tool', 'Individual RSVP tracking', 'Guest list CSV import'],
                  gradient: 'from-purple-50 to-violet-50', border: 'border-purple-100', accent: '#7C3AED', shadow: 'shadow-purple-100',
                },
                {
                  icon: '📨', title: 'General Mode',
                  features: ['Single link for everyone', 'Guests enter their own name', 'Easy social media sharing', 'Open RSVP collection', 'Wishes wall for all'],
                  gradient: 'from-blue-50 to-cyan-50', border: 'border-blue-100', accent: '#2563EB', shadow: 'shadow-blue-100',
                },
              ].map((mode, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`rounded-3xl bg-gradient-to-br ${mode.gradient} p-8 shadow-xl ${mode.shadow} border ${mode.border} h-full`}
                  >
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i }} className="text-4xl mb-4 inline-block">{mode.icon}</motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-5">{mode.title}</h3>
                    <ul className="space-y-3">
                      {mode.features.map((f, fi) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: fi * 0.07 }}
                          className="flex items-center gap-3 text-sm text-gray-600"
                        >
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: mode.accent }}>✓</span>
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #fdf4ff 100%)' }}>
          <PetalCanvas count={25} colorA={300} colorB={360} />
          <div className="max-w-5xl mx-auto relative z-10">
            <Reveal className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3 block">Features</span>
              <h2 className="font-playfair text-4xl sm:text-5xl text-gray-900 mb-4">Everything You Need</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5 }}
                  className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-sm border border-white/80 group cursor-default"
                >
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-3xl mb-3 inline-block">{f.icon}</motion.div>
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-rose-600 transition-colors">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-28 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase mb-3 block">Simple Process</span>
              <h2 className="font-playfair text-4xl sm:text-5xl text-gray-900 mb-4">Up &amp; Running in Minutes</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200" />
              {HOW_IT_WORKS.map((step, i) => (
                <Reveal key={i} delay={i * 0.18} className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center text-lg font-bold mx-auto mb-5 shadow-lg shadow-rose-200 relative z-10"
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 px-6 bg-rose-50">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <h2 className="font-playfair text-3xl sm:text-4xl text-gray-900">Loved by Couples</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { quote: 'Our guests were amazed! The personalized links made everyone feel so special.', couple: 'Aisha & Rahul', template: 'Eternal Rose' },
                { quote: 'We sent 200 WhatsApp invites in minutes. Absolutely magical experience!', couple: 'Meera & Arjun', template: 'Celestial Love' },
                { quote: 'The Midnight Garden template is stunning. Everyone asked where we made it!', couple: 'Sofia & Carlos', template: 'Midnight Garden' },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 h-full flex flex-col">
                    <div className="text-rose-300 text-4xl font-playfair mb-3">&ldquo;</div>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{t.quote}</p>
                    <div className="mt-4 pt-4 border-t border-rose-50">
                      <div className="font-semibold text-sm text-gray-800">{t.couple}</div>
                      <div className="text-xs text-rose-400">{t.template} template</div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-6 relative overflow-hidden text-white text-center">
          <motion.div
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #b76e79, #e11d48, #9333ea, #b76e79)', backgroundSize: '300% 300%' }}
          />
          <PetalCanvas count={30} colorA={0} colorB={30} />
          {['💍', '🌹', '🕊️', '✨', '💐'].map((em, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
              className="absolute text-5xl opacity-20 pointer-events-none"
              style={{ left: `${10 + i * 20}%`, top: `${20 + (i % 2) * 40}%` }}
            >{em}</motion.div>
          ))}
          <div className="relative z-10 max-w-2xl mx-auto">
            <Reveal><h2 className="font-playfair text-5xl sm:text-6xl mb-6">Ready to Begin?</h2></Reveal>
            <Reveal delay={0.1}><p className="text-white/80 mb-10 text-lg">Create your beautiful digital wedding invitation today.</p></Reveal>
            <Reveal delay={0.2}>
              <MagneticBtn to="/admin" className="px-12 py-5 rounded-2xl bg-white text-rose-500 font-bold text-lg hover:bg-rose-50 transition-colors shadow-2xl inline-block">
                Get Started Free →
              </MagneticBtn>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-gray-950 text-gray-400 py-10 text-center text-sm">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">💍</span>
            <span className="font-playfair italic text-white text-lg">Wedzo</span>
          </motion.div>
          <p>Made with ❤️ for every couple's special day.</p>
          <p className="text-gray-600 text-xs mt-2">© {new Date().getFullYear()} Wedzo. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
