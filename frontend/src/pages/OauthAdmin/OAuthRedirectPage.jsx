import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function OAuthRedirectPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

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

  //start new
  // useEffect(() => {
  //   if (!loading && user) {
  //     navigate('/dashboard', { replace: true })
  //   }
  // }, [user, loading])  
//end new

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-700">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p>Signing you in...</p>
      </div>
    </div>
  )
}
