import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    visite: {
        immeuble:'',
        idVisite:'',
        elements: [],
        photos: [],
        info: []
    },
}

const visiteReducer = createSlice({
    name: 'visite',
    initialState,
    reducers: {
        setImmeuble: (state, action) => {
            state.visite.immeuble = action.payload
        },
        setIdVisite: (state, action) => {
            state.visite.idVisite = action.payload
        },
        setElements: (state, action) => {
            state.visite.elements = [...state.visite.elements,action.payload]
        },
        setPhotos: (state, action) => {
            state.visite.photos = action.payload
        },
        setinfoGenerales: (state, action) => {
            state.visite.info = action.payload
        }
    }
})

export const { setImmeuble, setIdVisite, setElements, setPhotos, setinfoGenerales } = visiteReducer.actions
export const immeubleVisite = (state) => state.visite.value
export default visiteReducer.reducer