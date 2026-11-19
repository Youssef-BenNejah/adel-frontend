import { Navigate, Outlet } from 'react-router-dom'
import { useAdminSession } from '../store/adminAuthStore.js'

export default function ProtectedRoute() {
  const session = useAdminSession()
  if (!session.loggedIn || !session.accessToken) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
