import { Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { usePopupState } from '../../store/zustand/PopupState'
import withRefreshToken from '../../services/withRefreshToken.service'
import axiosMulti from '../../api/axiosMulti'
import { alertShow } from '../../store/redux/actions/alert.action'
import { useDispatch, useSelector } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import { useSWRConfig } from 'swr'
import Label from '../Label'
import Input from '../Input'
import Button from '../Button'
import { IconLoader2 } from '@tabler/icons-react'

export default function EditProductPopup({
  idProduct,
  getProduct,
  getCategory,
}) {
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()
  const { id } = useSelector(state => state.store)
  const { isOpen, type, togleClosePopup } = usePopupState(state => state)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState()
  const [nameProduct, setNameProduct] = useState('')
  const [priceProduct, setPriceProduct] = useState()
  const [discountProduct, setDiscountProduct] = useState('')
  const [stockProduct, setstockProduct] = useState()
  const [detailProduct, setDetailProduct] = useState('')
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [category, setCategory] = useState([])

  useEffect(() => {
    const newCategory = getCategory?.map((item, index) => {
      return {
        id: index + 1,
        category: item.category,
      }
    })
    setCategory(newCategory)
  }, [getCategory])

  const lowerCasedCompanies = category?.map(company => {
    return {
      id: company.id,
      name: company.category.toLowerCase(),
    }
  })

  function getSuggestions(value) {
    return lowerCasedCompanies.filter(company =>
      company.name.includes(value.trim().toLowerCase())
    )
  }

  useEffect(() => {
    setValueProduct()
  }, [isOpen])

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  const handleDragOver = event => {
    event.preventDefault()
  }

  const handleDrop = event => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      let files = Array.from(event.dataTransfer.files)
      setSelectedFile(files[0])
    }
  }

  const setValueProduct = () => {
    getProduct
      ?.filter(item => item.idProduct === idProduct)
      ?.map(data => {
        setNameProduct(data.nameProduct)
        setPriceProduct(data.price)
        setDiscountProduct(data.discount)
        setstockProduct(data.stock)
        setDetailProduct(data.detail)
        setValue(data.category)
        setPreview(data.image.secure_url)
      })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (
      nameProduct &&
      priceProduct &&
      stockProduct &&
      detailProduct &&
      value &&
      preview
    ) {
      setLoading(true)
      const sendDataProduct = withRefreshToken(async () => {
        try {
          const { data } = await axiosMulti.put(
            `/api/product?is=${id}&ip=${idProduct}`,
            {
              nameProduct,
              price: priceProduct,
              discount: discountProduct?.length > 0 ? discountProduct : 0,
              stock: stockProduct,
              category: value,
              detail: detailProduct,
              image: selectedFile?.length > 0 ? selectedFile : undefined,
            }
          )
          mutate(`/api/product/${id}`)
          mutate(`/api/product/category/${id}`)
          togleClosePopup()
          setLoading(false)
          dispatch(
            alertShow(
              'success',
              'Edit Product Successfully!',
              data.data.message
            )
          )
        } catch (err) {
          console.log(err)
          togleCloseCreateStore()
          setLoading(false)
          dispatch(
            alertShow(
              'error',
              'Edit Product Failed!',
              err.response.data.error.message
            )
          )
        }
      })
      sendDataProduct()
    }
  }

  return (
    <Transition show={isOpen && type === 'EDIT_PRODUCT'}>
      <div
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 bottom-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full bg-slate-900/50 backdrop-blur-sm flex items-center">
        <div className="relative w-full h-full max-w-md md:h-auto m-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={togleClosePopup}>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="text-xl text-center font-medium text-gray-900 dark:text-white">
                Edit Product
              </h3>
              <p className="mb-6 text-center text-gray-900 dark:text-white text-sm">
                Fill in your product data correctly
              </p>
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                encType="multipart/form-data">
                <div>
                  <Label htmlFor="name" text="product name :" />
                  <Input
                    name="name"
                    placeholder="name"
                    value={nameProduct}
                    onChange={e => setNameProduct(e.target.value)}
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price" text="price :" />
                  <Input
                    type="number"
                    name="price"
                    placeholder="10000"
                    value={priceProduct}
                    onChange={e => setPriceProduct(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount" text="discount :" />
                  <Input
                    type="number"
                    name="discount"
                    placeholder="0"
                    value={discountProduct}
                    onChange={e => setDiscountProduct(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stock" text="stock :" />
                  <Input
                    type="number"
                    name="stock"
                    placeholder="1"
                    value={stockProduct}
                    onChange={e => setstockProduct(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="detail" text="detail :" />
                  <Input
                    name="detail"
                    placeholder="-"
                    value={detailProduct}
                    onChange={e => setDetailProduct(e.target.value)}
                    minLength={1}
                    maxLength={200}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" text="category :" />
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    onSuggestionsFetchRequested={({ value }) => {
                      setValue(value)
                      setSuggestions(getSuggestions(value))
                    }}
                    onSuggestionSelected={(_, { suggestionValue }) =>
                      setValue(suggestionValue)
                    }
                    getSuggestionValue={suggestion => suggestion.name}
                    renderSuggestion={suggestion => (
                      <span className="py-2 px-3 cursor-pointer dark:hover:bg-gray-800 transition-all flex items-center gap-2 dark:bg-gray-600 capitalize">
                        {suggestion.name}
                      </span>
                    )}
                    inputProps={{
                      placeholder: 'Category',
                      className:
                        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white',
                      value: value,
                      onChange: (_, { newValue }) => {
                        setValue(newValue)
                      },
                    }}
                    highlightFirstSuggestion={true}
                  />
                </div>

                <div>
                  <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Image :
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 "
                      style={{
                        backgroundImage: `url("${preview}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPEG, PNG or JPG (MAX. 1000KB)
                        </p>
                      </div>
                    </label>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={onSelectFile}
                      accept="image/png, image/jpeg"
                    />
                  </div>
                </div>

                {loading ? (
                  <Button className="cursor-wait" disabled>
                    <IconLoader2 className="animate-spin" />
                    save...
                  </Button>
                ) : (
                  <Button type="submit" text="save" />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}
