import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRContext } from '../store/context/swr-context'
import { useDispatch } from 'react-redux'
import { alertShow } from '../store/redux/actions/alert.action'

function SingleAuth(props) {
  const { statusToken } = useSWRContext()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(statusToken?.status)
    if (statusToken?.status === 400) {
      navigate('/login')
      localStorage.removeItem('token')
      localStorage.removeItem('store')
      dispatch(
        alertShow(
          'error',
          'You are forced out!',
          'Account can only login in one browser.'
        )
      )
    }
  }, [statusToken?.status])
  return props.render
}

export default SingleAuth
