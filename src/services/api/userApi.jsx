import { api } from "./axiosConfigs.jsx";

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