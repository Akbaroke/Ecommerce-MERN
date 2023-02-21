import axios from '../api/axios'
import getDataIp from '../utils/getDataIp'

const sendOtp = async (email, type) => {
  const ip = await getDataIp()
  try {
    const cekLimit = CekLimitIp(email, type)
    cekLimit.then(res => {
      if (res) {
        send(email, type)
      }
    })
  } catch (error) {
    console.log(error, 'kirim gagal')
  }

  const send = async (email, type) => {
    await axios.post('/api/otp', {
      ip: ip,
      email: email,
      type: type,
    })
    console.log('kirim berhasil')
  }
}

async function CekLimitIp(email, type) {
  const ip = await getDataIp()
  try {
    await axios.post('/api/otp/limit', {
      ip,
      email,
      type,
    })
    return true
  } catch (error) {
    return false
  }
}

export default sendOtp
