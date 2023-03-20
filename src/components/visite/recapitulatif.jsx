import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOneVisite, deleteElement } from '../../services/api/visiteApi';
import { ReactComponent as Pen } from '../../assets/icons/pen.svg';
import { ReactComponent as Trash } from '../../assets/icons/trash.svg';
import { ReactComponent as Valid } from '../../assets/icons/valid.svg';
import { ReactComponent as Stop } from '../../assets/icons/stop.svg';
import Loader from '../../components/loader';

export default function Recapitulatif(){

    const [listElement, setListELement] = useState([]);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const [loading, setLoading] = useState(true);
    const osDeclarant = getOs();

    useEffect(() => {
        getOneVisite(idVisite).then((response) => {
            setListELement(response.data.data.elements)
            setLoading(false)
        })
    },[]);

    function getOs(){
        let os = false;
        listElement.map((element) => os = element.os_a_planifier === 1 ? true:false);
        return os;
    }

    return(
        <div>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-white">Récapitulatif</h3>
            </div>
            <div className="p-2">
                <TableauRecap listElement={listElement} idVisite={idVisite} setLoading={setLoading} loading={loading} setListELement={setListELement}/>
            </div>
            <div className="flex justify-center mt-12 mr-2 ml-2 mb-5">
                <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-sky-700 m-1" onClick={() => {window.location.href="/element"}}>Créer un élément</button>
                <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-sky-700 m-1" onClick={() => {window.location.href= osDeclarant ? "/declarant":"/signatures"}}>{osDeclarant ? "Déclarant":"Signatures"}</button>
            </div>
        </div>
    )
}

const TableauRecap = ({listElement, idVisite, setLoading, loading, setListELement}) => {

    //Call Api pour supprimer un element
    function handleDeleteElement(e, secteurId, composantId){
        e.preventDefault();
        let element = [{
            secteur_id: secteurId,
            composant_id: composantId
        }]
        setLoading(true)
        deleteElement(idVisite, element).then(() => {
            //MAJ de l'état de la liste des éléments en enlevant l'élément supprimé
            let filterList = listElement.filter(element => element.composant.id !== composantId && element.secteur.id !== secteurId);
            setListELement(filterList);
        })
        setLoading(false);
    }

    if(loading){return(<Loader/>)}

    if(listElement.length > 0){

        return(
            <div className="divide-y divide-orange-600 bg-neutral-800 rounded-md p-1">
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
                                <button className=" text-white rounded-full shadow-2xl" onClick={() => window.location.href="/element/"+elem.secteur.id+"/"+elem.composant.id}>
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