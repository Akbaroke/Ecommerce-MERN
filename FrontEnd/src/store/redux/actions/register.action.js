import ActionType from '../actionType'

export const succesRegister = email => ({
  type: ActionType.successRegister,
  payload: {
    email,
  },
})

export const errorRegister = message => ({
  type: ActionType.errorRegister,
  payload: {
    message,
  },
})

export const loadingRegister = () => ({
  type: ActionType.loadingRegister,
})

export const resetRegister = () => ({
  type: ActionType.resetRegister,
})