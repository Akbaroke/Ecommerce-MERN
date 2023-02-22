import { discontPercent } from './discountCalc'

const calculatePriceTotal = (price, discountProduct, discountStore) => {
  let priceAfterDiscountProduct = price
  let priceAfterDiscountStore = price

  if (discountProduct > 0) {
    priceAfterDiscountProduct = discontPercent(price, discountProduct)
  }

  if (discountStore > 0) {
    const discountPercentage = discountStore / 100
    priceAfterDiscountStore =
      priceAfterDiscountProduct - priceAfterDiscountProduct * discountPercentage
  }

  return priceAfterDiscountStore
}

export default calculatePriceTotal
