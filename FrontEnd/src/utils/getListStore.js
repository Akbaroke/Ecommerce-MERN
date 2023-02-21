import axios from '../api/axios'
import withRefreshToken from '../services/withRefreshToken.service'
import { Decrypt } from './encrypt-decrypt'

const getListStore = withRefreshToken(async () => {
  try {
    const respose = await axios.get('/api/stores')
    if (respose.status === 202) return []
    return Decrypt(respose.data.data)
  } catch (error) {
    console.log(error)
    return []
  }
})

export default getListStore
