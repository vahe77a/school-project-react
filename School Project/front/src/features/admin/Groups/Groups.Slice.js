import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addGroup, deleteGroup, getGroups } from "../../../services/api";

export const getGroupsAction = createAsyncThunk("admin/getGroups", async() =>{
    return await getGroups()
})

export const addGroupAction = createAsyncThunk("admin/addGroup", async(group) =>{
    return await addGroup(group)
})

export const deleteGroupAction = createAsyncThunk("admin/delGroup", async(id) =>{
    return await deleteGroup(id)
})

const GroupSlice = createSlice({
    name: "groups",
    initialState:{
        groups: [],
        error: "",
        teachers: [],
        availableStudents: []
    },
    extraReducers: (builder) =>{
        builder.addCase(getGroupsAction.fulfilled, (state, {payload: {groups, teachers, availableStudents}}) =>{
            state.groups = groups
            state.teachers = teachers
            state.availableStudents = availableStudents
        })

        builder.addCase(addGroupAction.fulfilled, (state, {payload}) =>{
            console.log(payload);
            if(payload.status === "ok"){
                state.groups = [...state.groups, payload.body]
            }else{
                state.error = payload.message
            }
        })
        builder.addCase(deleteGroupAction.fulfilled, (state, {payload}) =>{
            state.groups = state.groups.filter(elm => elm.id != payload.id)
        })
    }   
})

export const GroupsReducer = GroupSlice.reducer