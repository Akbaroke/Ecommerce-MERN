import React, { useRef, useState } from 'react'

export default function Team() {
  const suggestions = [
    'akbarmuhammad833@gmail.com',
    'akbaroke833@gmail.com',
    'akbar@gmail.com',
  ]
  const [isFocus, setIsFocus] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef()
  const [inputValue, setInputValue] = useState('')
  return (
    <div className="m-auto mt-10 max-w-lg">
      <div className="mt-10 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search new employee email"
          onBlur={() => {
            if (!isHovered) {
              setIsFocus(false)
            }
          }}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value)
            e.target.value?.length === 0 ? setIsFocus(false) : setIsFocus(true)
          }}
          ref={inputRef}
        />
        {isFocus && (
          <div
            className="shadow-lg absolute w-full"
            onMouseEnter={() => {
              setIsHovered(true)
            }}
            onMouseLeave={() => {
              setIsHovered(false)
            }}
          >
            {suggestions.map((suggestion, index) => {
              const isMatch =
                suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
              return (
                <div key={index}>
                  {isMatch && (
                    <div
                      className="p-5 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setInputValue(suggestion)
                        inputRef.current.focus()
                      }}
                    >
                      {suggestion}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
