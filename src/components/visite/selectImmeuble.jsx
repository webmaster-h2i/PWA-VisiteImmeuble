import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { immeubleVisite, setImmeuble } from '../../store/visiteSlice.jsx';
import { getImmeubles } from '../../services/api/immeubleApi';
import  ErrorMessage  from '../errorMessage';

export default function SelectImmeuble (){

    const immeubleVis = useSelector(immeubleVisite);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listImmeubles, setListImmeubles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getImmeubles().then((response) => {
            setListImmeubles(response.data.data);
        })
    }, []);

    const handleSelect = (e) => {
        e.preventDefault();
        dispatch(setImmeuble(e.target.value));
    }

    const handleclick = (e) => {
        e.preventDefault();
        setError(null)
        if(immeubleVis !== ''){
            navigate('/info');
        }
        setError('Veuillez selectionner un immeuble');
    }
        
    return (
        <div className="mt-9 flex items-center">
            <div className="m-auto">
                <div className="flex">
                    <div className="w-80">
                        <ErrorMessage errors={error}/>
                        <label htmlFor="immeubles" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selectionner un immeuble</label>
                        <select id="immeubles" onChange={handleSelect} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option defaultValue></option>
                            {listImmeubles.map(immeuble => <option className="text-lg" value={immeuble.code_immeuble} key={immeuble.code_immeuble}>{immeuble.code_immeuble} - {immeuble.nom}</option>)}
                        </select>
                        <div className="flex justify-center mt-5">
                            <button className="w-full text-white bg-sky-600 rounded-lg py-2 px-4 hover:bg-blue-600" onClick={handleclick}>Valider</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}