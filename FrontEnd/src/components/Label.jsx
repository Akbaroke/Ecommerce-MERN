import React from 'react'

export default function Label({ text, children, ...props }) {
  return (
    <label
      {...props}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
      {text || children}
    </label>
  )
}
