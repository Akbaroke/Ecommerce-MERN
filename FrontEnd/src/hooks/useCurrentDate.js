import { useState, useEffect } from 'react'

const useCurrentDate = () => {
  const [dateNow, setDateNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return dateNow
}

export default useCurrentDate
