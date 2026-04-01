import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile(user?.id)

  if (authLoading || (user && profileLoading)) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
