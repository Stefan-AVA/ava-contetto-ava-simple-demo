import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IUser } from "@/types/user.types"

import { clearToken } from "../fetchAuthQuery"

interface IAppState {
  user: IUser | null
}
const initialState: IAppState = {
  user: null,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
      clearToken()
    },
  },
})

export const { setUser, logout } = appSlice.actions

export default appSlice.reducer
