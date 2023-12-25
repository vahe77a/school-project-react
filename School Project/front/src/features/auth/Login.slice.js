import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { signIn, users } from "../../services/api"
export const LoginAction = createAsyncThunk("auth/login", async(user) =>{
    return await signIn(user)
})


const LoginSlice = createSlice({
    name: "login",
    initialState: {
        error: "",
        // user: null
    },
    reducers: {

    },
    extraReducers: (builder) =>{
        builder.addCase(LoginAction.fulfilled, (state, {payload}) =>{
            if(payload.status === "error"){
                state.error = payload.message
            }
            // console.log(payload);
        })
    }
})
export const LoginReducer = LoginSlice.reducer