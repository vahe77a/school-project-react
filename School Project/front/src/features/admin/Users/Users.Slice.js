import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { addUser, deleteUser, getUsers } from "../../../services/api"

export const getUserList = createAsyncThunk("users/get", async() =>{
    return await getUsers()
})

export const AddUserAction = createAsyncThunk("users/add", async(user) =>{
    return await addUser(user)
})

export const handleDelete = createAsyncThunk("delete/user", async(id) =>{
    return await deleteUser(id)
})

const UsersSlice = createSlice({
    name: "user",
    initialState: {
        items:[],
        error: "",
        students:[]
        // user: null
    },
    reducers: {

    },
    extraReducers: (builder) =>{
        builder.addCase(AddUserAction.fulfilled, (state, {payload}) =>{
            if(payload.status === "error"){
                state.error = payload.message
            }else{
                state.items = [...state.items, payload.body]
                state.error = "";
            }
        })

        builder.addCase(getUserList.fulfilled, (state,action)=>{
            state.items =action.payload.users
        })

        builder.addCase(handleDelete.fulfilled, (state, {payload})=>{
            state.items = state.items.filter(elm => elm.id != payload.id)
        })
    }
    
})
export const UsersReducer = UsersSlice.reducer