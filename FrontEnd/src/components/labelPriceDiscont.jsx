import React, { useEffect, useState } from 'react'
import rupiahFormat from '../utils/rupiahFormat'
import calculatePriceTotal from '../utils/calculatePriceTotal'

function LabelPriceDiscont({ price, discountProduct, discountStore }) {
  const [priceTotal, setPriceTotal] = useState(0)

  useEffect(() => {
    const priceTotal = calculatePriceTotal(
      price,
      discountProduct,
      discountStore
    )
    setPriceTotal(priceTotal)
  }, [price, discountStore])

  return (
    <div>
      <h1 className="text-[20px] font-bold">{rupiahFormat(priceTotal)}</h1>
      <div className="flex items-center gap-1 mt-2">
        {discountProduct > 0 && (
          <span className="text-pink-100 bg-pink-800 text-sm font-bold px-1 py-0.5 rounded dark:text-pink-700 dark:bg-pink-300 w-max">
            {discountProduct}%
          </span>
        )}
        {discountProduct > 0 && discountStore > 0 && <p>+</p>}
        {discountStore > 0 && (
          <span className="text-blue-100-100 bg-blue-800 text-sm font-bold px-1 py-0.5 rounded dark:text-blue-700 dark:bg-blue-300 w-max">
            {discountStore}%
          </span>
        )}
        <p className="line-through text-gray-500 text-[15px] ml-2">
          {rupiahFormat(price)}
        </p>
      </div>
    </div>
  )
}

export default LabelPriceDiscont
