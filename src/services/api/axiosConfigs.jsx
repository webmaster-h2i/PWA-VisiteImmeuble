import axios from 'axios';
import { redirect } from "react-router-dom";

// Instanciation de l'api
export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

    
api.interceptors.response.use(undefined, (error) => {
    if (error.response.status === 401) {
        redirect("/logout");
    }
})
