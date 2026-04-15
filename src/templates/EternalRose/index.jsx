import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useParallax } from '../../hooks/useParallax'
import { useGyroscope } from '../../hooks/useGyroscope'
import FloatingPetals from '../../components/ui/FloatingPetals'
import MusicPlayer from '../../components/ui/MusicPlayer'
import StickyNav from '../../components/ui/StickyNav'
import LoadingScreen from '../../components/ui/LoadingScreen'
import CountdownTimer from '../../components/guest/CountdownTimer'
import OurStory from '../../components/guest/OurStory'
import EventSchedule from '../../components/guest/EventSchedule'
import PhotoGallery from '../../components/guest/PhotoGallery'
import DressCode from '../../components/guest/DressCode'
import RSVPForm from '../../components/guest/RSVPForm'
import WishesWall from '../../components/guest/WishesWall'
import ShareSection from '../../components/guest/ShareSection'
import { useState } from 'react'
import { gsap } from 'gsap'

const COLORS = {
  blush: '#F4C6C6',
  cream: '#FFF8F0',
  roseGold: '#B76E79',
  burgundy: '#6B2D3E',
}

export default function EternalRose({ wedding, guest, isPersonalized }) {
  const [loaded, setLoaded] = useState(false)
  const namesRef = useRef(null)
  const { containerRef, rotateX, rotateY } = useParallax(12)
  const { rotateX: gyroX, rotateY: gyroY } = useGyroscope(12)

  const primaryColor = wedding?.primary_color || COLORS.roseGold
  const secondaryColor = wedding?.secondary_color || COLORS.burgundy

  // Touch detection for gyroscope vs mouse
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const tiltX = isMobile ? gyroX : rotateX
  const tiltY = isMobile ? gyroY : rotateY

  useEffect(() => {
    if (!loaded || !namesRef.current) return
    const chars = namesRef.current.querySelectorAll('.char')
    gsap.fromTo(chars,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }, [loaded])

  const splitName = (name) =>
    name?.split('').map((ch, i) => (
      <span key={i} className="char inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
    ))

  const weddingDate = wedding?.wedding_date ? new Date(wedding.wedding_date) : null
  const day = weddingDate?.toLocaleDateString('en-US', { day: 'numeric' })
  const month = weddingDate?.toLocaleDateString('en-US', { month: 'long' })
  const weekday = weddingDate?.toLocaleDateString('en-US', { weekday: 'long' })

  const bgStyle = {
    background: `radial-gradient(ellipse at 20% 10%, ${COLORS.blush}60 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 90%, ${COLORS.blush}40 0%, transparent 50%),
                 ${COLORS.cream}`,
  }

  return (
    <div style={{ fontFamily: 'Lato, sans-serif', background: COLORS.cream, minHeight: '100vh' }}>
      <Helmet>
        <title>{isPersonalized
          ? `${guest?.name}'s Invitation — ${wedding?.groom_name} & ${wedding?.bride_name}`
          : `You're Invited — ${wedding?.groom_name} & ${wedding?.bride_name}`}
        </title>
        <meta property="og:title" content={`You're Invited — ${wedding?.bride_name} & ${wedding?.groom_name}`} />
        <meta property="og:description" content={`Join us on ${month} ${day} at ${wedding?.reception_venue}`} />
        {wedding?.cover_photo_url && <meta property="og:image" content={wedding.cover_photo_url} />}
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      {/* Loading screen */}
      <LoadingScreen
        onComplete={() => setLoaded(true)}
        coupleName={`${wedding?.groom_name} & ${wedding?.bride_name}`}
      />

      {!loaded && <div className="h-screen" />}

      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          {/* Particles */}
          <FloatingPetals template="EternalRose" />

          {/* Sticky nav */}
          <StickyNav accentColor={primaryColor} />

          {/* Music player */}
          {wedding?.background_music_url && <MusicPlayer src={wedding.background_music_url} />}

          {/* WhatsApp CTA */}
          {wedding?.rsvp_contact && (
            <a
              href={`https://wa.me/${wedding.rsvp_contact.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl"
              style={{ background: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L.057 24l6.306-1.634A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.49-5.2-1.346l-.373-.22-3.744.97.997-3.634-.243-.386A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </a>
          )}

          {/* ── HERO ─────────────────────────────────────────────── */}
          <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-12"
            style={bgStyle}
          >
            {/* Rose border decoration */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23B76E7915'/%3E%3C/svg%3E")`,
            }} />

            <div className="relative z-10 max-w-2xl w-full text-center">
              {/* Personalized label */}
              {isPersonalized && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <p className="text-xs tracking-[0.4em] uppercase text-rose-400 font-lato mb-1">
                    Exclusive Invitation For
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-playfair italic text-rose-700">
                    {guest?.name}
                  </h1>
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mt-1">
                    Together with their families
                  </p>
                </motion.div>
              )}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${primaryColor})` }} />
                <span style={{ color: primaryColor }}>❧</span>
                <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${primaryColor})` }} />
              </motion.div>

              {/* Couple names */}
              <div ref={namesRef}>
                {wedding?.groom2_name && wedding?.bride2_name ? (
                  // Double wedding
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-right">
                      <p className="text-3xl sm:text-5xl font-playfair italic" style={{ color: secondaryColor }}>
                        {splitName(wedding.groom_name)}
                      </p>
                      <p className="text-sm font-lato tracking-widest text-gray-500 mt-1">&</p>
                      <p className="text-3xl sm:text-5xl font-playfair italic" style={{ color: primaryColor }}>
                        {splitName(wedding.bride_name)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-3xl" style={{ color: primaryColor }}>🤍</span>
                    </div>
                    <div className="text-left col-start-2">
                      <p className="text-3xl sm:text-5xl font-playfair italic" style={{ color: secondaryColor }}>
                        {splitName(wedding.groom2_name)}
                      </p>
                      <p className="text-sm font-lato tracking-widest text-gray-500 mt-1">&</p>
                      <p className="text-3xl sm:text-5xl font-playfair italic" style={{ color: primaryColor }}>
                        {splitName(wedding.bride2_name)}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Single wedding
                  <div className="mb-4">
                    <h2 className="text-4xl sm:text-6xl font-playfair italic mb-2" style={{ color: secondaryColor }}>
                      {splitName(wedding?.groom_name)}
                    </h2>
                    <p className="text-lg font-cormorant text-gray-400 tracking-widest mb-2">& </p>
                    <h2 className="text-4xl sm:text-6xl font-playfair italic" style={{ color: primaryColor }}>
                      {splitName(wedding?.bride_name)}
                    </h2>
                  </div>
                )}
              </div>

              {/* Date box */}
              {weddingDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-8 inline-grid grid-cols-3 border-2 rounded-2xl overflow-hidden"
                  style={{ borderColor: primaryColor + '40' }}
                >
                  <div className="px-5 py-4 border-r text-center" style={{ borderColor: primaryColor + '30' }}>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">{month}</p>
                    <p className="text-xs text-gray-400 mt-1">{weekday}</p>
                  </div>
                  <div className="px-6 py-4 text-center" style={{ background: primaryColor + '15' }}>
                    <p className="text-5xl font-cormorant font-bold" style={{ color: primaryColor }}>{day}</p>
                  </div>
                  <div className="px-5 py-4 border-l text-center" style={{ borderColor: primaryColor + '30' }}>
                    <p className="text-sm font-bold text-gray-700">{wedding?.reception_time || wedding?.ceremony_time}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {wedding?.reception_time ? 'Reception' : 'Ceremony'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Venue */}
              {(wedding?.reception_venue || wedding?.ceremony_venue) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-4 text-sm font-lato text-gray-500 flex items-center justify-center gap-2"
                >
                  <span style={{ color: primaryColor }}>📍</span>
                  {wedding?.reception_venue || wedding?.ceremony_venue}
                </motion.p>
              )}

              {/* 3D Portrait */}
              {(wedding?.cover_photo_cutout_url || wedding?.cover_photo_url) && (
                <motion.div
                  ref={containerRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
                  className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto mt-8"
                >
                  <motion.div
                    style={{
                      rotateX: tiltX,
                      rotateY: tiltY,
                      transformStyle: 'preserve-3d',
                    }}
                    className="w-full h-full relative"
                  >
                    {/* Layer 1: blurred background */}
                    <div
                      className="absolute inset-0 rounded-3xl blur-xl"
                      style={{
                        background: `radial-gradient(ellipse, ${primaryColor}40, transparent)`,
                        transform: 'translateZ(0px)',
                      }}
                    />
                    {/* Layer 2: decorative SVG frame */}
                    <div
                      className="absolute inset-2 rounded-3xl border-2 opacity-30"
                      style={{ borderColor: primaryColor, transform: 'translateZ(20px)' }}
                    />
                    {/* Layer 3: cutout photo */}
                    <img
                      src={wedding.cover_photo_cutout_url || wedding.cover_photo_url}
                      alt="Couple"
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{
                        transform: 'translateZ(40px)',
                        filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.4))',
                      }}
                    />
                    {/* Glossy shine */}
                    <div
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
                        transform: 'translateZ(45px)',
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Scroll arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ delay: 1.5, y: { duration: 1.5, repeat: Infinity } }}
                className="mt-10 flex justify-center"
              >
                <span className="text-2xl" style={{ color: primaryColor + '80' }}>↓</span>
              </motion.div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center justify-center py-8 px-4">
            <div className="h-px flex-1 max-w-xs" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}40)` }} />
            <span className="mx-4 text-xl" style={{ color: primaryColor }}>🌹</span>
            <div className="h-px flex-1 max-w-xs" style={{ background: `linear-gradient(to left, transparent, ${primaryColor}40)` }} />
          </div>

          {/* Sections */}
          <CountdownTimer weddingDate={wedding?.wedding_date} primaryColor={primaryColor} />

          <OurStory story={wedding?.our_story} primaryColor={primaryColor} />

          <EventSchedule wedding={wedding} primaryColor={primaryColor} />

          <PhotoGallery images={wedding?.gallery_urls} primaryColor={primaryColor} />

          <DressCode
            dressCode={wedding?.dress_code}
            colors={wedding?.dress_code_colors}
            primaryColor={primaryColor}
          />

          <RSVPForm
            wedding={wedding}
            guest={guest}
            isPersonalized={isPersonalized}
            primaryColor={primaryColor}
          />

          <WishesWall wedding={wedding} primaryColor={primaryColor} />

          <ShareSection wedding={wedding} primaryColor={primaryColor} />

          {/* Footer */}
          <footer className="py-12 px-4 text-center border-t" style={{ borderColor: primaryColor + '20', background: COLORS.cream }}>
            <p className="font-playfair italic text-2xl mb-1" style={{ color: primaryColor }}>
              {wedding?.groom_name} & {wedding?.bride_name}
            </p>
            {weddingDate && (
              <p className="text-gray-400 text-sm font-lato">
                {weddingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            <p className="text-gray-300 text-xs mt-4">With love & joy ✨</p>
            <p className="text-gray-300 text-xs mt-1">Crafted by Wedzo</p>
          </footer>
        </motion.div>
      )}
    </div>
  )
}
