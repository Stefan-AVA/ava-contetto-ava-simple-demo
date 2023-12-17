import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IRoom } from "@/types/room.types"

import { roomApi } from "../apis/room"

interface IRoomState {
  rooms?: IRoom[]
  currentRoom?: IRoom
}

const initialState: IRoomState = {
  rooms: undefined,
  currentRoom: undefined,
}

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload
    },
    updateRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = (state.rooms ?? []).map((room) =>
        room._id === action.payload._id ? action.payload : room
      )
    },
    joinRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = [
        ...(state.rooms ?? []).filter(
          (room) => room._id !== action.payload._id
        ),
        action.payload,
      ]
    },
    setCurrentRoom: (state, action: PayloadAction<IRoom | undefined>) => {
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
  },
})

export const { setRooms, updateRoom, joinRoom, setCurrentRoom } =
  roomSlice.actions

export default roomSlice.reducer
