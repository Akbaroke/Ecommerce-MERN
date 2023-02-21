import React from 'react'

export default function LableError({ errorMassage }) {
  return (
    <p className="mt-2 text-right text-sm text-red-600 dark:text-red-500">
      <span className="font-medium">Oops!</span> {errorMassage}
    </p>
  )
}
