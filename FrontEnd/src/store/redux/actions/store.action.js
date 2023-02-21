import ActionType from '../actionType'

export const setAccessStore = ({ id, name, role, image, data }) => ({
  type: ActionType.SET_ACCESS_STORE,
  payload: {
    id,
    name,
    role,
    image,
    data,
  },
})

export const unsetAccessStore = () => ({
  type: ActionType.UNSET_ACCESS_STORE,
})
