import ActionType from '../actionType'

export const successLogin = (email, name, role, token) => ({
  type: ActionType.successLogin,
  payload: {
    email,
    name,
    role,
    token,
  },
})

export const errorLogin = message => ({
  type: ActionType.errorLogin,
  payload: {
    message,
  },
})

export const verifyLogin = email => ({
  type: ActionType.verifyLogin,
  payload: {
    email,
  },
})

export const LogoutAuth = () => ({
  type: ActionType.Logout,
})

export const loadingAuth = () => ({
  type: ActionType.loadingAuth,
})

export const setListStore = listStore => ({
  type: ActionType.setListStore,
  payload: listStore,
})