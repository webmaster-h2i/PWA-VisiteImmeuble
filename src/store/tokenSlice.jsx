import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: [''],
}

const tokenReducer = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload
        } 
    }
})

export const { setToken } = tokenReducer.actions
export const token = (state) => state.token.value
export default tokenReducer.reducer