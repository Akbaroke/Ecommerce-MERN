export const discontPercent = (price, discont) => {
  return price - price * (discont / 100)
}

export const discontNominal = (price, discont) => {
  return price - discont
}
