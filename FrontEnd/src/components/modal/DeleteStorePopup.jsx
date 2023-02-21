import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { usePopupState } from '../../store/zustand/PopupState'
import { useSWRContext } from '../../store/context/swr-context'
import Input from '../Input'
import Button from '../Button'
import axios from '../../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import withRefreshToken from '../../services/withRefreshToken.service'
import { alertShow } from '../../store/redux/actions/alert.action'
import { unsetAccessStore } from '../../store/redux/actions/store.action'
import { useNavigate } from 'react-router-dom'

export default function DeleteStorePopup() {
  const { profileStore } = useSWRContext()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useSelector(state => state.store)
  const { isOpen, type, togleClosePopup } = usePopupState(state => state)
  const [validation, setValidation] = useState('')

  const handleClickDelete = withRefreshToken(async () => {
    try {
      await axios.delete(`/api/store/${id}`)
      dispatch(
        alertShow(
          'success',
          `Your store "${validation}" was successfully deleted.`,
          ''
        )
      )
      togleClosePopup()
      dispatch(unsetAccessStore())
      navigate('/store')
    } catch (error) {
      console.log(error)
      dispatch(
        alertShow('error', `Toko Anda "${validation}" berhasil dihapus.`, '')
      )
      togleClosePopup()
      dispatch(unsetAccessStore())
      navigate('/store')
    }
  })

  return (
    <Transition
      show={isOpen && type === 'DELETE_STORE'}
      enter="transition-opacity duration-[100ms]"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-[100ms]"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <div
        tabIndex={-1}
        className="fixed top-0 left-0 right-0 bottom-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full bg-slate-900/50 backdrop-blur-sm flex items-center">
        <div className="relative w-full h-full max-w-md md:h-auto m-auto bg-slate-700 rounded-md">
          <div className="flex border-b border-slate-400/50 p-5">
            <div>Are you absolutely sure?</div>
            <div className="bg-white rounded-lg shadow dark:bg-gray-700">
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
            </div>
          </div>
          <div className="p-5">
            <p>
              This action cannot be undone. This will permanently delete store
              <b> {profileStore.nameStore}</b> , product, history, image, and
              remove all employee associations.
            </p>
            <p className="pt-5 pb-2">
              Please type <b>{profileStore.nameStore}</b> to confirm.
            </p>
            <Input
              value={validation}
              onChange={e => setValidation(e.target.value)}
            />
            {validation.toLowerCase() ===
              profileStore.nameStore.toLowerCase() && (
              <Button
                text="I understand the consequences, delete this repository"
                style="border border-gray-500 bg-slate-800/50 text-red-600 focus:ring-0 active:scale-95 mt-3"
                onClick={handleClickDelete}
              />
            )}
          </div>
        </div>
      </div>
    </Transition>
  )
}
