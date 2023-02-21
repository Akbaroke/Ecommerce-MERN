import { Alert } from 'flowbite-react'
import React from 'react'

function ErrorAlert({ title, message }) {
  return (
    <Alert color="failure">
      <span>
        <span className="font-medium">{title}!</span> {message}
      </span>
    </Alert>
  )
}

export default ErrorAlert
