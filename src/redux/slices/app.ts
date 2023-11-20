import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { IOrg } from "@/types/org.types"
import type { IUser } from "@/types/user.types"

import { authApi } from "../apis/auth"
import { clearToken } from "../fetch-auth-query"

interface IAppState {
  user: IUser | null
  orgs: IOrg[]
}
const initialState: IAppState = {
  user: null,
  orgs: [],
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
    setOrgs: (state, action: PayloadAction<IOrg[]>) => {
      state.orgs = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload
      }
    )
  },
})

export const { setUser, logout, setOrgs } = appSlice.actions

export default appSlice.reducer
