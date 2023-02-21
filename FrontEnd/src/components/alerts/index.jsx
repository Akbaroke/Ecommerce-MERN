import { useDispatch, useSelector } from 'react-redux'
import ErrorAlert from './ErrorAlert'
import SuccessAlert from './SuccessAlert'
import React, { useEffect } from 'react'
import { alertHide } from '../../store/redux/actions/alert.action'
import { Transition } from '@headlessui/react'

export default function Alert() {
  const dispatch = useDispatch()
  const { show, alertType, title, message } = useSelector(state => state.alert)

  useEffect(() => {
    setTimeout(() => {
      dispatch(alertHide())
    }, 5000)
  }, [show])

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-[500ms]"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-[500ms]"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed ml-5 mt-5 max-w-[90vw] z-50">
        {alertType === 'success' ? (
          <SuccessAlert title={title} message={message} />
        ) : (
          alertType === 'error' && (
            <ErrorAlert title={title} message={message} />
          )
        )}
      </div>
    </Transition>
  )
}
