import { getOneVisite } from '../../services/api/visiteApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Loader from '../../components/loader';

export default function ListeSignature(){

    const [listePersonne, setListePersonne] = useState([]);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOneVisite(idVisite).then((response) => {
            setListePersonne(response.data.data.personnes)
            setLoading(false)
        })
    },[]);

    if(loading){
        return(
            <Loader/>
        )
    }else{
        return(
            <div>
                <div className="flex justify-center m-9">
                    <h3 className="text-lg text-white">Signature</h3>
                </div>
                {listePersonne.map((pers, index) =>
                    <div key={index} className="flex justify-center mr-5 ml-5 mt-4">
                        <button className="w-full text-white bg-orange-600 rounded-md py-2 px-4" onClick={() => {window.location.href="/signature/"+ (pers.details !== null ? pers.details.code_personne : pers.nom)}}>{pers.nom}</button>
                    </div>
                )}
                <div className="flex justify-center mr-5 ml-5 mt-4">
                    <button className="w-full text-white bg-orange-600 rounded-md py-2 px-4" onClick={() => {window.location.href="/signature/AuthPersonne"}}>Votre signature</button>
                </div>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/recap"}}>Récapitulatif</button>
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/cloture"}}>Clôture</button>
                </div>
            </div>
        )
    }
}