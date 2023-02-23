import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    errorMessage: ['ceci est une erreur'],
}

const errorReducer = createSlice({
    name: 'errorstate',
    initialState,
    reducers: {
        addError: (state, action) => {
            state.value = action.payload
        } 
    }
})

export const { addError } = errorReducer.actions
export const errorMsg = (state) => state.errorstate.value
export default errorReducer.reducer