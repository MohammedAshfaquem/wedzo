import { useState, useEffect, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { weddingsAPI } from '../api/client'
import MediaUpload from '../components/admin/MediaUpload'
import TemplateSelector from '../components/admin/TemplateSelector'

/* ─── Step schemas ─── */
const step1Schema = z.object({
  invitation_mode: z.enum(['personalized', 'general']),
})
const step2Schema = z.object({
  groom_name: z.string().min(2, 'Enter at least 2 characters'),
  bride_name: z.string().min(2, 'Enter at least 2 characters'),
  groom2_name: z.string().optional(),
  bride2_name: z.string().optional(),
  slug: z.string()
    .min(3, 'Min 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens (no spaces, slashes, or special chars)'),
  couple_story: z.string().optional(),
})
const step3Schema = z.object({
  wedding_date: z.string().min(1, 'Required'),
  ceremony_time: z.string().min(1, 'Required'),
  ceremony_venue: z.string().min(2, 'Required'),
  ceremony_address: z.string().min(2, 'Required'),
  ceremony_maps_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})
const step4Schema = z.object({
  reception_time: z.string().optional(),
  reception_venue: z.string().optional(),
  reception_address: z.string().optional(),
  reception_maps_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})
const step5Schema = z.object({
  dress_code_note: z.string().optional(),
  rsvp_deadline: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_whatsapp: z.string().optional(),
})

const schemas = [null, step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, null, null]
const TOTAL_STEPS = 7

/* ─── Helpers ─── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
const Input = forwardRef(function Input({ error, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
        error ? 'border-red-400 focus:ring-2 ring-red-200' : 'border-gray-200 focus:ring-2 ring-rose-200'
      }`}
    />
  )
})

const Textarea = forwardRef(function Textarea({ error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition resize-none ${
        error ? 'border-red-400 focus:ring-2 ring-red-200' : 'border-gray-200 focus:ring-2 ring-rose-200'
      }`}
    />
  )
})

/* ─── Step components ─── */
function Step1({ data, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Invitation Mode</h2>
      <p className="text-sm text-gray-500">Choose how guests will access their invitations.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {[
          {
            id: 'personalized',
            icon: '🎯',
            title: 'Personalized',
            desc: 'Each guest gets a unique link with their name. Perfect for tracking RSVPs and managing the guest list.',
            highlight: 'Unique URL per guest, WhatsApp blast, RSVP tracking',
          },
          {
            id: 'general',
            icon: '📨',
            title: 'General',
            desc: 'One link for everyone. Guests enter their name in the RSVP form.',
            highlight: 'Single URL, easy to share, open RSVP',
          },
        ].map((opt) => (
          <motion.div
            key={opt.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange({ ...data, invitation_mode: opt.id })}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition ${
              data.invitation_mode === opt.id ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200' : 'border-gray-200 hover:border-rose-300'
            }`}
          >
            <div className="text-4xl mb-3">{opt.icon}</div>
            <h3 className="font-bold text-gray-800 text-lg">{opt.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{opt.desc}</p>
            <p className="text-xs text-rose-500 mt-3 font-medium">{opt.highlight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Step2({ register, errors, data, onChange }) {
  const autoSlug = (name1, name2) => {
    return `${name1}-${name2}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const cleanSlug = (value) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Remove anything that's not lowercase letters, numbers, hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Couple Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Groom's Name *" error={errors.groom_name?.message}>
          <Input {...register('groom_name')} error={errors.groom_name} placeholder="e.g. Ahmad" />
        </Field>
        <Field label="Bride's Name *" error={errors.bride_name?.message}>
          <Input {...register('bride_name')} error={errors.bride_name} placeholder="e.g. Siti" />
        </Field>
      </div>
      <p className="text-xs text-gray-400">For double ceremonies (optional):</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Groom 2's Name" error={errors.groom2_name?.message}>
          <Input {...register('groom2_name')} placeholder="Optional" />
        </Field>
        <Field label="Bride 2's Name" error={errors.bride2_name?.message}>
          <Input {...register('bride2_name')} placeholder="Optional" />
        </Field>
      </div>
      <Field label="Wedding Slug *" error={errors.slug?.message}>
        <Input
          {...register('slug', {
            onBlur: (e) => {
              // Auto-clean the slug when user leaves the field
              const cleaned = cleanSlug(e.target.value)
              e.target.value = cleaned
            }
          })}
          error={errors.slug}
          placeholder="e.g. ashiq-mufeeda (only lowercase letters, numbers, hyphens)"
        />
        <p className="text-xs text-gray-400 mt-1">URL: /wedding/<span className="text-rose-500 font-semibold">{cleanSlug(data.slug || '')}</span></p>
      </Field>
      <Field label="Our Story (optional)" error={errors.couple_story?.message}>
        <Textarea {...register('couple_story')} rows={4} placeholder="How did you two meet? Share your love story..." />
      </Field>
    </div>
  )
}

function Step3({ register, errors }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Ceremony Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Wedding Date *" error={errors.wedding_date?.message}>
          <Input {...register('wedding_date')} type="date" error={errors.wedding_date} />
        </Field>
        <Field label="Ceremony Time *" error={errors.ceremony_time?.message}>
          <Input {...register('ceremony_time')} type="time" error={errors.ceremony_time} />
        </Field>
      </div>
      <Field label="Ceremony Venue *" error={errors.ceremony_venue?.message}>
        <Input {...register('ceremony_venue')} error={errors.ceremony_venue} placeholder="e.g. Grand Ballroom, Hilton Hotel" />
      </Field>
      <Field label="Ceremony Address *" error={errors.ceremony_address?.message}>
        <Input {...register('ceremony_address')} error={errors.ceremony_address} placeholder="Full address" />
      </Field>
      <Field label="Google Maps URL" error={errors.ceremony_maps_url?.message}>
        <Input {...register('ceremony_maps_url')} placeholder="https://maps.google.com/..." />
      </Field>
    </div>
  )
}

function Step4({ register, errors }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Reception Details</h2>
      <p className="text-sm text-gray-500">Leave blank if reception details are the same as ceremony or not applicable.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Reception Time" error={errors.reception_time?.message}>
          <Input {...register('reception_time')} type="time" />
        </Field>
        <Field label="Reception Venue" error={errors.reception_venue?.message}>
          <Input {...register('reception_venue')} placeholder="e.g. Diamond Hall" />
        </Field>
      </div>
      <Field label="Reception Address" error={errors.reception_address?.message}>
        <Input {...register('reception_address')} placeholder="Full address" />
      </Field>
      <Field label="Reception Maps URL" error={errors.reception_maps_url?.message}>
        <Input {...register('reception_maps_url')} placeholder="https://maps.google.com/..." />
      </Field>
    </div>
  )
}

function Step5({ register, errors }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Guest & RSVP Details</h2>
      <Field label="Dress Code Note" error={errors.dress_code_note?.message}>
        <Input {...register('dress_code_note')} placeholder="e.g. Smart Casual, Baju Melayu / Kurung" />
      </Field>
      <Field label="RSVP Deadline" error={errors.rsvp_deadline?.message}>
        <Input {...register('rsvp_deadline')} type="date" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact Phone" error={errors.contact_phone?.message}>
          <Input {...register('contact_phone')} placeholder="+60123456789" />
        </Field>
        <Field label="WhatsApp Number" error={errors.contact_whatsapp?.message}>
          <Input {...register('contact_whatsapp')} placeholder="+60123456789" />
        </Field>
      </div>
    </div>
  )
}

function Step6({ data, onChange }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Media Upload</h2>
      <MediaUpload data={data} onChange={onChange} />
    </div>
  )
}

