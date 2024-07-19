import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {
    curUser: null,
  },
  reducers: {
    setCurUser: (state, action: PayloadAction<any>) => {
      state.curUser = action.payload
    },
  },
})

export const { setCurUser } = user.actions
export default user.reducer
