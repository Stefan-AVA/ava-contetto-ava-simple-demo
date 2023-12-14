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
    setMessages: (state, { payload }: PayloadAction<IMessage[]>) => {
      state.messages = payload
    },
    // can be for both send & receive message
    sendMessage: (state, { payload }: PayloadAction<IMessage>) => {
      state.messages = [...state.messages, payload]
    },
    updateMessage: (state, { payload }: PayloadAction<IMessage>) => {
      state.messages = state.messages.map((msg) =>
        msg._id === payload._id ? payload : msg
      )
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

export const { setMessages, sendMessage, updateMessage } = messageSlice.actions

export default messageSlice.reducer
