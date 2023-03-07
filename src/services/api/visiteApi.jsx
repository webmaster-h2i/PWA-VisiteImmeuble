import { api } from "./axiosConfigs.jsx";
import store from '../../store/store';

//--VISITE--

// Api call pour récuperer la liste des visites
export async function getVisites(){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite",
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

// Api call pour créer une visite
export async function createVisite(visite){
    console.log(JSON.stringify(visite));
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite",
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visite)
    })
}

//--PERSONNES--

// Api call pour récuperer la liste des personnes
export async function getPersonnes(){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/personne",
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

//--PARAMETRES--

// Permet de récupérer les states du store 
const getCurrentStateFromStore = () =>{
    return {
        token: store.getState().token,
    }
}
