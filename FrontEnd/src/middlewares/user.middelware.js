import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function User({ children }) {
  const auth = useSelector(state => state.auth)
  const store = useSelector(state => state.store)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth.success) {
      if (store.access) {
        navigate('/')
      } else {
        navigate('/store')
      }
    }
  }, [auth])
  return children
}

export default User
