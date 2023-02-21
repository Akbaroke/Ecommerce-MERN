import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import sendOtp from '../../services/sendOtp.service'
import { useDispatch, useSelector } from 'react-redux'
import {
  errorLogin,
  loadingAuth,
  successLogin,
  verifyLogin,
} from '../../store/redux/actions/auth.action'
import { alertShow } from '../../store/redux/actions/alert.action'
import Label from '../../components/Label'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { IconLoader2 } from '@tabler/icons-react'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleLogin = async e => {
    e.preventDefault()
    dispatch(loadingAuth())
    try {
      const { data } = await axios.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      })
      dispatch(
        successLogin(data.data.email, '', '', data.data.token.accessToken)
      )
      dispatch(alertShow('success', 'Login Successfully!', 'Welcome Home.'))
      navigate('/store')
    } catch (error) {
      if (error.response.status === 403) {
        navigate('/verification')
        sendOtp(form.email, 'register')
        dispatch(verifyLogin(form.email))
        dispatch(
          alertShow(
            'success',
            'Verification Account!',
            'Please check your email.'
          )
        )
      } else {
        dispatch(errorLogin(error.response.data.error.message))
        dispatch(
          alertShow('error', 'Login Failed!', error.response.data.error.message)
        )
      }
    }
  }

  const onchange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex justify-center sm:pt-[10vh] pt-2">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" action="#" onSubmit={handleLogin}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center">
            Log In
          </h5>
          <div>
            <Label htmlFor="email" text="email" />
            <Input
              type="email"
              name="email"
              placeholder="name@mail.com"
              required
              value={form.email}
              onChange={onchange}
            />
          </div>
          <div>
            <Label htmlFor="password" text="password" />
            <Input
              type="password"
              name="password"
              placeholder="••••••"
              required
              value={form.password}
              onChange={onchange}
            />
          </div>
          <div className="flex items-start">
            <Link
              to="/fotgot"
              className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">
              Lost Password?
            </Link>
          </div>
          {auth.loading ? (
            <Button className="cursor-wait" disabled>
              <IconLoader2 className="animate-spin" />
              login
            </Button>
          ) : (
            <Button type="submit">login</Button>
          )}
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered ?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer">
              Create account
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
