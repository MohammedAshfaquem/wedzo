import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { rsvpAPI } from '../../api/client'
import { useCountdown } from '../../hooks/useCountdown'

function fireConfetti() {
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
}

function raining() {
  const end = Date.now() + 3000
  const frame = () => {
    confetti({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0 } })
    confetti({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

// ─── SUCCESS SCREEN ──────────────────────────────────────────────────────────
function SuccessScreen({ guestName, wedding, onBack }) {
  const { days, hours, minutes, seconds } = useCountdown(wedding?.wedding_date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="text-6xl mb-4">🎊</div>
      <h2 className="text-4xl font-playfair italic text-rose-600 mb-2">We Can't Wait!</h2>
      <p className="text-2xl font-cormorant font-semibold uppercase tracking-widest text-gray-800 mb-4">
        {guestName}
      </p>
      <p className="text-gray-600 font-lato mb-8 max-w-sm mx-auto">
        Your RSVP has been received! We look forward to celebrating with you.
      </p>

      {/* Date + venue */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {wedding?.wedding_date && (
          <div className="text-center">
            <p className="text-3xl font-cormorant font-bold text-rose-500">
              {new Date(wedding.wedding_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
            </p>
          </div>
        )}
        {wedding?.reception_venue && (
          <div className="text-center">
            <p className="font-playfair text-lg text-gray-700">{wedding.reception_venue}</p>
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="flex gap-4 justify-center mb-8">
        {[{ v: days, l: 'Days' }, { v: hours, l: 'Hrs' }, { v: minutes, l: 'Min' }, { v: seconds, l: 'Sec' }].map(
          ({ v, l }) => (
            <div key={l} className="flex flex-col items-center border rounded-xl px-3 py-2 bg-rose-50 border-rose-200">
              <span className="text-2xl font-cormorant font-bold text-rose-600">{String(v).padStart(2, '0')}</span>
              <span className="text-[10px] font-lato uppercase tracking-widest text-gray-400">{l}</span>
            </div>
          )
        )}
      </div>

      {/* Buttons */}
      {wedding?.reception_maps_url && (
        <a
          href={wedding.reception_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-4 px-8 py-3 rounded-full border-2 border-rose-400 text-rose-600 font-semibold hover:bg-rose-50 transition"
        >
          📍 CLICK HERE FOR LOCATION
        </a>
      )}

      {wedding?.rsvp_contact && (
        <a
          href={`tel:${wedding.rsvp_contact}`}
          className="flex items-center justify-center gap-2 mx-auto mb-6 text-gray-600 hover:text-rose-500 transition w-fit"
        >
          📞 {wedding.rsvp_contact}
        </a>
      )}

      <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">
        ← Back to Invitation
      </button>
    </motion.div>
  )
}

// ─── DECLINED SCREEN ─────────────────────────────────────────────────────────
function DeclinedScreen({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="text-5xl mb-4">🌸</div>
      <h2 className="text-3xl font-playfair italic text-gray-700 mb-2">We'll miss you!</h2>
      <p className="text-gray-500 font-lato max-w-sm mx-auto mb-6">
        Thank you for letting us know. We hope to celebrate with you next time.
      </p>
      <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">
        ← Back
      </button>
    </motion.div>
  )
}

// ─── MAIN RSVP FORM ──────────────────────────────────────────────────────────
export default function RSVPForm({ wedding, guest, isPersonalized, primaryColor = '#B76E79', style }) {
  const [step, setStep] = useState(1)
  const [guestName, setGuestName] = useState(guest?.name || '')
  const [attending, setAttending] = useState(null)
  const [count, setCount] = useState(1)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check localStorage for duplicate
  const storageKey = isPersonalized
    ? `rsvp_${wedding?.slug}_${guest?.slug}`
    : `rsvp_${wedding?.slug}`

  const alreadySubmitted = typeof window !== 'undefined' && localStorage.getItem(storageKey)

  const handleDecline = async () => {
    setAttending(false)
    setLoading(true)
    try {
      await rsvpAPI.submit({
        wedding_id: wedding.id,
        guest_id: guest?.id || null,
        guest_name: guestName,
        attending: false,
        guest_count: 0,
      })
      localStorage.setItem(storageKey, '1')
      setSubmitted('declined')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    setAttending(true)
    fireConfetti()
    setStep(isPersonalized ? 3 : 2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!guestName) return
    setLoading(true)
    try {
      await rsvpAPI.submit({
        wedding_id: wedding.id,
        guest_id: guest?.id || null,
        guest_name: guestName,
        attending: true,
        guest_count: count,
        message: message || null,
      })
      localStorage.setItem(storageKey, '1')
      raining()
      setSubmitted('accepted')
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    setSubmitted(false)
    setStep(1)
    setAttending(null)
  }

  // ── ALREADY SUBMITTED ──
  if (alreadySubmitted) {
    return (
      <section id="rsvp" className="py-20 px-4 text-center" style={style}>
        <div className="max-w-md mx-auto">
          <p className="text-2xl font-playfair italic text-gray-700">
            ✅ You've already submitted your RSVP!
          </p>
          <p className="text-gray-500 mt-2 font-lato">Thank you — we'll see you soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-20 px-4" style={style}>
      <div className="max-w-md mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl sm:text-4xl font-playfair italic mb-12 text-gray-800"
        >
          RSVP
        </motion.h2>

        {/* ── RESULT SCREENS ── */}
        <AnimatePresence mode="wait">
          {submitted === 'accepted' && (
            <SuccessScreen
              guestName={guestName.toUpperCase()}
              wedding={wedding}
              onBack={goBack}
            />
          )}
          {submitted === 'declined' && <DeclinedScreen onBack={goBack} />}

          {/* ── STEP 1 (General): Name input ── */}
          {!submitted && !isPersonalized && step === 1 && (
            <motion.div
              key="step1-general"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-center font-cormorant text-xl mb-6 text-gray-700">
                What is your name?
              </p>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your full name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-rose-300 mb-6 font-lato"
              />
              <button
                disabled={!guestName.trim()}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-full font-semibold text-white transition disabled:opacity-40"
                style={{ background: primaryColor }}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Will you attend? ── */}
          {!submitted && ((!isPersonalized && step === 2) || (isPersonalized && step === 1)) && (
            <motion.div
              key="step-attend"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="text-center"
            >
              <p className="text-xs tracking-[0.3em] uppercase mb-2 text-gray-400 font-lato">
                Will you attend?
              </p>
              {isPersonalized && (
                <p className="font-cormorant text-2xl italic text-gray-700 mb-8">
                  Dear <span style={{ color: primaryColor }}>{guest?.name}</span>,
                </p>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-4 px-4 rounded-2xl border-2 border-green-400 bg-green-50 hover:bg-green-100 transition text-sm font-semibold text-green-700 flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">✅</span>
                  <span>Yes, In Sha Allah! 😊</span>
                </button>

                <button
                  onClick={handleDecline}
                  disabled={loading}
                  className="flex-1 py-4 px-4 rounded-2xl border-2 border-red-300 bg-red-50 hover:bg-red-100 transition text-sm font-semibold text-red-600 flex flex-col items-center gap-2 disabled:opacity-60"
                >
                  <span className="text-2xl">❌</span>
                  <span>Unfortunately, I can't make it</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Guest count ── */}
          {!submitted && ((!isPersonalized && step === 3) || (isPersonalized && step === 3)) && (
            <motion.div
              key="step-count"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="text-center"
            >
              <p className="font-playfair text-2xl italic text-gray-800 mb-1">Wonderful!</p>
              {(isPersonalized || guestName) && (
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-lato mb-8">
                  Details for {(isPersonalized ? guest?.name : guestName)?.toUpperCase()}
                </p>
              )}

              <p className="font-cormorant italic text-lg text-gray-700 mb-6">
                How many family members will attend?
              </p>

              <div className="flex items-center justify-center gap-6 mb-2">
                <button
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  className="w-10 h-10 rounded-full border-2 text-xl font-bold flex items-center justify-center transition hover:bg-gray-50"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  −
                </button>
                <span className="text-4xl font-cormorant font-bold" style={{ color: primaryColor }}>
                  {count}
                </span>
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="w-10 h-10 rounded-full border-2 text-xl font-bold flex items-center justify-center transition hover:bg-gray-50"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  +
                </button>
              </div>

              <p className="text-xs tracking-widest uppercase text-gray-400 font-lato mb-8">
                Including Yourself
              </p>

              {/* Message field for general mode */}
              {!isPersonalized && (
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a personal message (optional)"
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-rose-300 mb-4 font-lato text-sm resize-none"
                />
              )}

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full font-semibold text-white text-lg transition disabled:opacity-60"
                  style={{ background: '#16a34a' }}
                >
                  {loading ? 'Submitting...' : 'SUBMIT RSVP'}
                </button>
              </form>
            </motion.div>
          )}

          {/* General mode step 2→3 redirect */}
          {!submitted && !isPersonalized && step === 2 && attending === true && (() => {
            setStep(3)
            return null
          })()}
        </AnimatePresence>
      </div>
    </section>
  )
}
