import { create } from 'zustand'

export const usePopupState = create(set => {
  return {
    isOpen: false,
    type: null,
    togleOpenLogout: () =>
      set({
        isOpen: true,
        type: 'LOGOUT',
      }),
    togleOpenCreateStore: () =>
      set({
        isOpen: true,
        type: 'CREATE_STORE',
      }),
    togleOpenCreateProduct: () =>
      set({
        isOpen: true,
        type: 'CREATE_PRODUCT',
      }),
    togleOpenEditProduct: () =>
      set({
        isOpen: true,
        type: 'EDIT_PRODUCT',
      }),
    togleOpenDeleteProduct: () =>
      set({
        isOpen: true,
        type: 'DELETE_PRODUCT',
      }),
    togleOpenDeleteStore: () =>
      set({
        isOpen: true,
        type: 'DELETE_STORE',
      }),
    togleClosePopup: () =>
      set({
        isOpen: false,
        type: false,
      }),
  }
})
