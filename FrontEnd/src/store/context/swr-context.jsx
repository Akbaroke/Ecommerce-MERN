import axios from '../../api/axios'
import React, { createContext, useContext } from 'react'
import useSWR from 'swr'
import withRefreshToken from '../../services/withRefreshToken.service'
import { useDispatch, useSelector } from 'react-redux'
import { setAccessStore } from '../redux/actions/store.action'
import { Decrypt } from '../../utils/encrypt-decrypt'

export const SWRContext = createContext()

export const SWRProvider = ({ children }) => {
  const { id } = useSelector(state => state.store)
  const dispatch = useDispatch()

  const profileStoreFetch = withRefreshToken(async () => {
    const response = await axios.get(`/api/store/${id}`)
    const { data } = await axios.get(`/api/stores`)
    const objRes = Decrypt(data.data).find(item => item.idStore === id)
    dispatch(
      setAccessStore({
        id: objRes.idStore,
        name: objRes.nameStore,
        role: objRes.role,
        image: objRes.image,
        data: data.data,
      })
    )
    return Decrypt(response.data.data)
  })

  const productFetch = withRefreshToken(async () => {
    const response = await axios.get(`/api/product/${id}`)
    return response.data.data
  })

  const categoryFetch = withRefreshToken(async () => {
    const response = await axios.get(`/api/product/category/${id}`)
    return response.data
  })

  const { data: profileStore } = useSWR(
    `/api/store/profile/${id}`,
    profileStoreFetch
  )

  const { data: products } = useSWR(`/api/product/${id}`, productFetch)

  const { data: categories } = useSWR(
    `/api/product/category/${id}`,
    categoryFetch
  )

  return (
    <SWRContext.Provider value={{ products, categories, profileStore }}>
      {children}
    </SWRContext.Provider>
  )
}

export const useSWRContext = () => useContext(SWRContext)
