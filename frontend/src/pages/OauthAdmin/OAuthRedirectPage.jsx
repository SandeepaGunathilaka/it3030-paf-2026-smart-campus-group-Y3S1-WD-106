import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
//This page is the redirect URI for OAuth2 login. It extracts the token from the URL, logs the user in, and redirects to the dashboard.
export default function OAuthRedirectPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  //On page load, check for token in URL and log the user in
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token)
      toast.success('Logged in successfully!')
      navigate('/dashboard', { replace: true })
    } else {
      toast.error('Login failed. Please try again.')
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-700">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p>Signing you in...</p>
      </div>
    </div>
  )
}
