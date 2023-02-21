import { combineReducers } from '@reduxjs/toolkit'
import reducerRegister from './register.reducer'
import alert from './alert.reducer'
import reducerAuth from './auth.reducer'
import reducerStore from './store.reducer'
import product from './product.reducer'

const rootReducer = combineReducers({
  register: reducerRegister,
  alert: alert,
  auth: reducerAuth,
  store: reducerStore,
  product: product,
})

export default rootReducer
