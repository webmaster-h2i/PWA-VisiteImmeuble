import { useEffect, useState } from 'react';
import { getPersonnes, updateDeclarant } from '../../services/api/visiteApi';
import { useDispatch, useSelector } from 'react-redux';
import { setDeclarant } from '../../store/visiteSlice';


export default function SelectImmeuble() {

    const [listeDeclarants, setListeDeclarants] = useState([]);

    useEffect(()=>{
        getPersonnes().then((response) => {
            setListeDeclarants(response.data.data);
        })
    },[])

    return (
        <div>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-white">Déclarant</h3>
            </div>
            <div className="flex justify-center text-sm text-justify mt-9 mr-3 ml-3 text-white">
                <p>Cette personne sera désignée comme ayant déclaré l'anomalie nécessitant une intervention (OS).</p>
            </div>
            <div className="mt-9">
                <SelectDeclarants listeDeclarants={listeDeclarants}/>
            </div>
            <div className="flex justify-center mt-12 mr-3 ml-3">
                <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/recap"}}>Récapitulatif</button>
                <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/signatures"}}>Signatures</button>
            </div>
        </div>
    );
}

const SelectDeclarants = ({listeDeclarants}) => {

    const dispatch = useDispatch();
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);

    const handleSelect = (e) => {
        e.preventDefault();
        updateDeclarant(idVisite, [{"code_personne":e.target.value}]);
        dispatch(setDeclarant(e.target.value));
    }

    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="declarants" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selectionner un déclarant</label>
            <select id="declarants" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" onChange={handleSelect}>
                <option defaultValue></option>
                {listeDeclarants.map((declarant, index) => <option className="text-lg" value={declarant.code_personne} key={index}>{declarant.nom}</option>)}
            </select>
        </div>
    )
}