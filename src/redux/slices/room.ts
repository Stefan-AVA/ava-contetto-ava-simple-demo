import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IMessage } from "@/types/message.types"
import { IRoom } from "@/types/room.types"

import { messageApi } from "../apis/message"
import { roomApi } from "../apis/room"

interface IRoomState {
  rooms: IRoom[] // all rooms in all orgs
  currentRoom?: IRoom
  messages: IMessage[] // messages in currentRoom
}

const initialState: IRoomState = {
  rooms: [],
  currentRoom: undefined,
  messages: [],
}

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, { payload }: PayloadAction<IRoom[]>) => {
      state.rooms = payload
    },
    updateRoom: (state, { payload }: PayloadAction<IRoom>) => {
      state.rooms = state.rooms.map((room) =>
        room._id === payload._id ? payload : room
      )
    },
    joinRoom: (state, { payload }: PayloadAction<IRoom>) => {
      state.rooms = [...state.rooms, payload]
    },
    setCurrentRoom: (state, action: PayloadAction<IRoom | undefined>) => {
      state.currentRoom = action.payload
    },
    setMessages: (state, { payload }: PayloadAction<IMessage[]>) => {
      if (state.currentRoom) {
        state.messages = payload
      }
    },
    // can be for both send & receive message
    sendMessage: (state, { payload }: PayloadAction<IMessage>) => {
      if (state.currentRoom && state.currentRoom._id === payload.roomId) {
        state.messages = [...state.messages, payload]
      }
    },
    updateMessage: (state, { payload }: PayloadAction<IMessage>) => {
      if (state.currentRoom && state.currentRoom._id === payload.roomId) {
        state.messages = state.messages.map((msg) =>
          msg._id === payload._id ? payload : msg
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      roomApi.endpoints.getAllRooms.matchFulfilled,
      (state, action) => {
        state.rooms = action.payload
      }
    )
    builder.addMatcher(
      roomApi.endpoints.createChannel.matchFulfilled,
      (state, action) => {
        state.rooms = [...(state.rooms ?? []), action.payload]
        state.currentRoom = action.payload
      }
    )
    builder.addMatcher(
      roomApi.endpoints.createDM.matchFulfilled,
      (state, action) => {
        state.rooms = [...(state.rooms ?? []), action.payload]
        state.currentRoom = action.payload
      }
    )
    builder.addMatcher(
      roomApi.endpoints.updateChannel.matchFulfilled,
      (state, action) => {
        state.rooms = (state.rooms ?? []).map((room) =>
          room._id === action.payload._id ? action.payload : room
        )
      }
    )
    builder.addMatcher(
      messageApi.endpoints.getMessages.matchFulfilled,
      (state, action) => {
        state.messages = action.payload
      }
    )
  },
})

export const {
  setRooms,
  updateRoom,
  joinRoom,
  setCurrentRoom,
  setMessages,
  sendMessage,
  updateMessage,
} = roomSlice.actions

export default roomSlice.reducer
