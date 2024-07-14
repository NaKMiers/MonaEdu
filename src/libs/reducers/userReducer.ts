import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loading = createSlice({
  name: 'loading',
  initialState: {
    curUser: null,
  },
  reducers: {
    setCurUser: (state, action: PayloadAction<any>) => {
      state.curUser = action.payload
    },
  },
})

export const { setCurUser } = loading.actions
export default loading.reducer
