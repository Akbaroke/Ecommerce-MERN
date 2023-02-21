import ActionType from '../actionType'

export const alertShow = (alertType, title, message) => ({
  type: ActionType.alertShow,
  payload: {
    alertType,
    title,
    message,
  },
})

export const alertHide = () => ({
  type: ActionType.alertHide,
})
