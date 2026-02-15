import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    userData: null,
}

const authSlicer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state,action)=>{
             state.isLoggedIn=true
             state.userData=action.payload
        },
        logout: (state,action)=>{
             state.isLoggedIn=false
             state.userData=null
        }
    }
})

export const { login,logout }=authSlicer.actions;

export default authSlicer.reducer;