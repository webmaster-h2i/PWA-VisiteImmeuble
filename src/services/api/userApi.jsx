import { api } from "./axiosConfigs.jsx";

// Api call pour s'authentifier et récupérer le token
export async function signIn(email,password){
    return api.request({
        url: "/login",
        method: "POST",
        auth:{
            username: email,
            password: password
        }
    })
}