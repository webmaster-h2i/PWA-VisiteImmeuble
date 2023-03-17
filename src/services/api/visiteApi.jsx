import { api } from "./axiosConfigs.jsx";
import store from '../../store/store';

//--VISITES--

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

// Api call pour récuperer une visite
export async function getOneVisite(idVisite){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite,
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

// Api call pour créer une visite
export async function addVisite(visite){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite",
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        data: visite
    })
}

// Api call pour modifier une visite
export async function updateVisite(idVisite,visite){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite,
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        data: visite
    })
}


// Api call pour supprimer une visite
export async function deleteVisite(idVisite){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite,
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

// Api call pour mettre à jour le commentaire d'une visite
export async function updateCommentaire(idVisite,commentaire){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/commentaire",
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        },
        data: commentaire
    })
}

// Api call pour mettre à jour la date de cloture d'une visite
export async function updateDateCloture(idVisite,dateCloture){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/cloture",
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        },
        data: dateCloture
    })
}

// Api call pour mettre à jour le déclarant d'une visite
export async function updateDeclarant(idVisite,declarant){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/declarant",
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        },
        data: declarant
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

//--PHOTOS--

// Api call pour ajouter une photo à un élément
export async function addPhoto(idVisite, photos){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/photo",
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        data: photos
    })
}

// Api call pour supprimer une photo
export async function deletePhoto(idVisite, idPhoto){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/photo/"+idPhoto,
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        },
    })
}

//--ELEMENTS--

// Api call pour créer un élément
export async function addElement(idVisite, element){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/element",
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        data: element
    })
}

// Api call pour créer un élément
export async function getOneElement(idVisite, secteur, composant){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/element/"+secteur+"/"+composant,
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    })
}

// Api call pour supprimer un element
export async function deleteElement(idVisite, element){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/element",
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        },
        data: element
    })
}

//--SECTEURS--

// Api call pour récuperer la liste des secteurs
export async function getSecteurs(){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/secteur",
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

//--COMPOSANTS--

// Api call pour récuperer la liste des composants
export async function getComposants(){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/composant",
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authToken}` 
        }
    })
}

//--SIGNATURE--

// Api call pour ajouter une signature
export async function addSignature(idVisite, signature){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/signature",
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        data: signature
    })
}

//--PDF--

// Api call pour récuperer le rapport
export async function getPdf(idVisite){
    // récupère le token du store
    const authToken = getCurrentStateFromStore().token.value;
    return api.request({
        url: "/visite/"+idVisite+"/pdf",
        method: "GET",
        responseType: 'blob',
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
