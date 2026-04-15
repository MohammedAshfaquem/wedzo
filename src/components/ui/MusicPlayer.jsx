import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer({ src, autoPlay = true }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return

    audio.volume = volume
    audio.loop = true

    if (autoPlay) {
      const tryPlay = () => {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
      // Try immediately; browsers may block until user interaction
      tryPlay()
      document.addEventListener('click', tryPlay, { once: true })
    }

    return () => {
      audio.pause()
    }
  }, [src, autoPlay])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  if (!src) return null

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ delay: 3.5 }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md bg-black/40 border border-white/20 shadow-2xl"
          >
            {/* Equalizer bars */}
            <div className="flex items-end gap-[3px] h-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.span
                  key={i}
                  className="music-bar w-[3px] rounded-full bg-rose-300"
                  animate={
                    playing
                      ? { height: [`${4 + i * 2}px`, `${14 + i * 2}px`, `${4 + i * 2}px`] }
                      : { height: '4px' }
                  }
                  transition={
                    playing
                      ? { duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }
                      : {}
                  }
                  style={{ minWidth: '3px', minHeight: '4px' }}
                />
              ))}
            </div>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 transition flex items-center justify-center text-white text-sm"
            >
              {playing ? '⏸' : '▶'}
            </button>

            {/* Volume */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolume}
              className="w-16 accent-rose-400"
            />

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="text-white/50 hover:text-white text-xs ml-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
