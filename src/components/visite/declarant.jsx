import { useEffect, useState } from 'react';
import { getPersonnes, updateDeclarant } from '../../services/api/visiteApi';
import { useDispatch, useSelector } from 'react-redux';
import { setDeclarant } from '../../store/visiteSlice';
import { NotifyToaster } from '../tools/notifyToast';
import Loader from '../tools/loader';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';
import Breadcrumb from '../tools/breadcrumb';


export default function SelectImmeuble() {

    const [listeDeclarants, setListeDeclarants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getPersonnes().then((response) => {
            setListeDeclarants(response.data.data);
            setLoading(false);
        })
    },[])

    if(loading){return(<Loader/>)}

    return (
        <div>
            <div className="flex ml-8 mt-8">
                <h1 className="text-4xl text-[color:var(--first-text-color)]">Visite d'immeuble</h1>
            </div>
            <div>
                <Breadcrumb/>
            </div>
            <div className="flex justify-center text-sm text-justify mt-9 mr-9 ml-9 text-[color:var(--first-text-color)]">
                <p>Cette personne sera désignée comme ayant déclaré l'anomalie nécessitant une intervention (OS).</p>
            </div>
            <div className="mt-9">
                <SelectDeclarants listeDeclarants={listeDeclarants}/>
            </div>
            <div className="flex justify-between mx-auto m-9 p-4 mt-10 mb-9">
                <button className="w-full text-[color:var(--first-button-color)] bg-[color:var(--second-button-color)] rounded-md py-2 px-4 border border-[color:var(--border-button)]" onClick={() => {window.location.href="/recap"}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Récapitulatif</button>
                <button className="w-full text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] hover:bg-[color:var(--button-hover-color)] rounded-md py-2 px-4 shadow-2xl" onClick={() => {window.location.href="/signatures"}}>Signatures<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    );
}

const SelectDeclarants = ({listeDeclarants}) => {

    const dispatch = useDispatch();
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);

    const handleSelect = (e) => {
        e.preventDefault();
        updateDeclarant(idVisite, [{"code_personne":e.target.value}]).then((response) => {
            NotifyToaster(response.data.message, 'success');
        });
        dispatch(setDeclarant(e.target.value));
    }

    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="declarants" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Selectionner un déclarant</label>
            <select id="declarants" className="border text-xs rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]" onChange={handleSelect}>
                <option defaultValue></option>
                {listeDeclarants.map((declarant, index) => <option className="text-sm" value={declarant.code_personne} key={index}>{declarant.nom}</option>)}
            </select>
        </div>
    )
}