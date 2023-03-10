import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOneVisite, deleteElement } from '../../services/api/visiteApi';
import { ReactComponent as Pen } from '../../assets/icons/pen.svg';
import { ReactComponent as Trash } from '../../assets/icons/trash.svg';
import { ReactComponent as Valid } from '../../assets/icons/valid.svg';
import { ReactComponent as Stop } from '../../assets/icons/stop.svg';
import ErrorMessage from '../../components/errorMessage';
import Loader from '../../components/loader';

export default function Recapitulatif(){

    const [listElement, setListELement] = useState([]);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOneVisite(idVisite).then((response) => {
            console.log(response)
            setListELement(response.data.data.elements)
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
                    <h3 className="text-lg text-white">Récapitulatif</h3>
                </div>
                <ErrorMessage errors={error}/>
                <div className="p-2">
                    <TableauRecap listElement={listElement} idVisite={idVisite} setLoading={setLoading} setListELement={setListELement}/>
                </div>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-blue-600 m-1" onClick={() => {window.location.href="/element"}}>Créer un élément</button>
                    <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-blue-600 m-1">Signatures &#62;</button>
                </div>
            </div>
        )
    }
}

const TableauRecap = ({listElement, idVisite, setLoading, setListELement}) => {

    //Call Api pour supprimer un element
    function handleDeleteElement(e, secteurId, composantId){
        e.preventDefault();
        let element = [{
            secteur_id: secteurId,
            composant_id: composantId
        }]
        setLoading(true)
        deleteElement(idVisite, element).then(
            getOneVisite(idVisite).then((response) => {
                setListELement(response.data.data.elements)
                setLoading(false)
            })
        )
    }

    if(listElement.length > 0){

        return(
            <div className="divide-y divide-gray-200 bg-neutral-800 rounded-md p-1">
                <div className="grid grid-cols-7">
                    <div className="flex justify-center text-white text-sm pt-1 pb-2 col-span-2">
                        Secteur
                    </div>
                    <div className="flex justify-center text-white text-sm pt-1 pb-2 col-span-2">
                        Composant
                    </div>
                    <div className="flex justify-center text-white text-sm pt-1 pb-2 col-span-2">
                        Conforme
                    </div>
                    <div className="flex justify-center text-white text-sm pt-1 pb-2 col-span-1">
                        action
                    </div>
                </div>
                {listElement.map((elem, index) =>
                    <div key={index} className="grid grid-cols-7">
                        <div className="flex justify-center text-white text-xs pt-3 col-span-2">
                            {elem.secteur.nom}
                        </div>
                        <div className="flex justify-center text-white text-xs pt-3 col-span-2">
                            {elem.composant.nom}
                        </div>
                        <div className="flex justify-center text-white text-xs pt-1 col-span-2">
                            {elem.etat ? <Valid className="w-5 rounded-full text-green-500"/>:<Stop className="w-4 text-orange-500"/>}
                        </div>
                        <div className="inline-flex justify-center text-xs pt-2 col-span-1">
                            <div className="p-1">
                                <button className=" text-white rounded-full shadow-2xl">
                                    <Pen className="w-4 text-sky-500"/>
                                </button>
                            </div>
                            <div className="p-1">
                                <button className="text-white rounded-full shadow-2xl" onClick={(e) => handleDeleteElement(e, elem.secteur.id, elem.composant.id)}>
                                    <Trash className="w-4 text-red-500"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }else{
        return(
            <div className='flex justify-center text-white text-sm'>
                <h5>Aucun élément</h5>
            </div>
        )   
    }
}