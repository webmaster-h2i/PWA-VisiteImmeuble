import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    visite: {
        immeuble:'',
        idVisite:'',
        elements:[],
        photos:[],
        info:[],
        declarant:'',
        authSignature: null,
        personnes:[]
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
        },
        setAuthSignature: (state, action) => {
            state.visite.authSignature = action.payload
        },
        setPersonnes: (state, action) => {
            state.visite.personnes = action.payload
        }
    }
})

export const { setImmeuble, setIdVisite, setElements, setPhotos, setinfoGenerales, setVisite, setDeclarant, setAuthSignature, setPersonnes } = visiteReducer.actions
export default visiteReducer.reducer