import { connectSocket } from "@/providers/SocketProvider"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IAgentProfile } from "@/types/agentProfile.types"
import { IContact } from "@/types/contact.types"
import type { IUser } from "@/types/user.types"

import { authApi } from "../apis/auth"
import { orgApi } from "../apis/org"
import { clearToken } from "../token"

interface IAppState {
  user: IUser | null
  agentOrgs: IAgentProfile[]
  contactOrgs: IContact[]
}

const initialState: IAppState = {
  user: null,
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

      // update socket connection
      connectSocket()
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

export const { setUser, logout, setOrgs } = appSlice.actions

export default appSlice.reducer
