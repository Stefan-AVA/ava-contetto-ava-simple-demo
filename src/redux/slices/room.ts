import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IRoom } from "@/types/room.types"

import { roomApi } from "../apis/room"

interface IRoomState {
  rooms: IRoom[]
  currentRoom?: IRoom
}

const initialState: IRoomState = {
  rooms: [],
  currentRoom: undefined,
}

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload
    },
    createRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = [...state.rooms, action.payload]
      state.currentRoom = action.payload
    },
    joinRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = [...state.rooms, action.payload]
    },
    setCurrentRoom: (state, action: PayloadAction<IRoom>) => {
      state.currentRoom = action.payload
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
        state.rooms = [...state.rooms, action.payload]
      }
    )
    builder.addMatcher(
      roomApi.endpoints.createDM.matchFulfilled,
      (state, action) => {
        state.rooms = [...state.rooms, action.payload]
      }
    )
    builder.addMatcher(
      roomApi.endpoints.updateChannel.matchFulfilled,
      (state, action) => {
        state.rooms = state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room
        )
      }
    )
  },
})

export const { setRooms, createRoom, joinRoom, setCurrentRoom } =
  roomSlice.actions

export default roomSlice.reducer