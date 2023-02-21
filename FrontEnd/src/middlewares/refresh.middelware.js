import axios from '../api/axios'
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { errorLogin, successLogin } from '../store/redux/actions/auth.action'
import {
  setAccessStore,
  unsetAccessStore,
} from '../store/redux/actions/store.action'
import { Decrypt } from '../utils/encrypt-decrypt'

function Refresh({ children }) {
  const token = localStorage.getItem('token')
  const store = localStorage.getItem('store')
  const dispatch = useDispatch()
  const [expired, setExpired] = useState(0)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (token) {
      try {
        setExpired(jwt_decode(token).exp)
        setEmail(jwt_decode(token).email)
        setName(jwt_decode(token).nama)
        setRole(jwt_decode(token).role)
        dispatch(successLogin(email, name, role, token))
      } catch (error) {
        localStorage.removeItem('token')
        window.location.replace('/login')
      }
    } else {
      dispatch(errorLogin())
      dispatch(unsetAccessStore())
    }
    if (store) {
      const obj = Decrypt(store)[0]
      const dataStore = {
        id: obj.idStore,
        name: obj.nameStore,
        role: obj.role,
        image: obj.image,
        data: store,
      }
      dispatch(setAccessStore(dataStore))
    }
  }, [])

  useEffect(() => {
    if (token && expired > 0) {
      const updateToken = async () => {
        try {
          const myEpoch = new Date().getTime()
          if (expired * 1000 < myEpoch) {
            const { data } = await axios.get('/api/auth/refreshToken', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            dispatch(successLogin(email, name, role, data.data.accessToken))
          } else {
            dispatch(successLogin(email, name, role, token))
          }
        } catch (error) {
          if (error.response.status === 401) {
            dispatch(successLogin(email, name, role, token))
          } else {
            localStorage.removeItem('token')
            dispatch(unsetAccessStore())
          }
        }
      }
      updateToken()
    }
  }, [expired])

  return children
}

export default Refresh
