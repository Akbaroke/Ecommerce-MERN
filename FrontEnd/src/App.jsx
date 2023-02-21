import React from 'react'
import Router from './router'
import { Provider } from 'react-redux'
import store from './store/redux'
import { SkeletonTheme } from 'react-loading-skeleton'

function App() {
  return (
    <Provider store={store}>
      <div className="dark">
        <div className="bg-white dark:bg-slate-900 min-h-screen dark:text-slate-300">
          <SkeletonTheme baseColor="#242D3D" highlightColor="#354050">
            <Router />
          </SkeletonTheme>
        </div>
      </div>
    </Provider>
  )
}

export default App
