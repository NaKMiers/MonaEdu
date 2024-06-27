import { ICartItem } from '@/models/CartItemModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const cart = createSlice({
  name: 'cart',
  initialState: {
    items: [] as ICartItem[],
    selectedItems: [] as ICartItem[],
  },
  reducers: {
    setCartItems: (state, action: PayloadAction<ICartItem[]>) => {
      return {
        ...state,
        items: action.payload,
      }
    },
    addCartItem: (state, action: PayloadAction<ICartItem>) => {
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    },
    deleteCartItem: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      }
    },

    // MARK: Checkout
    setSelectedItems: (state, action: PayloadAction<ICartItem[]>) => {
      return {
        ...state,
        selectedItems: action.payload,
      }
    },
  },
})

export const {
  setCartItems,
  addCartItem,
  deleteCartItem,

  // checkout
  setSelectedItems,
} = cart.actions
export default cart.reducer
