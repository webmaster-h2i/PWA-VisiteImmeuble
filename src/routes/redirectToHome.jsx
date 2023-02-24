import { token } from '../store/tokenSlice.jsx';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Si l'utilisateur est connecté alors il est redirigé vers la page accueil
export const RedirectHome = ({ children }) => {
    const authToken = useSelector(token);
    const navigate = useNavigate();
    useEffect(() => {
        if(authToken){
            navigate('/accueil');
        }
    })
    return children;
}