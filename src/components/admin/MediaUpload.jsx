import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mediaAPI } from '../../api/client'
import toast from 'react-hot-toast'

/* ─── Single photo upload with optional remove.bg ─── */
function PhotoUploader({ label, value, onChange, removeBg = false }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value?.original_url || value || null)
  const [cutout, setCutout] = useState(value?.cutout_url || null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await mediaAPI.uploadPhoto(file)
      setPreview(res.data.original_url)
      setCutout(res.data.cutout_url || null)
      onChange(res.data)
      toast.success('Photo uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl overflow-hidden cursor-pointer transition"
        style={{ minHeight: 180 }}
      >
        {preview ? (
          <div className="flex items-center gap-3 p-3">
            <img src={preview} alt="original" className="w-24 h-24 object-cover rounded-xl" />
            {cutout && (
              <div>
                <p className="text-xs text-green-600 font-semibold mb-1">✨ Background Removed</p>
                <img src={cutout} alt="cutout" className="w-24 h-24 object-cover rounded-xl" style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0/16px 16px' }} />
              </div>
            )}
            <p className="text-xs text-gray-400 ml-2">Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-44">
            {uploading ? (
              <div className="w-8 h-8 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-gray-400">Click to upload</p>
              </>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

/* ─── Gallery grid uploader (up to 8) ─── */
function GalleryUploader({ value = [], onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const res = await mediaAPI.uploadGallery(files)
      const newUrls = res.data.urls || []
      onChange([...value, ...newUrls].slice(0, 8))
      toast.success('Photos uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = (idx) => {
    const copy = [...value]
    copy.splice(idx, 1)
    onChange(copy)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Photos (max 8)</label>
      <div className="grid grid-cols-4 gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        {value.length < 8 && (
          <div
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-rose-200 hover:border-rose-400 cursor-pointer flex items-center justify-center transition"
          >
            {uploading ? (
              <div className="w-6 h-6 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
            ) : (
              <span className="text-2xl text-gray-400">+</span>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  )
}

/* ─── Audio uploader ─── */
function AudioUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await mediaAPI.uploadMusic(file)
      onChange(res.data.url)
      toast.success('Music uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Background Music</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-6 cursor-pointer flex items-center gap-4 transition"
      >
        <span className="text-3xl">🎵</span>
        {value ? (
          <div>
            <p className="text-sm font-semibold text-gray-700">Music uploaded ✓</p>
            <audio src={value} controls className="mt-2 h-8 w-48" />
          </div>
        ) : uploading ? (
          <div className="w-6 h-6 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
        ) : (
          <p className="text-sm text-gray-400">Click to upload MP3/OGG</p>
        )}
      </div>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

export default function MediaUpload({ data, onChange }) {
  return (
    <div className="space-y-8">
      <PhotoUploader
        label="Couple Photo (background will be auto-removed)"
        value={data.couple_photo}
        onChange={(v) => onChange({ ...data, couple_photo: v })}
        removeBg
      />
      <GalleryUploader
        value={data.gallery_urls || []}
        onChange={(v) => onChange({ ...data, gallery_urls: v })}
      />
      <AudioUploader
        value={data.music_url}
        onChange={(v) => onChange({ ...data, music_url: v })}
      />
    </div>
  )
}
