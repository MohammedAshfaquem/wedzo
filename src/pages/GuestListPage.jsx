import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Papa from 'papaparse'
import toast from 'react-hot-toast'
import { guestsAPI, weddingsAPI } from '../api/client'

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export default function GuestListPage() {
  const { weddingId } = useParams()
  const [wedding, setWedding] = useState(null)
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [csvPreview, setCsvPreview] = useState(null)
  const [importing, setImporting] = useState(false)
  const [addName, setAddName] = useState('')
  const [addPhone, setAddPhone] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    loadAll()
  }, [weddingId])

  const loadAll = async () => {
    try {
      const [wRes, gRes] = await Promise.all([
        weddingsAPI.getById(weddingId),
        guestsAPI.list(weddingId),
      ])
      setWedding(wRes.data)
      setGuests(gRes.data)
    } catch {
      toast.error('Failed to load guests')
    } finally {
      setLoading(false)
    }
  }

  /* ─── Stats ─── */
  const rsvped = guests.filter((g) => g.rsvp_submitted).length
  const pending = guests.length - rsvped

  /* ─── Add single guest ─── */
  const addGuest = async (e) => {
    e.preventDefault()
    if (!addName.trim()) { toast.error('Name is required'); return }
    setAdding(true)
    try {
      await guestsAPI.add(weddingId, { name: addName.trim(), phone: addPhone, email: addEmail })
      toast.success('Guest added!')
      setAddName(''); setAddPhone(''); setAddEmail('')
      loadAll()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to add guest')
    } finally {
      setAdding(false)
    }
  }

  /* ─── CSV Upload ─── */
  const handleCsv = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data.map((row) => ({
          name: row.name || row.Name || '',
          phone: row.phone || row.Phone || '',
          email: row.email || row.Email || '',
        })).filter((r) => r.name)
        setCsvPreview(rows)
      },
    })
  }

  const importCsv = async () => {
    if (!csvPreview?.length) return
    setImporting(true)
    try {
      await guestsAPI.bulkAdd(weddingId, csvPreview)
      toast.success(`${csvPreview.length} guests imported!`)
      setCsvPreview(null)
      loadAll()
    } catch {
      toast.error('Import failed')
    } finally {
      setImporting(false)
    }
  }

  /* ─── Delete ─── */
  const deleteGuest = async (id) => {
    if (!confirm('Delete this guest?')) return
    try {
      await guestsAPI.delete(id)
      setGuests((prev) => prev.filter((g) => g.id !== id))
      toast.success('Guest removed')
    } catch {
      toast.error('Delete failed')
    }
  }

  /* ─── WhatsApp blast ─── */
  const openWhatsApp = (guest) => {
    const url = `${BASE_URL}/wedding/${wedding.slug}/${guest.slug}`
    const msg = encodeURIComponent(
      `Assalamualaikum ${guest.name},\n\nYou're invited to the wedding of *${wedding.groom_name} & ${wedding.bride_name}*!\n\n` +
      `Please click your personal invitation link:\n${url}\n\nWe look forward to celebrating with you! 🌸`
    )
    const phone = (guest.phone || '').replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  const copyLink = (guest) => {
    const url = `${BASE_URL}/wedding/${wedding?.slug}/${guest.slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  const exportCsv = () => {
    const rows = [
      ['Name', 'Phone', 'Email', 'Slug', 'Invitation URL', 'RSVP Submitted'],
      ...guests.map((g) => [
        g.name, g.phone || '', g.email || '', g.slug,
        `${BASE_URL}/wedding/${wedding?.slug}/${g.slug}`,
        g.rsvp_submitted ? 'Yes' : 'No',
      ]),
    ]
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `guests-${wedding?.slug || weddingId}.csv`
    a.click()
  }

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.phone || '').includes(search)
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">← Dashboard</Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-semibold text-gray-800">
            Guest List — {wedding?.groom_name} & {wedding?.bride_name}
          </h1>
        </div>
        <button onClick={exportCsv} className="px-4 py-2 rounded-xl text-xs bg-gray-100 hover:bg-gray-200 transition font-semibold">
          Export CSV
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Guests" value={guests.length} color="#B76E79" />
          <StatCard label="RSVPed" value={rsvped} color="#16a34a" />
          <StatCard label="Pending" value={pending} color="#d97706" />
          <StatCard label="Response Rate" value={guests.length ? `${Math.round(rsvped / guests.length * 100)}%` : '—'} color="#7C3AED" />
        </div>

        {/* Add guest manually */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Add Guest Manually</h2>
          <form onSubmit={addGuest} className="flex gap-3 flex-wrap">
            <input
              value={addName} onChange={(e) => setAddName(e.target.value)}
              placeholder="Full Name *" required
              className="flex-1 min-w-32 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-rose-200"
            />
            <input
              value={addPhone} onChange={(e) => setAddPhone(e.target.value)}
              placeholder="Phone (WhatsApp)"
              className="flex-1 min-w-32 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-rose-200"
            />
            <input
              value={addEmail} onChange={(e) => setAddEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 min-w-32 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-rose-200"
            />
            <button
              type="submit" disabled={adding}
              className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition flex items-center gap-2"
            >
              {adding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '+'}
              Add
            </button>
          </form>
        </div>

        {/* CSV Import */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-2">CSV Import</h2>
          <p className="text-xs text-gray-400 mb-4">CSV must have columns: name, phone, email (header row required)</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCsv} />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            📂 Select CSV File
          </button>

          <AnimatePresence>
            {csvPreview && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 border border-green-200 rounded-xl overflow-hidden"
              >
                <div className="bg-green-50 px-4 py-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-700">{csvPreview.length} guests ready to import</p>
                  <div className="flex gap-2">
                    <button
                      onClick={importCsv} disabled={importing}
                      className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition"
                    >
                      {importing ? 'Importing...' : 'Import All'}
                    </button>
                    <button
                      onClick={() => setCsvPreview(null)}
                      className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-gray-50"><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Phone</th><th className="px-4 py-2 text-left">Email</th></tr></thead>
                    <tbody>{csvPreview.slice(0, 20).map((r, i) => (
                      <tr key={i} className="border-t border-gray-100"><td className="px-4 py-2">{r.name}</td><td className="px-4 py-2 text-gray-500">{r.phone}</td><td className="px-4 py-2 text-gray-500">{r.email}</td></tr>
                    ))}</tbody>
                  </table>
                  {csvPreview.length > 20 && <p className="text-xs text-gray-400 px-4 py-2">...and {csvPreview.length - 20} more</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guest Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="font-semibold text-gray-800">All Guests ({guests.length})</h2>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-rose-200 w-64"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              {guests.length === 0 ? 'No guests yet. Add guests above or import CSV.' : 'No guests match your search.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">RSVP</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((g, i) => (
                    <tr key={g.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-800">{g.name}</div>
                        <div className="text-xs text-gray-400">/{g.slug}</div>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{g.phone || '—'}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${g.rsvp_submitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {g.rsvp_submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyLink(g)}
                            className="px-3 py-1 rounded-lg text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            Copy Link
                          </button>
                          {g.phone && (
                            <button
                              onClick={() => openWhatsApp(g)}
                              className="px-3 py-1 rounded-lg text-xs bg-green-100 text-green-700 hover:bg-green-200 transition"
                            >
                              WhatsApp
                            </button>
                          )}
                          <a
                            href={`${BASE_URL}/wedding/${wedding?.slug}/${g.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                          >
                            Preview
                          </a>
                          <button
                            onClick={() => deleteGuest(g.id)}
                            className="px-3 py-1 rounded-lg text-xs bg-red-100 text-red-600 hover:bg-red-200 transition"
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
    </div>
  )
}
