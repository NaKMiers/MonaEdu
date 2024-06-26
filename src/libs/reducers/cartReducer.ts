import { ICartItem } from '@/models/CartItemModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const cart = createSlice({
  name: 'cart',
  initialState: {
    items: [] as ICartItem[],
    selectedItems: [] as ICartItem[],
  },
  reducers: {
    // MARK: GLOBAL CART
    setCartItems: (state, action: PayloadAction<ICartItem[]>) => {
      return {
        ...state,
        items: action.payload,
      }
    },
    addCartItem: (state, action: PayloadAction<ICartItem[]>) => {
      // Initialize an array to store updated items
      let updatedItems: ICartItem[] = [...state.items]

      // Loop through each item in the payload
      action.payload.forEach(item => {
        // Check if the item already exists in the cart
        const existingCartItemIndex = state.items.findIndex(cartItem => cartItem._id === item._id)

        // If the item exists, update its quantity
        if (existingCartItemIndex === -1) {
          // If the item does not exist, add it to the cart
          updatedItems.unshift(item)
        }
      })

      // Return the updated state with the new items
      return {
        ...state,
        items: updatedItems,
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
