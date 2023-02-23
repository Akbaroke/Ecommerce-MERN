import { discontPercent } from './discountCalc'

const calculatePriceTotal = (price, discountProduct, discountStore) => {
  const discountPrice = discontPercent(price, discountProduct)
  const storeDiscount = discontPercent(discountPrice, discountStore)
  return storeDiscount
}

export default calculatePriceTotal
