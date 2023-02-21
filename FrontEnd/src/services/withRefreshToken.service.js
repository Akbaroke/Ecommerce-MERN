import axios from '../api/axios'
import jwt_decode from 'jwt-decode'
import axiosMulti from '../api/axiosMulti'

const refreshToken = async () => {
  const token = localStorage.getItem('token')

  try {
    const myEpoch = new Date().getTime()
    if (jwt_decode(token).exp * 1000 > myEpoch) return token
    const { data } = await axios.get('/api/auth/refreshToken', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    localStorage.setItem('token', data.data.accessToken)
    return data.data.accessToken
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.setItem('token', token)
      return token
    }
    window.location.replace('/login')
    localStorage.removeItem('token')
    localStorage.removeItem('store')
  }
}

const withRefreshToken =
  next =>
  async (...args) => {
    const newToken = await refreshToken()
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    axiosMulti.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    return next(...args)
  }

export default withRefreshToken
