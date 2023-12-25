import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStudents, updateStudent } from "../../../services/api";

export const updateStudentAction = createAsyncThunk("student/update", async({id, student}) =>{
    return  updateStudent(id, student)
})

export const getStudentsAction = createAsyncThunk("student/get", async() =>{
    return  getStudents()
})

const StudentSlice = createSlice({
    name: "students",
    initialState: {
        error: "",
        items:[]

    },
    extraReducers: (builder) => {
        builder.addCase(updateStudentAction.fulfilled, (state, {payload}) =>{
            if(payload.status === "ok"){
                let index = state.items.findIndex(elm => elm.id === payload.body.id)
                if(index !== -1){
                    state.items[index] = payload.body
                }
            }
        })

        builder.addCase(getStudentsAction.fulfilled, (state, action) => {
            state.items = action.payload.students
        })
    }
})

export const StudentReducer = StudentSlice.reducer