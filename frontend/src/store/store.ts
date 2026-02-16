import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/authSlicer"
import vaultReducer from "@/features/vaultSlicer"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vault: vaultReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
