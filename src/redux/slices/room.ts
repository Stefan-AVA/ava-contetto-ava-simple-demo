import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IMessage } from "@/types/message.types"
import { IRoom } from "@/types/room.types"
import { IUser } from "@/types/user.types"

import { authApi } from "../apis/auth"
import { messageApi } from "../apis/message"
import { roomApi } from "../apis/room"

export type UserTyping = {
  roomId: string
  username: string
}

interface IRoomState {
  user?: IUser
  rooms: IRoom[] // all rooms in all orgs
  messages: IMessage[] // messages in currentRoom
  userTyping: UserTyping | null
  currentRoom?: IRoom
}

const initialState: IRoomState = {
  user: undefined,
  rooms: [],
  messages: [],
  userTyping: null,
  currentRoom: undefined,
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
      if (state.currentRoom && state.currentRoom._id === payload._id) {
        state.currentRoom = payload
      }
    },
    joinRoom: (state, { payload }: PayloadAction<IRoom>) => {
      state.rooms = [...state.rooms, payload]
    },
    setCurrentRoom: (state, { payload }: PayloadAction<IRoom | undefined>) => {
      state.currentRoom = payload
    },
    archiveRoom: (state, { payload }: PayloadAction<IRoom>) => {
      state.rooms = state.rooms.filter((room) => room._id !== payload._id)
    },
    readMessage: (state, { payload }: PayloadAction<IRoom>) => {
      const prevRoom = (state.rooms || []).find((r) => r._id === payload._id)
      if (prevRoom) {
        if (
          prevRoom.userStatus[String(state.user?.username)].notis !==
            payload.userStatus[String(state.user?.username)].notis ||
          prevRoom.userStatus[String(state.user?.username)].unRead !==
            payload.userStatus[String(state.user?.username)].unRead
        ) {
          state.rooms = state.rooms.map((room) =>
            room._id === payload._id ? payload : room
          )
        }
      }
    },
    setMessages: (state, { payload }: PayloadAction<IMessage[]>) => {
      if (state.currentRoom) {
        state.messages = payload
      }
    },
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
    deleteMessage: (state, { payload }: PayloadAction<IMessage>) => {
      if (state.currentRoom && state.currentRoom._id === payload.roomId) {
        state.messages = state.messages.filter((msg) => msg._id !== payload._id)
      }
    },
    typingMessage: (state, { payload }: PayloadAction<UserTyping | null>) => {
      state.userTyping = payload
    },
  },
  extraReducers: (builder) => {
    // for checking current user
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload
      }
    )

    builder.addMatcher(
      roomApi.endpoints.getAllRooms.matchFulfilled,
      (state, action) => {
        state.rooms = action.payload
      }
    )
    builder.addMatcher(
      roomApi.endpoints.createChannel.matchFulfilled,
      (state, action) => {
        state.rooms = [...state.rooms, action.payload]
        state.currentRoom = action.payload
      }
    )
    builder.addMatcher(
      roomApi.endpoints.createDM.matchFulfilled,
      (state, action) => {
        state.rooms = [
          ...state.rooms.filter((room) => room._id !== action.payload._id),
          { ...action.payload, dmInitiated: true },
        ]
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
    builder.addMatcher(
      messageApi.endpoints.loadBeforeMessages.matchFulfilled,
      (state, action) => {
        state.messages = [...action.payload, ...state.messages]
      }
    )
    builder.addMatcher(
      messageApi.endpoints.loadNextMessages.matchFulfilled,
      (state, action) => {
        state.messages = [...state.messages, ...action.payload]
      }
    )
    builder.addMatcher(
      messageApi.endpoints.loadSearchedMessages.matchFulfilled,
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
  archiveRoom,
  readMessage,
  setMessages,
  sendMessage,
  typingMessage,
  deleteMessage,
  updateMessage,
  setCurrentRoom,
} = roomSlice.actions

export default roomSlice.reducer
