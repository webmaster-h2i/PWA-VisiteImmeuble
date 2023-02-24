import axios from 'axios';

// Instanciation de l'api
export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

// Gestionnaire d'erreurs
const errorHandler = (error) => {
    return Promise.reject(error)
}

// Permet d'intercepter les erreurs et de renvoyer vers le gestionnaire d'erreurs
api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error)
})