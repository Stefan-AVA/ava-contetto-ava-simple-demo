import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IMessage } from "@/types/message.types"

import { messageApi } from "../apis/message"

interface IMessageState {
  messages: IMessage[]
}

const initialState: IMessageState = {
  messages: [],
}

export const messageSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      messageApi.endpoints.getMessages.matchFulfilled,
      (state, action) => {
        state.messages = action.payload
      }
    )
  },
})

export const { setMessages } = messageSlice.actions

export default messageSlice.reducer
