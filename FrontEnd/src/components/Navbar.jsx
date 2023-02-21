import { Transition } from '@headlessui/react'
import { Tooltip } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import useDetectOutsideClick from '../hooks/useDetectOutsideClick'
import { usePopupState } from '../store/zustand/PopupState'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { unsetAccessStore } from '../store/redux/actions/store.action'

function Navbar({ children }) {
  const { category } = useParams()
  const store = useSelector(state => state.store)
  const [navIconActive, setNavIconActive] = useState(category || 'transaction')
  const { email, name } = useSelector(state => state.auth)
  const { togleOpenLogout } = usePopupState(state => state)
  const dropdownRefProfile = useRef(null)
  const dropdownRefStore = useRef(null)
  const [isProfile, setIsProfile] = useDetectOutsideClick(
    dropdownRefProfile,
    false
  )
  const [isStore, setIsStore] = useDetectOutsideClick(dropdownRefStore, false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSwitchStore = () => {
    localStorage.removeItem('store')
    dispatch(unsetAccessStore())
    navigate('/store')
    setIsStore(false)
  }

  return (
    <>
      <nav className="h-[80px] dark:bg-slate-800 dark:text-white flex justify-between items-center px-5 fixed right-0 left-0 z-40">
        {store.access ? (
          <ul className="flex gap-10">
            <li className="flex items-center gap-3 mr-8">
              <div className="relative z-20">
                <div
                  onClick={() => setIsStore(!isStore)}
                  className="cursor-pointer "
                >
                  <img
                    src={store.image}
                    alt="logo store"
                    className={`w-10 h-10 rounded-full overflow-hidden hover:scale-110 transition-all ${
                      isStore && 'scale-110'
                    }`}
                  />
                </div>
                <Transition
                  ref={dropdownRefStore}
                  show={isStore}
                  enter="transition-opacity duration-[200ms]"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-[200ms]"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <ul className="absolute left-0 top-12 bg-white text-slate-900 fill-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:fill-slate-300 rounded-md text-[13px] p-2 overflow-hidden flex flex-col gap-2 w-40 shadow-xl shadow-slate-900">
                    <li
                      onClick={handleSwitchStore}
                      className="py-2 px-3 cursor-pointer hover:bg-slate-800 transition-all rounded-xl flex items-center gap-2"
                    >
                      <svg
                        className="w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" />
                      </svg>
                      <p>Switch Store</p>
                    </li>
                    <li
                      onClick={() => {
                        navigate('/store/profile')
                        setIsStore(false)
                      }}
                      className="py-2 px-3 cursor-pointer hover:bg-slate-800 transition-all rounded-xl flex items-center gap-2"
                    >
                      <svg
                        className="w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g data-name="Layer 2">
                          <g data-name="settings">
                            <rect width="24" height="24" opacity="0" />
                            <path
                              d="M8.61 22a2.25 2.25 0 0 1-1.35-.46L5.19 20a2.37 2.37 0 0 1-.49-3.22 2.06 2.06 0 0 0 .23-1.86l-.06-.16a1.83 1.83 0 0 0-1.12-1.22h-.16a2.34 2.34 0 0 1-1.48-2.94L2.93 8a2.18 2.18 0 0 1 1.12-1.41 2.14 2.14 0 0 1 1.68-.12 1.93 1.93 0 0 0 1.78-.29l.13-.1a1.94 1.94 0 0 0 .73-1.51v-.24A2.32 2.32 0 0 1 10.66 2h2.55a2.26 2.26 0 0 1 1.6.67 2.37 2.37 0 0 1 .68 1.68v.28a1.76 1.76 0 0 0 .69 1.43l.11.08a1.74 1.74 0 0 0 1.59.26l.34-.11A2.26 2.26 0 0 1 21.1 7.8l.79 2.52a2.36 2.36 0 0 1-1.46 2.93l-.2.07A1.89 1.89 0 0 0 19 14.6a2 2 0 0 0 .25 1.65l.26.38a2.38 2.38 0 0 1-.5 3.23L17 21.41a2.24 2.24 0 0 1-3.22-.53l-.12-.17a1.75 1.75 0 0 0-1.5-.78 1.8 1.8 0 0 0-1.43.77l-.23.33A2.25 2.25 0 0 1 9 22a2 2 0 0 1-.39 0zM4.4 11.62a3.83 3.83 0 0 1 2.38 2.5v.12a4 4 0 0 1-.46 3.62.38.38 0 0 0 0 .51L8.47 20a.25.25 0 0 0 .37-.07l.23-.33a3.77 3.77 0 0 1 6.2 0l.12.18a.3.3 0 0 0 .18.12.25.25 0 0 0 .19-.05l2.06-1.56a.36.36 0 0 0 .07-.49l-.26-.38A4 4 0 0 1 17.1 14a3.92 3.92 0 0 1 2.49-2.61l.2-.07a.34.34 0 0 0 .19-.44l-.78-2.49a.35.35 0 0 0-.2-.19.21.21 0 0 0-.19 0l-.34.11a3.74 3.74 0 0 1-3.43-.57L15 7.65a3.76 3.76 0 0 1-1.49-3v-.31a.37.37 0 0 0-.1-.26.31.31 0 0 0-.21-.08h-2.54a.31.31 0 0 0-.29.33v.25a3.9 3.9 0 0 1-1.52 3.09l-.13.1a3.91 3.91 0 0 1-3.63.59.22.22 0 0 0-.14 0 .28.28 0 0 0-.12.15L4 11.12a.36.36 0 0 0 .22.45z"
                              data-name="&lt;Group&gt;"
                            />
                            <path d="M12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5zm0-5a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5z" />
                          </g>
                        </g>
                      </svg>
                      <p>Setting</p>
                    </li>
                  </ul>
                </Transition>
              </div>
              <div
                onClick={() => setIsStore(!isStore)}
                className="cursor-pointer flex flex-col gap-1"
              >
                <h3 className="text-[16px] font-medium capitalize">
                  {store.name}
                </h3>
                <span
                  className={`capitalize bg-green-100 w-max ${
                    store.role === 'owner'
                      ? 'text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'
                      : 'text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'
                  }`}
                >
                  {store.role}
                </span>
              </div>
            </li>
            <li
              className={`flex items-center relative ${
                navIconActive === 'transaction' &&
                'after:border-b-[3px] after:absolute after:-bottom-4 after:w-full after:rounded-xl z-10'
              }`}
            >
              <Tooltip content="Transaction" placement="bottom">
                <NavLink to="/" onClick={() => setNavIconActive('transaction')}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.9841 4.99255C12.9841 4.44027 13.4318 3.99255 13.9841 3.99255C14.3415 3.99255 14.6551 4.18004 14.8319 4.46202L17.5195 7.14964C17.9101 7.54016 17.9101 8.17333 17.5195 8.56385C17.129 8.95438 16.4958 8.95438 16.1053 8.56385L14.9841 7.44263V14.9926C14.9841 15.5448 14.5364 15.9926 13.9841 15.9926C13.4318 15.9926 12.9841 15.5448 12.9841 14.9926V5.042C12.984 5.03288 12.984 5.02376 12.9841 5.01464V4.99255Z"
                      fill="currentColor"
                    />
                    <path
                      d="M11.0159 19.0074C11.0159 19.5597 10.5682 20.0074 10.0159 20.0074C9.6585 20.0074 9.3449 19.82 9.16807 19.538L6.48045 16.8504C6.08993 16.4598 6.08993 15.8267 6.48045 15.4361C6.87098 15.0456 7.50414 15.0456 7.89467 15.4361L9.01589 16.5574V9.00745C9.01589 8.45516 9.46361 8.00745 10.0159 8.00745C10.5682 8.00745 11.0159 8.45516 11.0159 9.00745V18.958C11.016 18.9671 11.016 18.9762 11.0159 18.9854V19.0074Z"
                      fill="currentColor"
                    />
                  </svg>
                </NavLink>
              </Tooltip>
            </li>
            <li
              className={`flex items-center relative ${
                navIconActive === 'products' &&
                'after:border-b-[3px] after:absolute after:-bottom-4 after:w-full after:rounded-xl z-10'
              }`}
            >
              <Tooltip content="Products" placement="bottom">
                <NavLink
                  to="/products"
                  onClick={() => setNavIconActive('products')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-package"
                  >
                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1={12} y1="22.08" x2={12} y2={12} />
                  </svg>
                </NavLink>
              </Tooltip>
            </li>
            <li
              className={`flex items-center relative ${
                navIconActive === 'team' &&
                'after:border-b-[3px] after:absolute after:-bottom-4 after:w-full after:rounded-xl z-10'
              }`}
            >
              <Tooltip content="Team" placement="bottom">
                <NavLink to="/team" onClick={() => setNavIconActive('team')}>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z"
                      fill="currentColor"
                    />
                    <path
                      d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z"
                      fill="currentColor"
                    />
                    <path d="M22 11H16V13H22V11Z" fill="currentColor" />
                    <path d="M16 15H22V17H16V15Z" fill="currentColor" />
                    <path d="M22 7H16V9H22V7Z" fill="currentColor" />
                  </svg>
                </NavLink>
              </Tooltip>
            </li>
            <li
              className={`flex items-center relative ${
                navIconActive === 'history' &&
                'after:border-b-[3px] after:absolute after:-bottom-4 after:w-full after:rounded-xl z-10'
              }`}
            >
              <Tooltip content="History" placement="bottom">
                <NavLink
                  to="/history"
                  onClick={() => setNavIconActive('history')}
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22.775 8C22.9242 8.65461 23 9.32542 23 10H14V1C14.6746 1 15.3454 1.07584 16 1.22504C16.4923 1.33724 16.9754 1.49094 17.4442 1.68508C18.5361 2.13738 19.5282 2.80031 20.364 3.63604C21.1997 4.47177 21.8626 5.46392 22.3149 6.55585C22.5091 7.02455 22.6628 7.5077 22.775 8ZM20.7082 8C20.6397 7.77018 20.5593 7.54361 20.4672 7.32122C20.1154 6.47194 19.5998 5.70026 18.9497 5.05025C18.2997 4.40024 17.5281 3.88463 16.6788 3.53284C16.4564 3.44073 16.2298 3.36031 16 3.2918V8H20.7082Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 14C1 9.02944 5.02944 5 10 5C10.6746 5 11.3454 5.07584 12 5.22504V12H18.775C18.9242 12.6546 19 13.3254 19 14C19 18.9706 14.9706 23 10 23C5.02944 23 1 18.9706 1 14ZM16.8035 14H10V7.19648C6.24252 7.19648 3.19648 10.2425 3.19648 14C3.19648 17.7575 6.24252 20.8035 10 20.8035C13.7575 20.8035 16.8035 17.7575 16.8035 14Z"
                      fill="currentColor"
                    />
                  </svg>
                </NavLink>
              </Tooltip>
            </li>
          </ul>
        ) : (
          <span></span>
        )}
        <div className="relative">
          <div
            onClick={() => setIsProfile(!isProfile)}
            className={`cursor-pointer rounded-full overflow-hidden hover:scale-110 transition-all ${
              isProfile && 'scale-110'
            }`}
          >
            <img
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
              alt="default image profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
          <Transition
            ref={dropdownRefProfile}
            show={isProfile}
            enter="transition-opacity duration-[200ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-[200ms]"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ul className="absolute -left-[130px] top-10 bg-white text-slate-900 fill-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:fill-slate-300 rounded-md text-[13px] p-2 max-w-[180px] overflow-hidden flex flex-col gap-2">
              <li className="py-2 px-3 overflow-hidden">
                <p className="text-[14px] max-w-[130px] capitalize">{name}</p>
                <p className="max-w-[130px] overflow-hidden">{email}</p>
              </li>
              <li className="py-2 px-3 cursor-pointer hover:bg-slate-800 transition-all rounded-xl flex items-center gap-2">
                <svg
                  className="w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g data-name="Layer 2">
                    <g data-name="person">
                      <rect width={24} height={24} opacity={0} />
                      <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
                      <path d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z" />
                    </g>
                  </g>
                </svg>
                <p>Profile</p>
              </li>
              <li className="py-2 px-3 cursor-pointer hover:bg-slate-800 transition-all rounded-xl flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-bell w-4"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                <p>Notification</p>
              </li>
              <li className="py-2 px-3 cursor-pointer hover:bg-slate-800 transition-all rounded-xl flex items-center gap-2">
                <svg
                  className="w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g data-name="Layer 2">
                    <g data-name="settings">
                      <rect width="24" height="24" opacity="0" />
                      <path
                        d="M8.61 22a2.25 2.25 0 0 1-1.35-.46L5.19 20a2.37 2.37 0 0 1-.49-3.22 2.06 2.06 0 0 0 .23-1.86l-.06-.16a1.83 1.83 0 0 0-1.12-1.22h-.16a2.34 2.34 0 0 1-1.48-2.94L2.93 8a2.18 2.18 0 0 1 1.12-1.41 2.14 2.14 0 0 1 1.68-.12 1.93 1.93 0 0 0 1.78-.29l.13-.1a1.94 1.94 0 0 0 .73-1.51v-.24A2.32 2.32 0 0 1 10.66 2h2.55a2.26 2.26 0 0 1 1.6.67 2.37 2.37 0 0 1 .68 1.68v.28a1.76 1.76 0 0 0 .69 1.43l.11.08a1.74 1.74 0 0 0 1.59.26l.34-.11A2.26 2.26 0 0 1 21.1 7.8l.79 2.52a2.36 2.36 0 0 1-1.46 2.93l-.2.07A1.89 1.89 0 0 0 19 14.6a2 2 0 0 0 .25 1.65l.26.38a2.38 2.38 0 0 1-.5 3.23L17 21.41a2.24 2.24 0 0 1-3.22-.53l-.12-.17a1.75 1.75 0 0 0-1.5-.78 1.8 1.8 0 0 0-1.43.77l-.23.33A2.25 2.25 0 0 1 9 22a2 2 0 0 1-.39 0zM4.4 11.62a3.83 3.83 0 0 1 2.38 2.5v.12a4 4 0 0 1-.46 3.62.38.38 0 0 0 0 .51L8.47 20a.25.25 0 0 0 .37-.07l.23-.33a3.77 3.77 0 0 1 6.2 0l.12.18a.3.3 0 0 0 .18.12.25.25 0 0 0 .19-.05l2.06-1.56a.36.36 0 0 0 .07-.49l-.26-.38A4 4 0 0 1 17.1 14a3.92 3.92 0 0 1 2.49-2.61l.2-.07a.34.34 0 0 0 .19-.44l-.78-2.49a.35.35 0 0 0-.2-.19.21.21 0 0 0-.19 0l-.34.11a3.74 3.74 0 0 1-3.43-.57L15 7.65a3.76 3.76 0 0 1-1.49-3v-.31a.37.37 0 0 0-.1-.26.31.31 0 0 0-.21-.08h-2.54a.31.31 0 0 0-.29.33v.25a3.9 3.9 0 0 1-1.52 3.09l-.13.1a3.91 3.91 0 0 1-3.63.59.22.22 0 0 0-.14 0 .28.28 0 0 0-.12.15L4 11.12a.36.36 0 0 0 .22.45z"
                        data-name="&lt;Group&gt;"
                      />
                      <path d="M12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5zm0-5a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5z" />
                    </g>
                  </g>
                </svg>
                <p>Setting</p>
              </li>
              <li
                className="py-2 px-3 cursor-pointer hover:bg-slate-800 transition-all rounded-xl flex items-center gap-2"
                onClick={togleOpenLogout}
              >
                <svg
                  className="w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g data-name="Layer 2">
                    <g data-name="log-out">
                      <rect
                        width="24"
                        height="24"
                        transform="rotate(90 12 12)"
                        opacity="0"
                      />
                      <path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6z" />
                      <path d="M20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z" />
                    </g>
                  </g>
                </svg>
                <p>Logout</p>
              </li>
            </ul>
          </Transition>
        </div>
      </nav>
      <div className="pt-[80px]">{children}</div>
    </>
  )
}

export default Navbar
