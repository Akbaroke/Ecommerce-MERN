import ActionType from '../actionType'
const initialStateRegister = {
  loading: false,
  error: false,
  success: false,
  email: '',
  message: '',
}

const reducerRegister = (state = initialStateRegister, action) => {
  switch (action.type) {
    case ActionType.successRegister:
      return {
        loading: false,
        error: false,
        success: true,
        email: action.payload.email,
        message: 'Register successful.',
      }
    case ActionType.errorRegister:
      return {
        loading: false,
        error: true,
        success: false,
        email: '',
        message: action.payload.message,
      }
    case ActionType.resetRegister:
      return initialStateRegister
    case ActionType.loadingRegister:
      return { ...state, loading: true }
    default:
      return state
  }
}

export default reducerRegister
