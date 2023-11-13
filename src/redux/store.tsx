import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import { authApi } from "./apis/auth"
import { orgApi } from "./apis/org"
import appReducer from "./slices/app"

export const store = configureStore({
  reducer: {
    app: appReducer,
    [authApi.reducerPath]: authApi.reducer,
    [orgApi.reducerPath]: orgApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, orgApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
