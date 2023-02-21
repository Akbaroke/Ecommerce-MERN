import React, { useEffect, useState } from 'react'
import CardProduct from '../components/CardProduct'
import CardProdukSkeleton from '../components/skeleton/CardProdukSkeleton'
import { useSWRContext } from '../store/context/swr-context'

export default function Home() {
  const { products, categories } = useSWRContext()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (search !== '') {
      setFilter('')
    }
  }, [search])

  useEffect(() => {
    products && setIsLoading(true)
  }, [products])

  return (
    <div className="dark:text-white">
      <div className="flex justify-between gap-5 items-center m-5">
        <div className="flex gap-3 w-full overflow-auto py-3">
          <div
            className={`min-w-[150px] text-center dark:bg-slate-800 p-2 rounded-md border dark:border-slate-600 cursor-pointer hover:dark:bg-slate-700 hover:dark:border-slate-700 transition-all ${
              filter === '' ? 'dark:bg-slate-700' : null
            }`}
            onClick={() => setFilter('')}
          >
            <h3 className="text-[16px] font-medium capitalize">All</h3>
            <p className="text-[14px] font-light">
              {products?.length || 0} item
            </p>
          </div>
          {categories?.length > 0 &&
            categories?.map((data, index) => (
              <div
                key={index}
                className={`min-w-[150px] text-center dark:bg-slate-800 p-2 rounded-md border dark:border-slate-600 cursor-pointer hover:dark:bg-slate-700 hover:dark:border-slate-700 transition-all ${
                  filter === data.category ? 'dark:bg-slate-700' : null
                }`}
                onClick={() => setFilter(data.category)}
              >
                <h3 className="text-[16px] font-medium capitalize">
                  {data.category}
                </h3>
                <p className="text-[14px] font-light">{data.count} item</p>
              </div>
            ))}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[250px] pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-self-start gap-5 px-5">
        {!isLoading ? (
          <CardProdukSkeleton cards={8} />
        ) : (
          products
            ?.filter(data => {
              if (search !== '') {
                return data.nameProduct
                  .toLowerCase()
                  .includes(search.toLowerCase())
              } else if (filter !== '') {
                return data.category === filter
              } else {
                return true
              }
            })
            ?.map(data => <CardProduct data={data} key={data.idProduct} />)
        )}
      </div>
    </div>
  )
}