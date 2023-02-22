import React, { useEffect, useState } from 'react'
import { usePopupState } from '../store/zustand/PopupState'
import rupiahFormat from '../utils/rupiahFormat'
import AddProduct from '../components/modal/AddProductPopup'
import EditProductPopup from '../components/modal/EditProductPopup'
import { useSWRContext } from '../store/context/swr-context'
import DeletePopup from '../components/modal/DeletePopoup'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { countforwardTime } from '../utils/epochTranslation'

function Product() {
  const { products, categories } = useSWRContext()
  const [search, setSearch] = useState('')
  const [openLightBox, setOpenLightBox] = useState(false)
  const [viewImage, setViewImage] = useState({ src: '' })
  const {
    togleOpenCreateProduct,
    togleOpenEditProduct,
    togleOpenDeleteProduct,
  } = usePopupState(state => state)
  const [actionId, setActionId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log(products)
    products && setIsLoading(false)
  }, [products])

  return (
    <div>
      {categories && <AddProduct getCategory={categories} />}
      {products && (
        <EditProductPopup
          idProduct={actionId}
          getProduct={products}
          getCategory={categories}
        />
      )}
      {products && <DeletePopup idProduct={actionId} />}
      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        slides={[viewImage]}
        plugins={[Zoom]}
        animation={{ zoom: 500 }}
        zoom={{
          maxZoomPixelRatio: 10,
          scrollToZoom: true,
          doubleTapDelay: 200,
        }}
      />
      <div className="flex justify-between p-5">
        <h1 className="font-semibold  text-[30px]">Product</h1>
        <div className="flex gap-5">
          <button
            onClick={() => {
              togleOpenCreateProduct()
            }}
            className="bg-slate-800 px-4 rounded-lg border border-slate-600 text-sm font-normal hover:bg-slate-600 cursor-pointer">
            Add Product
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
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
      </div>
      <div className="px-5">
        {!isLoading && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  ?.filter(data => {
                    if (search !== '') {
                      return data.nameProduct
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    } else {
                      return true
                    }
                  })
                  ?.map((product, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-2">
                        {countforwardTime(product.updatedAt)}
                      </td>
                      <td className="px-2 py-2">
                        <img
                          className="w-16 h-16 rounded-xl cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-slate-900 hover:rounded-sm transition-all"
                          onClick={() => {
                            setViewImage({ src: product.image.secure_url })
                            setOpenLightBox(true)
                          }}
                          src={product.image.secure_url}
                          alt={product.image.secure_url}
                        />
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                        {product.nameProduct}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        {rupiahFormat(product.price)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {parseInt(product.discount) === 0 ? (
                          '-'
                        ) : (
                          <span className="text-pink-100 bg-pink-800 text-sm font-bold mr-2 px-1 py-0.5 rounded dark:text-pink-700 dark:bg-pink-300 w-max">
                            {product.discount}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center px-6 py-4 space-x-3 h-max">
                          <p
                            onClick={() => {
                              setActionId(product.idProduct)
                              togleOpenEditProduct()
                            }}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                            Edit
                          </p>
                          <p
                            onClick={() => {
                              console.log(product.image.secure_url)
                              console.log(product.idProduct)
                              setActionId(product.idProduct)
                              togleOpenDeleteProduct()
                            }}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">
                            Remove
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Product
