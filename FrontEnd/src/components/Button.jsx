import React from 'react'

export default function Button({
  text,
  children,
  style = 'focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-700 hover:bg-blue-800 dark:focus:ring-blue-800',
  className,
  ...props
}) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 w-full focus:outline-none rounded-lg text-sm font-semibold p-3 text-center focus:ring-4 capitalize [&>svg]:w-5 [&>svg]:h-5 [&>svg]:mt-1 ${style} ${className}`}>
      {text || children}
    </button>
  )
}
