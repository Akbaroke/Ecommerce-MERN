import { Alert } from 'flowbite-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { alertHide } from '../../store/redux/actions/alert.action'

function SuccessAlert({ title, message }) {
  const dispatch = useDispatch()
  return (
    <Alert
      color="success"
      onDismiss={function onDismiss() {
        return dispatch(alertHide())
      }}
    >
      <span>
        <span className="font-medium">{title}!</span> {message}
      </span>
    </Alert>
  )
}

export default SuccessAlert
