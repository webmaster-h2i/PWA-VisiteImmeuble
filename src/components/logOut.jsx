import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import storage from 'redux-persist/lib/storage';
import { setToken } from "../store/tokenSlice.jsx";


export default function LogOut() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        storage.removeItem('persist:root').then(
            dispatch(setToken(''))
        ).then(
            navigate('/')
        )
    });
}