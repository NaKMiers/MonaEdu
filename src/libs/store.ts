import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './reducers/cartReducer'
import modalReducer from './reducers/modalReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      modal: modalReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
