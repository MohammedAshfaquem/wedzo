import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default apiClient

// ─── API helpers ───────────────────────────────────────────────────────────

export const authAPI = {
  login: (data) => apiClient.post('/api/auth/login', data),
  me: () => apiClient.get('/api/auth/me'),
}

export const weddingsAPI = {
  list: (params) => apiClient.get('/api/weddings', { params }),
  create: (data) => apiClient.post('/api/weddings', data),
  getBySlug: (slug) => apiClient.get(`/api/weddings/${slug}`),
  getById: (id) => apiClient.get(`/api/weddings/by-id/${id}`),
  update: (id, data) => apiClient.put(`/api/weddings/${id}`, data),
  delete: (id) => apiClient.delete(`/api/weddings/${id}`),
  toggle: (id) => apiClient.patch(`/api/weddings/${id}/toggle`),
}

export const guestsAPI = {
  list: (weddingId) => apiClient.get(`/api/guests/${weddingId}`),
  add: (weddingId, data) => apiClient.post(`/api/guests/${weddingId}`, data),
  bulkAdd: (weddingId, guests) =>
    apiClient.post(`/api/guests/${weddingId}/bulk`, { guests }),
  delete: (guestId) => apiClient.delete(`/api/guests/${guestId}`),
  getBySlug: (weddingId, guestSlug) =>
    apiClient.get(`/api/guests/${weddingId}/${guestSlug}`),
  whatsappBlast: (weddingId) =>
    apiClient.post(`/api/guests/${weddingId}/whatsapp-blast`),
}

export const rsvpAPI = {
  submit: (data) => apiClient.post('/api/rsvp', data),
  list: (weddingId) => apiClient.get(`/api/rsvp/${weddingId}`),
}

export const wishesAPI = {
  post: (data) => apiClient.post('/api/wishes', data),
  list: (weddingId) => apiClient.get(`/api/wishes/${weddingId}`),
}

export const mediaAPI = {
  uploadPhoto: (file) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post('/api/media/upload/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadGallery: (files) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return apiClient.post('/api/media/upload/gallery', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadMusic: (file) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post('/api/media/upload/music', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
