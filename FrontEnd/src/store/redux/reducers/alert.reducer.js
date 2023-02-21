import ActionType from '../actionType'
const initialStateAlert = {
  show: false,
  alertType: '',
  title: '',
  message: '',
}

const alert = (state = initialStateAlert, action) => {
  switch (action.type) {
    case ActionType.alertShow:
      return {
        show: true,
        alertType: action.payload.alertType,
        title: action.payload.title,
        message: action.payload.message,
      }
    case ActionType.alertHide:
      return {
        show: false,
        alertType: '',
        title: '',
        message: '',
      }
    default:
      return state
  }
}

export default alert
