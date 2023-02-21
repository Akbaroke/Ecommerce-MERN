import React from 'react'
import { discontPercent } from '../utils/discountCalc'
import rupiahFormat from '../utils/rupiahFormat'

function labelPriceDiscont(price, percent) {
  return (
    <div>
      <h1 className="text-[20px] font-bold">
        {rupiahFormat(discontPercent(price, percent))}
      </h1>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-pink-100 bg-pink-800 text-sm font-bold mr-2 px-1 py-0.5 rounded dark:text-pink-700 dark:bg-pink-300 w-max">
          {percent}%
        </span>
        <p className="line-through text-gray-500 text-[15px]">
          {rupiahFormat(price)}
        </p>
      </div>
    </div>
  )
}

export default labelPriceDiscont
