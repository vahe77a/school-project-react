import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { evaluate, getHomeworksByGroup, getMark } from "../../services/api";
export const getHomeworksByGroupAction = createAsyncThunk("teacher/gethomework", async(id) =>{
    return await getHomeworksByGroup(id)
})

export const evaluateAction = createAsyncThunk("teacher/evaluate", async({group, lesson, student, value}) =>{
    return await evaluate({group, lesson, student}, value)
})

export const getMarkAction = createAsyncThunk("teacher/mark", async(group) =>{
    return getMark(group)
})
const ClassBookSlice = createSlice({
    name: "classbook",
    initialState: {
        lessons: [],
        mark: []
    },
    extraReducers: (builder) =>{
        builder.addCase(getHomeworksByGroupAction.fulfilled, (state, {payload}) =>{
            // console.log(payload);
            state.lessons = payload.result
        })
        builder.addCase(evaluateAction.fulfilled, (state, {payload})=>{
            // console.log(payload);
            // state.mark = [...state.mark, payload.result]
        })
        builder.addCase(getMarkAction.fulfilled, (state, {payload}) =>{
            console.log(payload);
            if(payload.result){
                state.mark.push(payload.result)
            }
        })
    }
})

export const ClassBookReducer = ClassBookSlice.reducer