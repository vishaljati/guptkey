import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    name: null,
    email: null,
}

const authSlicer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state,action)=>{
             state.isLoggedIn=true
             state.name=action.payload.name
             state.email=action.payload.email
        },
        logout: (state,action)=>{
             state.isLoggedIn=false
             state.name=null
             state.email=null
        }
    }
})

export const { login,logout }=authSlicer.actions;

export default authSlicer.reducer;