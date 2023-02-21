import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../views/Home'
import Login from '../views/auth/Login'
import Register from '../views/auth/Register'
import NotFound from '../views/errors/NotFound'
import Verification from '../views/auth/Verification'
import Navbar from '../components/Navbar'
import * as Middleware from '../middlewares'
import ListStore from '../views/ListStore'
import Product from '../views/Product'
import LogoutPopup from '../components/modal/LogoutPopup'
import CreateNewStorePopup from '../components/modal/CreateNewStorePopup'
import Alert from '../components/alerts'
import { SWRProvider } from '../store/context/swr-context'
import Team from '../views/Team'
import ProfileStore from '../views/ProfileStore'

export default function Router() {
  return (
    <BrowserRouter>
      <LogoutPopup />
      <CreateNewStorePopup />
      <Alert />
      <Routes>
        <Route
          path="/"
          element={
            <Navbar>
              <Middleware.Auth>
                <Middleware.Refresh>
                  <SWRProvider>
                    <Home />
                  </SWRProvider>
                </Middleware.Refresh>
              </Middleware.Auth>
            </Navbar>
          }
        />
        <Route
          path="/store"
          element={
            <Navbar>
              <Middleware.Auth>
                <Middleware.Refresh>
                  <ListStore />
                </Middleware.Refresh>
              </Middleware.Auth>
            </Navbar>
          }
        />
        <Route
          path="/products"
          element={
            <Navbar>
              <Middleware.Auth>
                <Middleware.Refresh>
                  <SWRProvider>
                    <Product />
                  </SWRProvider>
                </Middleware.Refresh>
              </Middleware.Auth>
            </Navbar>
          }
        />
        <Route
          path="/team"
          element={
            <Navbar>
              <Middleware.Auth>
                <Middleware.Refresh>
                  <SWRProvider>
                    <Team />
                  </SWRProvider>
                </Middleware.Refresh>
              </Middleware.Auth>
            </Navbar>
          }
        />
        <Route
          path="/store/profile"
          element={
            <Navbar>
              <Middleware.Auth>
                <Middleware.Refresh>
                  <SWRProvider>
                    <ProfileStore />
                  </SWRProvider>
                </Middleware.Refresh>
              </Middleware.Auth>
            </Navbar>
          }
        />
        <Route
          path="/login"
          element={
            <Middleware.User>
              <Middleware.Refresh>
                <Login />
              </Middleware.Refresh>
            </Middleware.User>
          }
        />
        <Route
          path="/register"
          element={
            <Middleware.User>
              <Middleware.Refresh>
                <Register />
              </Middleware.Refresh>
            </Middleware.User>
          }
        />
        <Route
          path="/verification"
          element={
            <Middleware.User>
              <Middleware.Refresh>
                <Verification />
              </Middleware.Refresh>
            </Middleware.User>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
