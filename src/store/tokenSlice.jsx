import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: [''],
    user: ['']
}

const tokenReducer = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
    }
})

export const { setToken, setUser } = tokenReducer.actions
export const token = (state) => state.token.value
export const user = (state) => state.user.value
export default tokenReducer.reducer