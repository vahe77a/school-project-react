import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addTest, checkQuestion, getTests, testId } from "../../services/api"

export const addTestAction = createAsyncThunk("teacher/addTest", async(test) =>{
    return addTest(test)
})

export const getTestsAction = createAsyncThunk("student/getTests", async() =>{
    return getTests()
} )

export const testIdAction = createAsyncThunk("test/Id", async(id)=>{
    return testId(id)
})
export const questionCheckAction = createAsyncThunk("test/checkQuestion", async({test, quest})=>{
    return checkQuestion(test, quest)
})

const TestSlice = createSlice({
    name: "test",
    initialState: {
        tests: [],
        activeTest: null
    },
    reducers:{
        setAnswered:(state, {payload:{question, selected, right}}) => {

            let quest = state.activeTest.questions.find(elm => elm.id === question)
            quest.hasBeenAnswered = true
            quest.selectedAnswer = selected
            quest.correctAnswer = right 

            // console.log(action.payload)
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(addTestAction.fulfilled, (state, {payload}) =>{
            // console.log(payload);
            // state.tests = [...state.tests, payload.body]
        })
        builder.addCase(getTestsAction.fulfilled, (state, {payload}) =>{
            // console.log(payload);
            state.tests = payload.tests
        })

        builder.addCase(testIdAction.fulfilled, (state, {payload}) =>{
            // console.log(payload);
            state.activeTest = {...payload.result, questions:[...payload.result.questions.map(quest => {
                return {
                    ...quest,
                    hasBeenAnswered:false,
                    correctAnswer:0,
                    selectedAnswer:0

                }
            })]}

            // console.log(state.activeTest)
        })

        builder.addCase(questionCheckAction.fulfilled, (state, {payload}) =>{
            // console.log(payload)
        })
    }
})

export const {setAnswered} =TestSlice.actions
export const TestReducer = TestSlice.reducer