import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IAgentProfile } from "@/types/agentProfile.types"
import { IContact } from "@/types/contact.types"
import type { IUser } from "@/types/user.types"

import { authApi } from "../apis/auth"
import { orgApi } from "../apis/org"
import { clearToken } from "../fetch-auth-query"
import { initialTheme, type DefaultAvaOrgTheme } from "./theme"

interface IAppState {
  user: IUser | null
  theme: DefaultAvaOrgTheme
  agentOrgs: IAgentProfile[]
  contactOrgs: IContact[]
}

const initialState: IAppState = {
  user: null,
  theme: initialTheme,
  agentOrgs: [],
  contactOrgs: [],
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
    setOrgs: (
      state,
      action: PayloadAction<{
        agentProfiles: IAgentProfile[]
        contacts: IContact[]
      }>
    ) => {
      state.agentOrgs = action.payload.agentProfiles
      state.contactOrgs = action.payload.contacts
    },
    setTheme: (state, action: PayloadAction<DefaultAvaOrgTheme>) => {
      state.theme = {
        ...state.theme,
        ...action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload
      }
    )
    builder.addMatcher(
      orgApi.endpoints.getOrgs.matchFulfilled,
      (state, action) => {
        state.agentOrgs = action.payload.agentProfiles
        state.contactOrgs = action.payload.contacts
      }
    )
  },
})

export const { setUser, logout, setOrgs, setTheme } = appSlice.actions

export default appSlice.reducer
