import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

import { agentApi } from "./apis/agent"
import { authApi } from "./apis/auth"
import { cityApi } from "./apis/city"
import { messageApi } from "./apis/message"
import { orgApi } from "./apis/org"
import { roomApi } from "./apis/room"
import { searchApi } from "./apis/search"
import appReducer from "./slices/app"
import messageReducer from "./slices/message"
import roomReducer from "./slices/room"

export const store = configureStore({
  reducer: {
    app: appReducer,
    messages: messageReducer,
    rooms: roomReducer,
    [authApi.reducerPath]: authApi.reducer,
    [orgApi.reducerPath]: orgApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      orgApi.middleware,
      agentApi.middleware,
      searchApi.middleware,
      cityApi.middleware,
      roomApi.middleware,
      messageApi.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
