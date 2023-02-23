import { token } from '../store/tokenSlice.jsx';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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