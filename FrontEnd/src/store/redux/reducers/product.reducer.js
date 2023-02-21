import ActionType from '../actionType'
const initialStateProduct = {
  list: [],
  category: [],
}

const product = (state = initialStateProduct, action) => {
  switch (action.type) {
    case ActionType.setCategoryList:
      return {
        ...state,
        category: action.payload,
      }
    case ActionType.setProductList:
      return {
        ...state,
        list: action.payload,
      }
    default:
      return state
  }
}

export default product
