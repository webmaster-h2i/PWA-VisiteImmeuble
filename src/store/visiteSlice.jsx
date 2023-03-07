import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    visite: [''],
}

const visiteReducer = createSlice({
    name: 'visite',
    initialState,
    reducers: {
        setImmeuble: (state, action) => {
            state.value = {'immeuble':action.payload}
        }
    }
})

export const { setImmeuble } = visiteReducer.actions
export const immeubleVisite = (state) => state.visite.value
export default visiteReducer.reducer