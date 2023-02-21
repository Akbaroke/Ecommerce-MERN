import CryptoJS from 'crypto-js'

export const Encrypt = data => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_APP_SALTHASHIDS
  ).toString()
}

export const Decrypt = data => {
  return JSON.parse(
    CryptoJS.AES.decrypt(data, import.meta.env.VITE_APP_SALTHASHIDS).toString(
      CryptoJS.enc.Utf8
    )
  )
}
