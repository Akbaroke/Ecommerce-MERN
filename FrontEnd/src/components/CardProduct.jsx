import React, { useState } from 'react'
import LabelPriceDiscont from './LabelPriceDiscont'
import rupiahFormat from '../utils/rupiahFormat'
import { countdownTime } from '../utils/epochTranslation'
import { IconShoppingCartPlus } from '@tabler/icons-react'
import { useSWRContext } from '../store/context/swr-context'
import useCurrentDate from '../hooks/useCurrentDate'

function CardProduct({ data }) {
  const { profileStore } = useSWRContext()
  const [isLoading, setIsLoading] = useState(true)
  const currentDate = useCurrentDate()

  return (
    <div className="w-52 h-[400px] rounded-md overflow-hidden border dark:bg-slate-800 dark:border-slate-600 relative">
      <div className="w-full h-[206px] dark:bg-slate-700 relative overflow-hidden">
        <svg
          className="w-12 h-12 text-gray-200 absolute top-[70px] right-[78px] z-0"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 640 512">
          <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
        </svg>
        <img
          src={data.image.secure_url}
          alt={data.image.secure_url}
          className={`w-full relative transition-all z-20 ${
            isLoading && 'blur-sm'
          }`}
          onLoad={() =>
            setTimeout(() => {
              setIsLoading(false)
            }, 1000)
          }
        />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="flex justify-between relative">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded w-max capitalize dark:bg-gray-700 dark:text-gray-300 mb-3">
            {data.category}
          </span>
          <div className="p-2 rounded-full absolute -right-1 -top-1 hover:bg-slate-700 cursor-pointer hover:scale-125 transition-all dark:text-slate-400 hover:dark:text-slate-100">
            <IconShoppingCartPlus className="w-5 h-5" />
          </div>
        </div>
        <h3 className="capitalize font-medium">{data.nameProduct}</h3>
        {data.discount > 0 || profileStore?.discount > 0 ? (
          <LabelPriceDiscont
            price={data.price}
            discountProduct={data.discount}
            discountStore={profileStore?.discount}
          />
        ) : (
          <h1 className="text-[20px] font-bold">{rupiahFormat(data.price)}</h1>
        )}

        {currentDate && (
          <div className="absolute bottom-2 right-0 w-full flex justify-between px-3">
            <p className="text-xs">
              Update {countdownTime(parseInt(data.updatedAt), currentDate)}
            </p>
            <div className="flex gap-2 fill-gray-600">
              <svg
                className="w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512">
                <path d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z" />
              </svg>
              <p className="text-sm font-medium">{data.stock}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardProduct
