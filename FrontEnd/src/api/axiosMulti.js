import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  headers: {
    'Content-type': 'multipart/form-data',
  },
  withCredentials: true,
})
