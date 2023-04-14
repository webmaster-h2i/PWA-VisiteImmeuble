import axios from 'axios';
import { NotifyToaster } from '../../components/tools/notifyToast';

// Instanciation de l'api
export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

// Intercept les réponses des requêtes API pour gérer les codes d'erreurs  
api.interceptors.response.use((response) => {
    return response;
},(error) => {
    // Si c'est une erreur 401 alors on affiche un message d'erreur comme quoi la personne est déconnecté
    if(error.code === "ERR_BAD_REQUEST" && error.response.status === 401){
        NotifyToaster(error.response.data.message, "error");
    }
    return Promise.reject(error.message);
})