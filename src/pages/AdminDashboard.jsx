import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { weddingsAPI, rsvpAPI, wishesAPI, guestsAPI } from '../api/client'
import { useAuthStore } from '../store/useAuthStore'

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [weddings, setWeddings] = useState([])
  const [stats, setStats] = useState({ weddings: 0, rsvps: 0, wishes: 0, guests: 0 })
  const [loading, setLoading] = useState(true)
  const [qrWedding, setQrWedding] = useState(null)
  const { logout, admin } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await weddingsAPI.list()
      setWeddings(res.data)
      setStats((s) => ({ ...s, weddings: res.data.length }))
    } catch (e) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this wedding? This cannot be undone.')) return
    try {
      await weddingsAPI.delete(id)
      toast.success('Wedding deleted')
      loadDashboard()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleToggle = async (id) => {
    try {
      await weddingsAPI.toggle(id)
      loadDashboard()
    } catch {
      toast.error('Toggle failed')
    }
  }

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${BASE_URL}/wedding/${slug}`)
    toast.success('Link copied!')
  }

  const templateColors = {
    EternalRose: '#B76E79',
    MidnightGarden: '#D4AF37',
    GoldenHour: '#C4713E',
    CelestialLove: '#FFD700',
    TropicalBloom: '#FF6B6B',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💍</span>
          <h1 className="font-playfair italic text-xl text-rose-700">Wedzo Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/create" className="px-5 py-2 rounded-xl text-white text-sm font-semibold bg-rose-500 hover:bg-rose-600 transition">
            + New Wedding
          </Link>
          <button onClick={() => { logout(); navigate('/admin') }} className="text-sm text-gray-500 hover:text-gray-700">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Invitations" value={stats.weddings} icon="💌" color="#B76E79" />
          <StatCard label="Templates Active" value={weddings.filter((w) => w.is_active).length} icon="✅" color="#16a34a" />
          <StatCard label="Personalized" value={weddings.filter((w) => w.invitation_mode === 'personalized').length} icon="🎯" color="#7C3AED" />
          <StatCard label="General" value={weddings.filter((w) => w.invitation_mode === 'general').length} icon="📨" color="#2563EB" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">All Weddings</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : weddings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">💒</div>
              <p className="text-gray-500">No weddings yet.</p>
              <Link to="/admin/create" className="text-rose-500 hover:underline text-sm mt-2 inline-block">
                Create your first wedding →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Couple</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Template</th>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {weddings.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {w.groom_name} & {w.bride_name}
                        </div>
                        <div className="text-xs text-gray-400">/{w.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(w.wedding_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ background: templateColors[w.template] || '#888' }}
                        >
                          {w.template}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${w.invitation_mode === 'personalized' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {w.invitation_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${w.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {w.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`/wedding/${w.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 transition"
                          >
                            View
                          </a>
                          <Link
                            to={`/admin/edit/${w.id}`}
                            className="px-3 py-1 rounded-lg text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => copyLink(w.slug)}
                            className="px-3 py-1 rounded-lg text-xs bg-green-100 text-green-700 hover:bg-green-200 transition"
                          >
                            Copy Link
                          </button>
                          <button
                            onClick={() => setQrWedding(w)}
                            className="px-3 py-1 rounded-lg text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                          >
                            QR
                          </button>
                          {w.invitation_mode === 'personalized' && (
                            <Link
                              to={`/admin/wedding/${w.id}/guests`}
                              className="px-3 py-1 rounded-lg text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                            >
                              Guests
                            </Link>
                          )}
                          <button
                            onClick={() => handleToggle(w.id)}
                            className={`px-3 py-1 rounded-lg text-xs transition ${w.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                          >
                            {w.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(w.id)}
                            className="px-3 py-1 rounded-lg text-xs bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* QR Modal */}
      {qrWedding && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setQrWedding(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-playfair italic text-xl mb-2 text-gray-800">
              {qrWedding.groom_name} & {qrWedding.bride_name}
            </h3>
            <p className="text-xs text-gray-400 mb-6">Scan to open invitation</p>
            <QRCodeSVG
              value={`${BASE_URL}/wedding/${qrWedding.slug}`}
              size={220}
              className="mx-auto"
            />
            <p className="text-xs text-gray-400 mt-4 break-all">{BASE_URL}/wedding/{qrWedding.slug}</p>
            <button
              onClick={() => setQrWedding(null)}
              className="mt-6 px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
