import React from 'react'

export default function Input({ type = 'text', ...props }) {
  return (
    <input
      {...props}
      type={type}
      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-11 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 transition duration-300"
    />
  )
}
