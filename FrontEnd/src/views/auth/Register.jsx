import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  errorRegister,
  loadingRegister,
  succesRegister,
} from '../../store/redux/actions/register.action'
import Stepper from '../../components/Stepper'
import LableError from '../../components/LableError'
import axios from '../../api/axios'
import { alertShow } from '../../store/redux/actions/alert.action'
import getDataIp from '../../utils/getDataIp'
import Label from '../../components/Label'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { IconLoader2 } from '@tabler/icons-react'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const register = useSelector(state => state.register)
  const [matchPassword, setMatchPassword] = useState(true)
  const [isCekEmail, setIsCekEmail] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const cekEmail = async () => {
    if (form.email === '') return setIsCekEmail(false)
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email))
      return setIsCekEmail(false)
    const { status } = await axios.post('/api/cekEmail', {
      email: form.email,
    })
    if (status === 202) return setIsCekEmail(true)
    if (status === 200) return setIsCekEmail(false)
    return setIsCekEmail(false)
  }
  const onchange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handelPasswordIsMatch = e => {
    let dataMatch = 'password'
    if (e.target.name === 'password') {
      dataMatch = 'confirmPassword'
    }
    if (form.confirmPassword === '') {
      setMatchPassword(true)
    } else if (e.target.value !== form[dataMatch]) {
      setMatchPassword(false)
    } else {
      setMatchPassword(true)
    }
  }
  const handelSubmit = async e => {
    e.preventDefault()
    if (form.confirmPassword === form.password && !isCekEmail) {
      dispatch(loadingRegister())
      const IP = await getDataIp()
      try {
        await axios.post('/api/auth/register', {
          ip: IP,
          nama: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        })
        dispatch(succesRegister(form.email))
        dispatch(
          alertShow(
            'success',
            'Registration Successfully!',
            'Please check your email and verify your account.'
          )
        )
        navigate('/verification')
      } catch (error) {
        dispatch(errorRegister(error.response.data.error.message))
        dispatch(
          alertShow(
            'error',
            'Registration Failed!',
            error.response.data.error.message
          )
        )
      }
    }
  }

  return (
    <div className="flex justify-center sm:pt-[10vh] pt-2">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6 mt-5" action="#" onSubmit={handelSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center">
            Register
          </h5>
          <Stepper stepOne="Input Your Data" stepTwo="Email Verification" />
          <div className="grid gap-6 mb-6">
            <div>
              <Label htmlFor="name" text="name" />
              <Input
                name="name"
                placeholder="name"
                minLength={3}
                maxLength={40}
                required
                value={form.name}
                onChange={onchange}
                onKeyDown={e => {
                  ;/[1-9]/.test(e.key) && e.preventDefault()
                }}
              />
            </div>
            <div>
              <Label htmlFor="email" text="email" />
              <Input
                type="email"
                name="email"
                placeholder="name@mail.com"
                required
                value={form.email}
                onChange={onchange}
                onKeyUp={cekEmail}
                onBlur={cekEmail}
              />
              {isCekEmail && (
                <LableError errorMassage="Email already registered." />
              )}
            </div>
            <div>
              <Label htmlFor="password" text="password" />
              <Input
                type="password"
                name="password"
                placeholder="••••••"
                minLength={8}
                maxLength={30}
                required
                value={form.password}
                onChange={onchange}
                onKeyUp={handelPasswordIsMatch}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" text="confirm password" />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                minLength={8}
                maxLength={30}
                required
                value={form.confirmPassword}
                onChange={onchange}
                onKeyUp={handelPasswordIsMatch}
              />
              {!matchPassword && (
                <LableError errorMassage="Password not match" />
              )}
            </div>
          </div>

          {register.loading ? (
            <Button className="cursor-wait" disabled>
              <IconLoader2 className="animate-spin" />
              continue
            </Button>
          ) : (
            <Button type="submit">continue</Button>
          )}

          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            You have account ?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer">
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
