import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center dark:bg-slate-900">
      <h1 className="text-9xl font-extrabold text-blue-600 dark:text-white tracking-widest">
        404
      </h1>
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute text-white dark:text-slate-900">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          to="/login"
          className="relative inline-block text-sm font-medium text-blue-600 dark:text-[#FF6A3D] group"
        >
          <span className="relative block px-8 py-3 dark:bg-slate-900 border-2 border-current rounded-lg text-white bg-blue-600 hover:bg-blue-800 transition-all dark:text-[#FF6A3D] dark:hover:bg-slate-800">
            <router-link to="/">Go Home</router-link>
          </span>
        </Link>
      </button>
    </main>
  )
}
