import React, { useEffect, useState } from 'react'
import Stepper from '../../components/Stepper'
import hideEmail from '../../utils/hideEmail'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import { alertShow } from '../../store/redux/actions/alert.action'
import sendOtp from '../../services/sendOtp.service'

export default function Verification() {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const register = useSelector(state => state.register)
  const [limitResendOtp, setLimitResendOtp] = useState(60)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const countDown = setInterval(() => {
      setLimitResendOtp(limitResendOtp - 1)
    }, 1000)

    return () => clearInterval(countDown)
  }, [limitResendOtp])

  const verifiOtpRegister = async otp => {
    try {
      const { data } = await axios.post('/api/auth/verifyAccount', { otp })
      setOtpError(false)
      navigate('/login')
      dispatch(
        alertShow('success', 'Verification Successfully!', data.data.message)
      )
    } catch (error) {
      console.log(error)
      setOtpError(true)
      setOtp('')
      setTimeout(() => {
        setOtpError(false)
      }, 5000)
      dispatch(
        alertShow(
          'error',
          'Verification Failed!',
          error.response.data.error.message
        )
      )
    }
  }

  const email = register.email || auth.email
  const handleResendOtp = () => {
    setLimitResendOtp(60)
    sendOtp(email, 'register')
    dispatch(
      alertShow(
        'success',
        'Resend Success!',
        'Please check your email, OTP expired 5 minute.'
      )
    )
  }

  useEffect(() => {
    if (otp.length === 4) {
      verifiOtpRegister(otp)
    } else if (otp.length === 1) {
      setOtpError(false)
    }
  }, [otp])

  return (
    <div className="flex justify-center pt-20">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6 mt-5" action="#">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center capitalize">
            Account Verification
          </h5>
          <Stepper
            active
            stepOne={'Input Your Data'}
            stepTwo={'Email Verification'}
          />
          <div className="grid gap-6 mb-6">
            <div className="text-center">
              <p className="font-medium text-gray-500 dark:text-gray-300 text-center ">
                Enter your OTP from email.
              </p>
              <p className="text-sm font-light dark:text-gray-400 ">
                {email && hideEmail(register.email || auth.email)}
              </p>
            </div>
            <div>
              <input
                type="password"
                className={
                  otpError
                    ? 'bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500 max-w-[150px] m-auto text-center tracking-[1mm] font-bold'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-[150px] m-auto text-center tracking-[1mm] font-bold'
                }
                maxLength={4}
                placeholder="1234"
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
            Not receiving otp ?{' '}
            {limitResendOtp <= 0 ? (
              <span
                onClick={() => handleResendOtp()}
                className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer"
              >
                Resend Email
              </span>
            ) : (
              <span className="countdown text-blue-700 dark:text-blue-500">
                <span style={{ '--value': limitResendOtp }}></span>s
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
