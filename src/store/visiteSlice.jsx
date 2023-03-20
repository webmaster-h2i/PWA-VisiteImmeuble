import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    visite: {
        immeuble:'',
        idVisite:'',
        elements:[],
        photos:[],
        info:[],
        declarant:'' 
    },
}

const visiteReducer = createSlice({
    name: 'visite',
    initialState,
    reducers: {
        setVisite: (state, action) => {
            state.visite = action.payload
        },
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
        },
        setDeclarant: (state, action) => {
            state.visite.declarant = action.payload
        }
    }
})

export const { setImmeuble, setIdVisite, setElements, setPhotos, setinfoGenerales, setVisite, setDeclarant } = visiteReducer.actions
export default visiteReducer.reducer