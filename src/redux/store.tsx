import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

import { agentApi } from "./apis/agent"
import { authApi } from "./apis/auth"
import { brochureApi } from "./apis/brochure"
import { cityApi } from "./apis/city"
import { fileShareApi } from "./apis/fileshare"
import { industryApi } from "./apis/industry"
import { mediaApi } from "./apis/media"
import { messageApi } from "./apis/message"
import { orgApi } from "./apis/org"
import { pageApi } from "./apis/page"
import { roomApi } from "./apis/room"
import { searchApi } from "./apis/search"
import { templateApi } from "./apis/templates"
import appReducer from "./slices/app"
import roomReducer from "./slices/room"

export const store = configureStore({
  reducer: {
    app: appReducer,
    rooms: roomReducer,
    [authApi.reducerPath]: authApi.reducer,
    [orgApi.reducerPath]: orgApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [fileShareApi.reducerPath]: fileShareApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
    [brochureApi.reducerPath]: brochureApi.reducer,
    [industryApi.reducerPath]: industryApi.reducer,
    [pageApi.reducerPath]: pageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      orgApi.middleware,
      agentApi.middleware,
      searchApi.middleware,
      cityApi.middleware,
      roomApi.middleware,
      messageApi.middleware,
      mediaApi.middleware,
      fileShareApi.middleware,
      templateApi.middleware,
      brochureApi.middleware,
      industryApi.middleware,
      pageApi.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
