import ActionType from '../actionType'

export const setCategoryList = category => ({
  type: ActionType.setCategoryList,
  payload: category,
})

export const setProductList = products => ({
  type: ActionType.setProductList,
  payload: products,
})
