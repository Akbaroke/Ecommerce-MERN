import ActionType from '../actionType'
const initialStateStore = {
  access: false,
  id: '',
  name: '',
  role: '',
  image: '',
  data: '',
}

const reducerStore = (state = initialStateStore, action) => {
  switch (action.type) {
    case ActionType.SET_ACCESS_STORE:
      const newState = {
        access: true,
        id: action.payload.id,
        name: action.payload.name,
        role: action.payload.role,
        image: action.payload.image,
        data: action.payload.data,
      }
      localStorage.setItem('store', action.payload.data)
      return newState
    case ActionType.UNSET_ACCESS_STORE:
      localStorage.removeItem('store')
      return {
        access: false,
        id: '',
        name: '',
        role: '',
        image: '',
        data: '',
      }
    default:
      return state
  }
}

export default reducerStore
