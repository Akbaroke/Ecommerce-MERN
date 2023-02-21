import ActionType from '../actionType'
const initialStateAuth = {
  loading: false,
  error: false,
  success: false,
  email: '',
  name: '',
  role: '',
  message: '',
  token: '',
  listStore: [],
}

const reducerAuth = (state = initialStateAuth, action) => {
  switch (action.type) {
    case ActionType.successLogin:
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        email: action.payload.email,
        name: action.payload.name,
        role: action.payload.role,
        message: 'Login successful.',
        token: action.payload.token,
      }
    case ActionType.errorLogin:
      localStorage.removeItem('token')
      return {
        loading: false,
        error: true,
        success: false,
        email: '',
        name: '',
        role: '',
        message: action.payload.message,
        token: '',
        listStore: [],
      }
    case ActionType.verifyLogin:
      return {
        ...state,
        loading: false,
        email: action.payload.email,
      }
    case ActionType.Logout:
      localStorage.removeItem('token')
      return {
        loading: false,
        error: false,
        success: false,
        email: '',
        name: '',
        role: '',
        message: '',
        token: '',
        listStore: [],
      }
    case ActionType.loadingAuth:
      return { ...state, loading: true }
    case ActionType.setListStore:
      return {
        ...state,
        listStore: action.payload,
      }
    default:
      return state
  }
}

export default reducerAuth
