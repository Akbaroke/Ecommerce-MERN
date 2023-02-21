import React, { useEffect } from 'react'
import { usePopupState } from '../store/zustand/PopupState'
import { useDispatch, useSelector } from 'react-redux'
import { setAccessStore } from '../store/redux/actions/store.action'
import { useNavigate } from 'react-router-dom'
import { setListStore } from '../store/redux/actions/auth.action'
import getListStore from '../utils/getListStore'
import { Encrypt } from '../utils/encrypt-decrypt'
import Button from '../components/Button'

function ListStore() {
  const { togleOpenCreateStore } = usePopupState(state => state)
  const { listStore } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    getListStore().then(data => dispatch(setListStore(data)))
  }, [])

  const handleChooseStore = data => {
    dispatch(setAccessStore(data))
    navigate('/')
  }

  return (
    <div className="w-max m-auto py-10 dark:text-slate-300 text-center">
      <h2 className="text-lg">List Store</h2>
      <p>choose your store cashier.</p>
      <div className="mt-8 flex flex-col gap-4">
        {listStore?.map(data => (
          <div
            key={data.idStore}
            onClick={() =>
              handleChooseStore({
                id: data.idStore,
                name: data.nameStore,
                role: data.role,
                image: data.image,
                data: Encrypt(listStore),
              })
            }
            className="flex text-left items-center justify-between w-[330px] bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 p-3">
            <div className="flex gap-3 items-center">
              <img
                src={data.image}
                alt="store picture"
                className="w-10 h-10 rounded-full border-2 border-slate-700 dark:border-slate-400 bg-slate-600"
              />
              <div>
                <h3 className="capitalize text-[15px] mb-1">
                  {data.nameStore}
                </h3>
                <span
                  className={`capitalize bg-green-100 ${
                    data.role === 'owner'
                      ? 'text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'
                      : 'text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'
                  }`}>
                  {data.role}
                </span>
              </div>
            </div>
            <svg
              aria-hidden="true"
              className="w-5 h-5 ml-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
        {listStore?.length < 3 && (
          <Button onClick={togleOpenCreateStore} text="create new store" />
        )}
      </div>
    </div>
  )
}

export default ListStore
