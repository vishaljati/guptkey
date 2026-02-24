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
        },
        updateName: (state,action)=>{
             state.name=action.payload.name
        }
    }
})

export const { login,logout,updateName }=authSlicer.actions;

export default authSlicer.reducer;