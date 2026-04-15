import { useEffect, useState, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { weddingsAPI, guestsAPI } from '../api/client'
import LoadingScreen from '../components/ui/LoadingScreen'

/* ─── Lazy-load templates ─── */
const EternalRose = lazy(() => import('../templates/EternalRose'))
const MidnightGarden = lazy(() => import('../templates/MidnightGarden'))
const GoldenHour = lazy(() => import('../templates/GoldenHour'))
const CelestialLove = lazy(() => import('../templates/CelestialLove'))
const TropicalBloom = lazy(() => import('../templates/TropicalBloom'))

const TEMPLATE_MAP = {
  EternalRose,
  MidnightGarden,
  GoldenHour,
  CelestialLove,
  TropicalBloom,
}

export default function WeddingPage() {
  const { slug, guestSlug } = useParams()
  const navigate = useNavigate()

  const [wedding, setWedding] = useState(null)
  const [guest, setGuest] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | notfound | inactive

  useEffect(() => {
    if (!slug) { navigate('/404'); return }

    const fetchData = async () => {
      try {
        const wRes = await weddingsAPI.getBySlug(slug)
        const w = wRes.data

        if (!w.is_active) {
          setStatus('inactive')
          return
        }

        let g = null
        if (guestSlug) {
          try {
            const gRes = await guestsAPI.getBySlug(w.id, guestSlug)
            g = gRes.data
          } catch {
            setStatus('notfound')
            return
          }
        }

        setWedding(w)
        setGuest(g)
        setStatus('ready')
      } catch {
        setStatus('notfound')
      }
    }

    fetchData()
  }, [slug, guestSlug])

  /* ─── Error states ─── */
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (status === 'notfound') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-red-50 text-center p-8">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-2xl font-playfair italic text-gray-800">Invitation Not Found</h1>
        <p className="text-gray-500 mt-3 max-w-sm">
          This invitation link is invalid or no longer exists. Please check the link you received.
        </p>
      </div>
    )
  }

  if (status === 'inactive') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-center p-8">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-playfair italic text-gray-800">Invitation Unavailable</h1>
        <p className="text-gray-500 mt-3 max-w-sm">
          This wedding invitation has been deactivated. Please contact the couple for more information.
        </p>
      </div>
    )
  }

  if (!wedding) return null

  const Template = TEMPLATE_MAP[wedding.template] || EternalRose
  const isPersonalized = wedding.invitation_mode === 'personalized'

  return (
    <>
      <Helmet>
        <title>
          {`${wedding.groom_name} & ${wedding.bride_name} — Wedding Invitation`}
        </title>
        <meta name="description" content={`You are invited to the wedding of ${wedding.groom_name} & ${wedding.bride_name}`} />
        <meta property="og:title" content={`${wedding.groom_name} & ${wedding.bride_name} 💒`} />
        <meta property="og:description" content={`You are cordially invited to celebrate our wedding${guest ? `, dear ${guest.name}` : ''}!`} />
        {wedding.couple_photo_cutout && <meta property="og:image" content={wedding.couple_photo_cutout} />}
      </Helmet>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-12 h-12 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
          </div>
        }
      >
        <Template
          wedding={wedding}
          guest={guest}
          isPersonalized={isPersonalized}
        />
      </Suspense>
    </>
  )
}
