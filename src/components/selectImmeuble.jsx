import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import { immeubleVisite, setImmeuble } from '../store/visiteSlice.jsx';
import { getImmeubles } from '../services/api/immeubleApi';

export default function SelectImmeuble (){

    const immeubleVis = useSelector(immeubleVisite);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [listImmeubles, setListImmeubles] = useState([]);

    useEffect(() => {
        getImmeubles().then((response) => {
            setListImmeubles(response.data.data);
        })
    }, []);

    const handleSelect = (e) => {
        e.preventDefault();
        dispatch(setImmeuble(e.target.value));
        console.log(e.target.value);
    }
        
    return (
        <div className="w-80">
            {immeubleVis}
            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selectionner un immeuble</label>
            <select id="countries" onChange={handleSelect} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option defaultValue></option>
                {listImmeubles.map(immeuble => <option value={immeuble.code_immeuble} key={immeuble.code_immeuble}>{immeuble.code_immeuble} : {immeuble.nom}</option>)}
            </select>
        </div>
    );
}