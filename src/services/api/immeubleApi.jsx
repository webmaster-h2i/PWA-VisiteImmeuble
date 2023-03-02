import { api } from "./axiosConfigs.jsx";
import store from '../../store/store';

// Api call pour récuperer la liste des immeubles
export async function getImmeubles(){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/immeuble",
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

// Permet de récupérer les states du store 
const getCurrentStateFromStore = () =>{
    return {
        token: store.getState().token,
    }
}
