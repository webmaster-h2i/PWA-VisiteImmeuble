import axios from 'axios';

// Instanciation de l'api
export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})
