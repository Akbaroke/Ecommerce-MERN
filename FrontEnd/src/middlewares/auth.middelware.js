import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Auth({ children }) {
  const auth = useSelector(state => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (!auth.success) {
      navigate('/login')
    }
  }, [])
  return children
}

export default Auth
