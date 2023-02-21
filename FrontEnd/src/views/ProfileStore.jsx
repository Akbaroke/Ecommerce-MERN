import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useSWRContext } from '../store/context/swr-context'
import Label from '../components/Label'
import Input from '../components/Input'
import Button from '../components/Button'
import { IconLoader2, IconPhotoEdit } from '@tabler/icons-react'
import axiosMulti from '../api/axiosMulti'
import withRefreshToken from '../services/withRefreshToken.service'
import { useSWRConfig } from 'swr'
import { alertShow } from '../store/redux/actions/alert.action'
import DeleteStorePopup from '../components/modal/DeleteStorePopup'
import { usePopupState } from '../store/zustand/PopupState'

export default function ProfileStore() {
  const [activeLink, setActiveLink] = useState('')

  const toggleActive = isActive => {
    return isActive
      ? 'shadow-xl bg-slate-700'
      : 'cursor-pointer hover:bg-slate-700/50'
  }

  const handleNavClick = link => {
    setActiveLink(link)
  }

  useEffect(() => {
    handleNavClick('PROFILE')
  }, [])

  const getContent = () => {
    switch (activeLink) {
      case 'PROFILE':
        return <ProfileForm />
      case 'MANAGEMENT':
        return <ManagementForm />
      case 'EMPLOYEE':
        return <EmployeeForm />
      case 'DELETE':
        return <DeletedStore />
    }
  }

  return (
    <div className="max-w-[800px] m-auto">
      <div className="my-8">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg
                aria-hidden="true"
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                Store Setting
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div className="flex gap-5 transition-all">
        <div className="w-[25%] h-max bg-slate-800 rounded py-5 px-4">
          <ul className="flex flex-col gap-3">
            <li
              className={`py-2 px-3 rounded-lg ${toggleActive(
                activeLink === 'PROFILE'
              )}`}
              onClick={() => handleNavClick('PROFILE')}>
              Profile
            </li>
            <li
              className={`py-2 px-3 rounded-lg ${toggleActive(
                activeLink === 'MANAGEMENT'
              )}`}
              onClick={() => handleNavClick('MANAGEMENT')}>
              Management
            </li>
            <li
              className={`py-2 px-3 rounded-lg ${toggleActive(
                activeLink === 'EMPLOYEE'
              )}`}
              onClick={() => handleNavClick('EMPLOYEE')}>
              Employee
            </li>
            <li
              className={`py-2 px-3 rounded-lg text-red-500 ${toggleActive(
                activeLink === 'DELETE'
              )}`}
              onClick={() => handleNavClick('DELETE')}>
              Delete
            </li>
          </ul>
        </div>
        <div className="bg-slate-800 p-5 rounded border border-slate-700 w-[75%]">
          <h1 className="capitalize font-semibold text-xl">
            {activeLink.toLowerCase()} store
          </h1>
          <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
          {getContent()}
        </div>
      </div>
    </div>
  )
}

function ProfileForm() {
  const { mutate } = useSWRConfig()
  const { profileStore } = useSWRContext()
  const { id, image } = useSelector(state => state.store)
  const dispatch = useDispatch()
  const [imageHover, setImageHover] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(image)
  const [form, setForm] = useState({
    name: '',
    tax: 0,
    discount: 0,
    image: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setForm({
      name: profileStore.nameStore,
      tax: profileStore.tax ?? 0,
      discount: profileStore.discount ?? 0,
      image: profileStore.image.secure_url,
    })
    console.log('DB : ', profileStore.image.secure_url)
  }, [profileStore])

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files[0])
  }

  const onchange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    console.log('preview :', preview)
  }, [preview])

  const onSubmitSave = e => {
    setIsLoading(true)
    e.preventDefault()
    const SendData = withRefreshToken(async () => {
      try {
        await axiosMulti.put(`/api/store/${id}`, {
          nameStore: form.name,
          tax: form.tax,
          discount: form.discount,
          image: selectedFile ?? undefined,
        })
        mutate(`/api/store/profile/${id}`)
        setIsLoading(false)
        dispatch(
          alertShow('success', 'Profile store updated successfully!', '')
        )
      } catch (error) {
        console.log(error)
        setIsLoading(false)
        dispatch(
          alertShow(
            'error',
            'Updated failed!',
            error.response.data.error.message
          )
        )
      }
    })
    SendData()
  }

  return (
    <form onSubmit={onSubmitSave}>
      <div className="flex flex-col gap-3 justify-center items-center mb-10">
        <div
          onMouseOver={() => setImageHover(true)}
          onMouseOut={() => setImageHover(false)}
          className="flex items-center justify-center w-52 h-52 overflow-hidden rounded-full hover:border-2 hover:border-gray-300 hover:border-dashed ">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-52 h-52  cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 hover:scale-110 transition-all"
            style={{
              backgroundImage: `url("${preview ?? form.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <IconPhotoEdit
              className={`bg-slate-900/50 ${
                imageHover ? 'w-full h-full p-[85px] visible' : 'invisible'
              }`}
            />
          </label>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={onSelectFile}
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
        <h1 className="text-xl font-medium">{profileStore.nameStore}</h1>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <Label htmlFor="name" text="name :" />
          <Input
            name="name"
            placeholder="Name Store"
            value={form.name}
            onChange={onchange}
            required
          />
        </div>
        <div>
          <Label htmlFor="tax" text="tax :" />
          <Input
            type="number"
            name="tax"
            placeholder="0"
            value={form.tax}
            onChange={onchange}
            required
          />
        </div>
        <div>
          <Label htmlFor="discount" text="discount :" />
          <Input
            type="number"
            name="discount"
            placeholder="0"
            value={form.discount}
            onChange={onchange}
            required
          />
        </div>
        {isLoading ? (
          <Button className="cursor-wait mt-5" disabled>
            <IconLoader2 className="animate-spin" />
            save..
          </Button>
        ) : (
          <Button type="submit" text="save" className="mt-5" />
        )}
      </div>
    </form>
  )
}
function ManagementForm() {
  return <div></div>
}
function EmployeeForm() {
  return <div></div>
}

function DeletedStore() {
  const { togleOpenDeleteStore } = usePopupState(state => state)
  return (
    <div>
      <DeleteStorePopup />
      <p>
        After you delete a store, you are sure that this store will be closed
        and all data will be deleted from the database. there is no turning
        back. Please rest assured.
      </p>
      <Button
        onClick={() => togleOpenDeleteStore()}
        text="Delete this store"
        style="border border-gray-500 bg-slate-700 text-red-600 focus:ring-0 active:scale-95 mt-5"
      />
    </div>
  )
}
