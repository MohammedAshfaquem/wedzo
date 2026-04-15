import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
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
import { useParallax } from '../../hooks/useParallax'
import { useGyroscope } from '../../hooks/useGyroscope'

const C = { jungle: '#1A3C34', coral: '#FF6B6B', yellow: '#FFE66D', white: '#FFFFFF' }

export default function TropicalBloom({ wedding, guest, isPersonalized }) {
  const [loaded, setLoaded] = useState(false)
  const namesRef = useRef(null)
  const { containerRef, rotateX, rotateY } = useParallax(10)
  const { rotateX: gx, rotateY: gy } = useGyroscope(10)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  const tx = isMobile ? gx : rotateX
  const ty = isMobile ? gy : rotateY
  const primaryColor = wedding?.primary_color || C.coral
  const weddingDate = wedding?.wedding_date ? new Date(wedding.wedding_date) : null

  useEffect(() => {
    if (!loaded || !namesRef.current) return
    const chars = namesRef.current.querySelectorAll('.char')
    gsap.fromTo(chars, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 })
  }, [loaded])

  const splitName = (name) => name?.split('').map((ch, i) => <span key={i} className="char inline-block">{ch === ' ' ? '\u00A0' : ch}</span>)

  return (
    <div style={{ fontFamily: '"Poppins", sans-serif', background: C.white, minHeight: '100vh' }}>
      <Helmet><title>{`You're Invited — ${wedding?.groom_name} & ${wedding?.bride_name}`}</title></Helmet>
      <LoadingScreen onComplete={() => setLoaded(true)} coupleName={`${wedding?.groom_name} & ${wedding?.bride_name}`} />
      {!loaded && <div className="h-screen" style={{ background: C.white }} />}
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FloatingPetals template="TropicalBloom" />
          <StickyNav accentColor={primaryColor} />
          {wedding?.background_music_url && <MusicPlayer src={wedding.background_music_url} />}
          {wedding?.rsvp_contact && (
            <a href={`https://wa.me/${wedding.rsvp_contact.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl" style={{ background: '#25D366' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L.057 24l6.306-1.634A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.49-5.2-1.346l-.373-.22-3.744.97.997-3.634-.243-.386A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
          )}
          <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-12 overflow-hidden"
            style={{ background: `linear-gradient(150deg, ${C.white} 0%, ${C.yellow}30 100%)` }}>
            <div className="relative z-10 max-w-2xl w-full text-center">
              {isPersonalized && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
                  <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: primaryColor }}>Exclusive Invitation For</p>
                  <h1 className="text-2xl sm:text-3xl font-pacifico" style={{ color: C.jungle }}>{guest?.name}</h1>
                </motion.div>
              )}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex items-center justify-center gap-3 mb-6">
                <div className="h-1 w-16 rounded-full" style={{ background: primaryColor }} />
                <span>🌺</span>
                <div className="h-1 w-16 rounded-full" style={{ background: primaryColor }} />
              </motion.div>
              <div ref={namesRef}>
                <h2 className="text-4xl sm:text-6xl font-pacifico mb-2" style={{ color: C.jungle }}>
                  {splitName(wedding?.groom_name)}
                </h2>
                <p className="text-lg font-poppins tracking-widest mb-2" style={{ color: primaryColor }}>& </p>
                <h2 className="text-4xl sm:text-6xl font-pacifico" style={{ color: primaryColor }}>
                  {splitName(wedding?.bride_name)}
                </h2>
              </div>
              {weddingDate && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                  className="mt-8 inline-grid grid-cols-3 border-2 rounded-2xl overflow-hidden" style={{ borderColor: primaryColor + '40' }}>
                  <div className="px-5 py-4 border-r text-center" style={{ borderColor: primaryColor + '30' }}>
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-700">{weddingDate.toLocaleDateString('en-US', { month: 'long' })}</p>
                    <p className="text-xs text-gray-400 mt-1">{weddingDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                  </div>
                  <div className="px-6 py-4 text-center" style={{ background: primaryColor + '15' }}>
                    <p className="text-5xl font-pacifico font-bold" style={{ color: primaryColor }}>{weddingDate.getDate()}</p>
                  </div>
                  <div className="px-5 py-4 border-l text-center" style={{ borderColor: primaryColor + '30' }}>
                    <p className="text-sm font-bold text-gray-700">{wedding?.reception_time}</p>
                    <p className="text-xs text-gray-400 mt-1">Reception</p>
                  </div>
                </motion.div>
              )}
              {(wedding?.cover_photo_cutout_url || wedding?.cover_photo_url) && (
                <motion.div ref={containerRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                  style={{ transformStyle: 'preserve-3d', perspective: '1200px' }} className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto mt-8">
                  <motion.div style={{ rotateX: tx, rotateY: ty, transformStyle: 'preserve-3d' }} className="w-full h-full relative">
                    <div className="absolute inset-0 rounded-3xl blur-xl" style={{ background: `radial-gradient(ellipse, ${primaryColor}30, transparent)`, transform: 'translateZ(0)' }} />
                    <img src={wedding.cover_photo_cutout_url || wedding.cover_photo_url} alt="Couple" className="absolute inset-0 w-full h-full object-contain"
                      style={{ transform: 'translateZ(40px)', filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.3))' }} />
                  </motion.div>
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ delay: 1.5, y: { duration: 1.5, repeat: Infinity } }} className="mt-10 flex justify-center">
                <span className="text-2xl" style={{ color: primaryColor + '80' }}>↓</span>
              </motion.div>
            </div>
          </section>
          <CountdownTimer weddingDate={wedding?.wedding_date} primaryColor={primaryColor} />
          <OurStory story={wedding?.our_story} primaryColor={primaryColor} />
          <EventSchedule wedding={wedding} primaryColor={primaryColor} />
          <PhotoGallery images={wedding?.gallery_urls} primaryColor={primaryColor} />
          <DressCode dressCode={wedding?.dress_code} colors={wedding?.dress_code_colors} primaryColor={primaryColor} />
          <RSVPForm wedding={wedding} guest={guest} isPersonalized={isPersonalized} primaryColor={primaryColor} />
          <WishesWall wedding={wedding} primaryColor={primaryColor} />
          <ShareSection wedding={wedding} primaryColor={primaryColor} />
          <footer className="py-12 px-4 text-center border-t" style={{ borderColor: primaryColor + '20' }}>
            <p className="font-pacifico text-2xl mb-1" style={{ color: C.jungle }}>{wedding?.groom_name} & {wedding?.bride_name}</p>
            <p className="text-xs mt-4 text-gray-300">Crafted by Wedzo 🌺</p>
          </footer>
        </motion.div>
      )}
    </div>
  )
}
