import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

export default function ShareSection({ wedding, style, primaryColor = '#B76E79' }) {
  const [copied, setCopied] = useState(false)
  const pageUrl = window.location.href

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const downloadImage = async () => {
    const hero = document.getElementById('hero')
    if (!hero) return
    toast('Generating image...', { icon: '📸' })
    try {
      const canvas = await html2canvas(hero, { useCORS: true, scale: 2 })
      const link = document.createElement('a')
      link.download = `${wedding?.slug || 'invitation'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      toast.error('Could not generate image')
    }
  }

  const waText = encodeURIComponent(
    `You're invited to ${wedding?.groom_name} & ${wedding?.bride_name}'s wedding!\n${pageUrl}`
  )

  return (
    <section id="share" className="py-20 px-4 text-center" style={style}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-playfair italic mb-3 text-gray-800"
      >
        Spread the Joy
      </motion.h2>
      <p className="text-gray-400 text-sm mb-10 font-lato">Share this invitation with your loved ones</p>

      <div className="flex flex-wrap justify-center gap-4">
        {/* WhatsApp */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition"
          style={{ background: '#25D366' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L.057 24l6.306-1.634A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.49-5.2-1.346l-.373-.22-3.744.97.997-3.634-.243-.386A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Share on WhatsApp
        </motion.a>

        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={copyLink}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition"
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </motion.button>

        {/* Download */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={downloadImage}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          📸 Download Image
        </motion.button>
      </div>
    </section>
  )
}
