import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addHomework, getTeachers } from "../../services/api";

export const getTeachersAction = createAsyncThunk("admin/getTeachers", async()=>{
    return await getTeachers()
})

export const addHomeworkAction = createAsyncThunk("teacher/addHomework", async({title, content, group}) =>{
    return await addHomework({title, content, group})
})

const TeacherSlice = createSlice({
    name: "teacher",
    initialState: {
        teachers: [],
        error: ""
    },
    extraReducers: (builder) =>{
        builder.addCase(getTeachersAction.fulfilled, (state, {payload}) =>{
            if(payload.status === "OK"){
                state.teachers = payload.teachers
            }
        })
        builder.addCase(addHomeworkAction.fulfilled, (state, {payload}) =>{
            // console.log(payload);
        })
    }
})

export const TeacherReducer = TeacherSlice.reducer