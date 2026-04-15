import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from './store/useAuthStore'

/* ─── Page imports ─── */
const Landing = lazy(() => import('./pages/Landing'))
const TemplateGallery = lazy(() => import('./pages/TemplateGallery'))
const WeddingPage = lazy(() => import('./pages/WeddingPage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const CreateWedding = lazy(() => import('./pages/CreateWedding'))
const EditWedding = lazy(() => import('./pages/EditWedding'))
const GuestListPage = lazy(() => import('./pages/GuestListPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

/* ─── Spinner ─── */
function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
    </div>
  )
}

/* ─── Protected admin route ─── */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<TemplateGallery />} />

          {/* Wedding invitation pages */}
          <Route path="/wedding/:slug" element={<WeddingPage />} />
          <Route path="/wedding/:slug/:guestSlug" element={<WeddingPage />} />

          {/* Admin auth */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/create"
            element={
              <RequireAuth>
                <CreateWedding />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <RequireAuth>
                <EditWedding />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/wedding/:weddingId/guests"
            element={
              <RequireAuth>
                <GuestListPage />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
