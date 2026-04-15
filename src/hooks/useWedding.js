import { useState, useEffect } from 'react'
import { weddingsAPI } from '../api/client'

export function useWedding(slug) {
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    const fetchWedding = async () => {
      try {
        setLoading(true)
        const res = await weddingsAPI.getBySlug(slug)
        setWedding(res.data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load wedding')
      } finally {
        setLoading(false)
      }
    }

    fetchWedding()
  }, [slug])

  return { wedding, loading, error }
}
