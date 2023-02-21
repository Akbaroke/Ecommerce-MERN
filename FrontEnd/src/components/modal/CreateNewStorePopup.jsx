import { Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { usePopupState } from '../../store/zustand/PopupState'
import withRefreshToken from '../../services/withRefreshToken.service'
import axiosMulti from '../../api/axiosMulti'
import { alertShow } from '../../store/redux/actions/alert.action'
import { useDispatch } from 'react-redux'
import getListStore from '../../utils/getListStore'
import { setListStore } from '../../store/redux/actions/auth.action'

export default function CreateNewStorePopup() {
  const { isOpen, type, togleClosePopup } = usePopupState(state => state)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState()
  const dispatch = useDispatch()
  const [nameStore, setNameStore] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPreview()
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

  const createStoreSubmit = e => {
    e.preventDefault()
    setLoading(true)
    if (nameStore && selectedFile) {
      const sendDataStore = withRefreshToken(async () => {
        try {
          const { data } = await axiosMulti.post('/api/store/create', {
            image: selectedFile,
            nameStore,
          })
          console.log(data)
          console.log(data.data.message)
          dispatch(
            alertShow(
              'success',
              'Create Store Successfully!',
              data.data.message
            )
          )
          getListStore().then(data => dispatch(setListStore(data)))
          togleClosePopup()
        } catch (err) {
          console.log(err)
          dispatch(
            alertShow(
              'error',
              'Create Store Failed!',
              err.response.data.error.message
            )
          )
        } finally {
          setLoading(false)
          setNameStore('')
          setSelectedFile(null)
        }
      })
      sendDataStore()
    } else {
      dispatch(
        alertShow('error', 'Create Store Failed!', 'Please fill all fields!')
      )
    }
  }

  return (
    <Transition
      show={isOpen && type === 'CREATE_STORE'}
      enter="transition-opacity duration-[100ms]"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-[100ms]"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 bottom-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full bg-slate-900/50 backdrop-blur-sm flex items-center"
      >
        <div className="relative w-full h-full max-w-md md:h-auto m-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={togleClosePopup}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                Create New Store
              </h3>
              <p className="mb-6 text-center text-gray-900 dark:text-white text-sm">
                Fill in your store data correctly
              </p>
              <form
                className="space-y-6"
                onSubmit={createStoreSubmit}
                encType="multipart/form-data"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name store :
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name store"
                    value={nameStore}
                    onChange={e => setNameStore(e.target.value)}
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </div>
                <div className="flex items-center justify-center w-full">
                  <label
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 "
                    style={
                      selectedFile && {
                        backgroundImage: `url("${preview}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    }
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
                        ~Profile Picture~
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

                {loading ? (
                  <button
                    disabled
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center w-full justify-center"
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}
