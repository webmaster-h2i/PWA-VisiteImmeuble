import { api } from "./axiosConfigs.jsx";
import store from '../../store/store';

export async function getImmeubles(){
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/immeuble",
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

const getCurrentStateFromStore = () =>{
    return {
        token: store.getState().token,
    }
}
