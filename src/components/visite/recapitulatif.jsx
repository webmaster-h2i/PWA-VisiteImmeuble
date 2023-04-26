import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOneVisite, deleteElement } from '../../services/api/visiteApi';
import { ReactComponent as Pen } from '../../assets/icons/pen.svg';
import { ReactComponent as Trash } from '../../assets/icons/trash.svg';
import { ReactComponent as Valid } from '../../assets/icons/valid.svg';
import { ReactComponent as Stop } from '../../assets/icons/stop.svg';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';
import Loader from '../tools/loader';
import { NotifyToaster } from '../tools/notifyToast';
import Breadcrumb from '../tools/breadcrumb';
import moment from "moment";

export default function Recapitulatif(){

    const [listElement, setListELement] = useState([]);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const infoVisite = useSelector((visite) => visite);
    const [loading, setLoading] = useState(true);
    const [osDeclarant, setOsDeclarant] = useState(false);

    //Récupère la liste des élément de la visite
    useEffect(() => {
        getOneVisite(idVisite).then((response) => {
            setListELement(response.data.data.elements)
            setLoading(false)
        })
    },[]);

    //Vérifie si l'un des élément a un ordre de service alors il faut ajouter un déclarant
    useEffect(() => {
        setOsDeclarant(false)
        listElement.map((element) => element.os_a_planifier === 1 ? setOsDeclarant(true):'');
    },[listElement]);

    return(
        <div>
            <div className="flex ml-8 mt-8">
                <h1 className="text-4xl text-[color:var(--first-text-color)]">Visite d'immeuble</h1>
            </div>
            <div>
                <Breadcrumb/>
            </div>
            <div>
                <InfoVisite infoVisite={infoVisite}/>
            </div>
            <div>
                <TableauRecap listElement={listElement} idVisite={idVisite} setLoading={setLoading} loading={loading} setListELement={setListELement}/>
            </div>
            <div className="flex justify-center mt-10 mr-3 ml-3 space-x-6 mb-9">
                <button className="w-full text-[color:var(--first-button-color)] bg-[color:var(--second-button-color)] border-[color:var(--border-button)] border rounded-md py-2 px-4" onClick={() => {window.location.href="/element"}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Ajout d'élém.</button>
                <button className="w-full text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] hover:bg-[color:var(--button-hover-color)] rounded-md py-2 px-4 shadow-2xl" onClick={() => {window.location.href= osDeclarant ? "/declarant":"/signatures"}}>{osDeclarant ? "Déclarant":"Signatures"}<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

const InfoVisite = ({infoVisite}) => {

    // Permet d'afficher la virgule ou non après le nom du participant
    let tailleArrayParticipants = infoVisite.visite.visite.personnes.length;

    return (
        <div className="bg-sky-100">
            <div className="ml-9 pt-3 text-sm text-[color:var(--first-text-color)]">
                <strong><h5>{infoVisite.visite.visite.immeuble.nom}</h5></strong>
            </div>
            <div className="ml-9 mr-9 mt-2 text-sm text-[color:var(--first-text-color)]">
                <p className="pt-2 pb-2">Début : {moment(infoVisite.visite.visite.info[0].date_creation, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm")}</p>
                <p className="pt-2 pb-2">Objet : {infoVisite.visite.visite.info[0].objet}</p>
                <p className="pt-2 pb-2">Visite contractuelle : {infoVisite.visite.visite.info[0].type === "Contractuelle" ? "Oui": "Non"}</p>
                <p className="pt-2 pb-2">Participants : {infoVisite.visite.visite.personnes.map((participant, index) => participant.label + (tailleArrayParticipants - 1 !== index ? ", ":""))}</p>
            </div>
        </div>
    )
}

// Liste des éléments ajoutés à la visite
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
            let filterList = listElement.filter(element => element.composant.id !== composantId && (element.secteur.id !== secteurId || element.secteur.id === secteurId));

            setListELement(filterList);
            NotifyToaster("L'élément a bien été supprimé", "success");
        })
        setLoading(false);
    }

    if(loading){return(<Loader/>)}

    if(listElement.length > 0){

        return(
            <div className="ml-9 mr-9 pt-3">
                <div className="text-sm text-[color:var(--first-text-color)]">
                    <strong><h5>Installations</h5></strong>
                </div>
                <div className="divide-y">
                    {listElement.map((elem, index) =>
                        <div key={index} className="grid grid-cols-7 pt-2 pb-1">
                            <div className={`col-span-1 flex items-center justify-center ${elem.photos.length > 0 ? "":"bg-gray-200"}`}>
                                { 
                                    elem.photos.length > 0 ?
                                    <img className="max-w-14 max-h-15 mt-1 mb-1" src={ 'data:image/png;base64,'+elem.photos[0].image} alt="element"/>:
                                    <div className="text-xs rounded-full"><Stop className="w-8"/></div>
                                }
                            </div>
                            <div className="col-span-4 ml-2 mt-1 text-xs text-[color:var(--first-text-color)]">
                                <h5 className="text-sm">{elem.secteur.nom} - {elem.composant.nom}</h5>
                                {   
                                    elem.etat === 1 ?
                                    <div className="inline-flex pt-1 text-green-600 text-sm"><Valid className="w-4"/><p className="ml-1">Conforme</p></div>:
                                    <div className="inline-flex pt-1 text-red-600"><Stop className="w-4"/><p className="ml-1">Non conforme</p></div>
                                }
                                <p className="italic mt-1 truncate">{elem.commentaire}</p>
                            </div>
                            <div className="inline-flex text-xs pt-2 place-content-end col-span-2">
                                <div className="p-1">
                                    <button className="text-[color:var(--first-text-color)] bg-[color:var(--first-block-home-color)] py-1 px-1 shadow-2xl border border-[color:var(--input-border-color)]" onClick={() => window.location.href="/element/"+elem.secteur.id+"/"+elem.composant.id}>
                                        <Pen className="w-5"/>
                                    </button>
                                </div>
                                <div className="p-1">
                                    <button className="text-[color:var(--first-text-color)] bg-[color:var(--first-block-home-color)] py-1 px-1 shadow-2xl border border-[color:var(--input-border-color)]" onClick={(e) => handleDeleteElement(e, elem.secteur.id, elem.composant.id)}>
                                        <Trash className="w-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }else{
        return(
            <div className='flex justify-center text-[color:var(--first-text-color)] text-sm mt-9'>
                <h5>Aucun élément</h5>
            </div>
        )   
    }
}