function Step7({ data, onChange }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Choose Template</h2>
      <TemplateSelector value={data.template} onChange={(t) => onChange({ ...data, template: t })} />
    </div>
  )
}

const STEP_LABELS = ['Mode', 'Couple', 'Ceremony', 'Reception', 'Guests', 'Media', 'Template']

export default function CreateWedding({ initialData = null, onSave = null }) {
  const navigate = useNavigate()

  const STORAGE_KEY = initialData ? null : 'wedzo_create_draft'

  const getInitial = () => {
    if (initialData) return initialData
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.formData || parsed
      }
    } catch {}
    return {
      invitation_mode: 'personalized',
      groom_name: '', bride_name: '', groom2_name: '', bride2_name: '',
      slug: '', couple_story: '',
      wedding_date: '', ceremony_time: '', ceremony_venue: '', ceremony_address: '', ceremony_maps_url: '',
      reception_time: '', reception_venue: '', reception_address: '', reception_maps_url: '',
      dress_code_note: '', dress_code_colors: [], rsvp_deadline: '', contact_phone: '', contact_whatsapp: '',
      couple_photo: null, gallery_urls: [], music_url: '',
      template: 'EternalRose',
    }
  }

  const getSavedStep = () => {
    if (initialData) return 1
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).step || 1
    } catch {}
    return 1
  }

  const [step, setStep] = useState(getSavedStep)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(getInitial)

  const schema = schemas[step]
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: formData,
    mode: 'onBlur',
  })

  // Sync formData to form when step changes
  useEffect(() => {
    Object.keys(formData).forEach((key) => {
      setValue(key, formData[key], { shouldValidate: false })
    })
  }, [step, formData, setValue])

  // Persist draft to sessionStorage on every change
  useEffect(() => {
    if (!STORAGE_KEY) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }))
    } catch {}
  }, [step, formData, STORAGE_KEY])

  // Browser back button → go to previous step instead of leaving page
  useEffect(() => {
    if (initialData) return
    // Push an extra history entry so the first back press is intercepted
    window.history.pushState({ wedzoStep: step }, '')
    const handlePop = (e) => {
      setStep((s) => {
        if (s > 1) {
          window.history.pushState({ wedzoStep: s - 1 }, '')
          return s - 1
        }
        // On step 1, let navigation proceed to dashboard
        navigate('/admin/dashboard')
        return s
      })
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const watchedSlug = watch('slug') || formData.slug

  const syncField = (name, value) => {
    setValue(name, value, { shouldValidate: false })
    setFormData((d) => ({ ...d, [name]: value }))
  }

  // Merge RHF values into formData on validated next
  const onValidNext = (values) => {
    setFormData((d) => ({ ...d, ...values }))
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const prev = () => setStep((s) => Math.max(s - 1, 1))

  const next = async () => {
    if (!schema) {
      // No validation needed, just advance
      setStep((s) => Math.min(s + 1, TOTAL_STEPS))
      return
    }

    // Trigger validation on all fields in this step
    const isValid = await trigger()
    
    if (isValid) {
      // Get current form values and save to state
      const currentData = watch()
      setFormData((d) => ({ ...d, ...currentData }))
      // Advance to next step
      setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    }
    // If not valid, errors already displayed on fields
  }

  const submit = async () => {
    if (!formData.template) {
      toast.error('Please select a template')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...formData,
        couple_photo_original: formData.couple_photo?.original_url || formData.couple_photo,
        couple_photo_cutout: formData.couple_photo?.cutout_url || null,
      }
      if (onSave) {
        await onSave(payload)
      } else {
        await weddingsAPI.create(payload)
        try { sessionStorage.removeItem('wedzo_create_draft') } catch {}
        toast.success('Wedding created! 🎉')
        navigate('/admin/dashboard')
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const variants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="font-playfair italic text-xl text-rose-700">
          {initialData ? 'Edit Wedding' : 'Create New Wedding'}
        </h1>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-1 items-center">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1
            const done = step > n
            const active = step === n

            return (
              <div key={n} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      done ? 'bg-green-500 text-white' : active ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {done ? '✓' : n}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${active ? 'text-rose-500 font-semibold' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded transition ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <Step1
                  data={formData}
                  onChange={(d) => setFormData(d)}
                />
              )}
              {step === 2 && (
                <Step2
                  register={register}
                  errors={errors}
                  data={{ slug: watchedSlug }}
                  onChange={setFormData}
                />
              )}
              {step === 3 && <Step3 register={register} errors={errors} />}
              {step === 4 && <Step4 register={register} errors={errors} />}
              {step === 5 && <Step5 register={register} errors={errors} />}
              {step === 6 && (
                <Step6
                  data={formData}
                  onChange={(d) => setFormData(d)}
                />
              )}
              {step === 7 && (
                <Step7
                  data={formData}
                  onChange={(d) => setFormData(d)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prev}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"
            >
              Back
            </button>
            {step < TOTAL_STEPS ? (
              <button
                onClick={next}
                className="px-8 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={saving}
                className="px-8 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  '🎉'
                )}
                {initialData ? 'Save Changes' : 'Publish Wedding'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
