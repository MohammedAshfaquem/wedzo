import { motion } from 'framer-motion'

export default function DressCode({ dressCode, colors = [], primaryColor = '#B76E79', style }) {
  if (!dressCode && (!colors || colors.length === 0)) return null

  return (
    <section id="dresscode" className="py-20 px-4 text-center" style={style}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-playfair italic mb-4 text-gray-800"
      >
        Dress Code
      </motion.h2>

      {dressCode && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-600 text-lg font-cormorant mb-10 max-w-md mx-auto"
        >
          {dressCode}
        </motion.p>
      )}

      {colors && colors.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {colors.map((color, i) => (
            <motion.div
              key={color + i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-28 h-28 rounded-full shadow-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 8px 30px ${color}66`,
                }}
              />
              <span className="text-xs uppercase tracking-widest font-lato text-gray-400">
                {color}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
