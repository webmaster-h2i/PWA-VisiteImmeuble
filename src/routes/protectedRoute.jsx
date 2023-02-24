import { token } from '../store/tokenSlice.jsx';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Si l'utilisateur n'est pas connecté alors il est redirigé vers la page login
export const ProtectedRoute = ({ children }) => {
    const authToken = useSelector(token);
    const navigate = useNavigate();
    useEffect(() => {
        if(!authToken){
            navigate('/');
        }
    })
    return children;
}