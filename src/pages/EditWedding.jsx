import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { weddingsAPI } from '../api/client'
import CreateWedding from './CreateWedding'

export default function EditWedding() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    weddingsAPI.getById(id)
      .then((res) => setWedding(res.data))
      .catch(() => { toast.error('Wedding not found'); navigate('/admin/dashboard') })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async (payload) => {
    await weddingsAPI.update(id, payload)
    toast.success('Wedding updated!')
    navigate('/admin/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!wedding) return null

  return <CreateWedding initialData={wedding} onSave={handleSave} />
}
