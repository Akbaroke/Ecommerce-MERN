import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Stepper({ active, stepOne, stepTwo }) {
  const navigate = useNavigate()
  return (
    <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700">
      <li
        onClick={active ? () => navigate(-1) : null}
        className={`flex items-center text-blue-600 dark:text-blue-500 ${
          active && 'cursor-pointer'
        }`}
      >
        <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          1
        </span>
        {stepOne}
        <svg
          aria-hidden="true"
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </li>
      <li
        className={`flex items-center ${
          active && 'text-blue-600 dark:text-blue-500'
        }`}
      >
        <span
          className={`lex items-center justify-center w-5 h-5 mr-2 text-xs border rounded-full shrink-0 ${
            active
              ? 'border-blue-600 dark:border-blue-500'
              : 'border-gray-500 dark:border-gray-400'
          }`}
        >
          2
        </span>
        {stepTwo}
      </li>
    </ol>
  )
}
