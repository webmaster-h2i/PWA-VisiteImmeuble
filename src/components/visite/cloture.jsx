import { useEffect, useState } from "react";
import { updateCommentaire, updateDateCloture, getPdf, sendMail, getOneVisite } from "../../services/api/visiteApi";
import { useSelector } from "react-redux";
import Loader from "../tools/loader";
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import { fr } from "date-fns/locale";
import moment from "moment";
import { NotifyToaster } from '../tools/notifyToast';
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';
registerLocale("fr", fr)

export default function Cloture(){

    const [clotureDate, setClotureDate] = useState(new Date());
    const [envoiEmail, setEnvoiEmail] = useState(false);
    const [loading, setLoading] = useState(true);
    const visite = useSelector((visite) => visite.visite.visite);
    const [dialogContent,setDialogContent] = useState("cloture");
    const [listePersonne, setListePersonne] = useState([]);
    const [listePersEmail, setListePersEmail] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        getOneVisite(visite.idVisite).then((response) => {
            setListePersonne(response.data.data.personnes)
        })
        setLoading(false);
    },[])

    //Update le commentaire (mot du gestionnaire) dès que la textarea n'est plus focus 
    function updateComm(newComm){
        setLoading(true);
        let commFormat = [{
            "commentaire": newComm
        }]
        updateCommentaire(visite.idVisite,commFormat);
        setLoading(false);
    }

    //Ajoute une date de cloture à la visite et renvoi le rapport
    async function handleCloture(e){
        if(envoiEmail){
            e.preventDefault();
            setDialogContent("listeEnvoi");
        }else{
            clotureVisite();
        }
    }

    //Date
    function clotureVisite(listeEmail=null){
        let cloture = [{
            "date_cloture": moment(clotureDate).format("YYYY-MM-DD HH:mm:ss")
        }];

        updateDateCloture(visite.idVisite,cloture).then((response) => {
            getPdf(visite.idVisite).then((response) => {
                let file = new Blob([response.data], {type: 'application/pdf'});
                let fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                if(listeEmail){
                    sendMail(visite.idVisite,listeEmail);
                }
                NotifyToaster("Visite terminée",'info');
                navigate("/");
            })
        })
    }


    if(loading){return(<Loader/>)}

    return(
        <div>
            <dialog id="clotureDialog" className="bg-gray-800" open={envoiEmail ? "open":false}>
            <form method="dialog">
               { dialogContent === "cloture" ? <ClosingDialog setEnvoiEmail={setEnvoiEmail} handleCloture={handleCloture}/>:dialogContent === "listeEnvoi" ? <ListeEnvoiEmail listePersonne={listePersonne} setListePersEmail={setListePersEmail} listePersEmail={listePersEmail} setDialogContent={setDialogContent}/>:<ModifEmail visite={visite} listePersEmail={listePersEmail} setListePersEmail={setListePersEmail} clotureVisite={clotureVisite}/> }
            </form>
            </dialog>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-[color:var(--text-color)]">Clôture de la visite</h3>
            </div>
            <div className="mt-9">
                <DatePickerCloture clotureDate={clotureDate} setClotureDate={setClotureDate}/>
            </div>
            <div className="mt-9">
                <CommentaireVisite updateComm={updateComm}/>
            </div>
            <div className="flex justify-center mt-12 mr-3 ml-3">
                <button className="w-full text-[color:var(--text-color)] bg-sky-600 hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/signatures"}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Signatures</button>
                <button className="w-full text-[color:var(--text-color)] bg-sky-600 hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={() => document.getElementById('clotureDialog').showModal()}>Clôturer<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

const DatePickerCloture = ({clotureDate, setClotureDate}) => {
    return (
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="datepickervisite" className="block mb-2 text-sm font-medium text-[color:var(--text-color)]">Fin de la visite *</label>
            <DatePicker name="datepickervisite" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-[color:var(--text-color)]" dateFormat="dd/MM/yyyy HH:mm:ss" locale="fr" selected={clotureDate} onChange={(date) => setClotureDate(date)}/>
        </div>
    );
};

const CommentaireVisite = ({updateComm}) => {
    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="commentaire" className="block mb-2 text-sm font-medium text-[color:var(--text-color)]">Mot du gestionnaire *</label>
            <textarea id="commentaire" rows="4" className="block p-2.5 w-full text-sm rounded-lg bg-gray-700  placeholder-gray-400 text-[color:var(--text-color)] " placeholder="mot du gestionnaire" onBlur={(objt) => updateComm(objt.target.value)}></textarea>
        </div>
    )
}

const ClosingDialog = ({setEnvoiEmail,envoiEmail,handleCloture}) => {
    return(
        <div>
            <div className="flex justify-center m-5">
                <h3 className="text-lg text-[color:var(--text-color)]">Clôture de la visite</h3>
            </div>
            <div className="text-sm text-[color:var(--text-color)] m-1 text-justify">
                <p>Êtes-vous certain de vouloir clôturer cette visite ?</p>
                <p className="mt-2">Il vous sera par la suite impossible d'apporter des modifications à celle-ci.</p>
            </div>
            <div className="mt-8">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="false" className="sr-only peer" onChange={() => envoiEmail ? setEnvoiEmail(false):setEnvoiEmail(true)}/>
                    <div className="w-10 h-5 rounded-full bg-gray-700 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-orange-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">Envoi du rapport par mail</span>
                </label>
            </div>
            <menu>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-sm text-[color:var(--text-button-color)]  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                    <button className="w-full text-[color:var(--text-color)] text-sm  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={(e) => handleCloture(e)}>Clôturer</button>
                </div>
            </menu>
        </div>
    )
}

const ListeEnvoiEmail = ({listePersonne, setListePersEmail, listePersEmail, setDialogContent}) => {

    //Permet d'ajouter les personnes cochées dans la liste des personnes à qui envoyer le rapport
    function handleCheckBox(e,personne){
        if(e.target.checked){
            //Ajoute la persone coché à la liste des personnes à qui envoyer le rapport
            setListePersEmail((listePersEmail) => [...listePersEmail, personne])
        }else{
            //Enlève la personne décoché de la liste des personnes à qui envoyer le rapport
            let filterList = listePersEmail.filter( pers => pers.nom !== personne.nom);
            setListePersEmail(filterList);
        }
    }

    return(
        <div>
            <div className="flex justify-center m-5">
                <h3 className="text-sm text-[color:var(--text-color)]">Participants auquels envoyer le rapport</h3>
            </div>
            {listePersonne.map((personne, index) => 
                <div className="flex items-center m-5" key={index}>
                    <input onChange={(e) => handleCheckBox(e,{"nom": personne.nom,"email": personne.details !== null ? personne.details.email:undefined})} id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"/>
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{personne.nom}</label>
                </div>
            )}
            <menu>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-sm text-[color:var(--text-button-color)]  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                    <button className="w-full text-[color:var(--text-color)] text-sm  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={() => setDialogContent("modifEmail")}>Envoyer</button>
                </div>
            </menu>
        </div>
    )
}

const ModifEmail = ({listePersEmail, clotureVisite}) => {
    
    function handleModifEmail(){

        let listeEmail = [];
        listePersEmail.map((pers) => listeEmail.push(pers.email))
        let formatListeEmail = [{"participants":listeEmail}];
        clotureVisite(formatListeEmail);
    }

    return(
        <div>
            <div className="flex justify-center m-5">
                <h3 className="text-sm text-[color:var(--text-color)]">Participants auquels envoyer le rapport</h3>
            </div>
            {listePersEmail.map((personne, index) =>
                <div className="mt-2" key={index}>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-[color:var(--text-color)]">{personne.nom}</label>
                    <input onBlur={(e) => personne.email = e.target.value} type="email" name="email" id="email" placeholder="email" defaultValue={!personne.email ? '':personne.email} className="border text-xs rounded-lg block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-[color:var(--text-color)]"/>
                </div>
            )}
            <menu>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-sm text-[color:var(--text-button-color)]  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                    <button className="w-full text-[color:var(--text-color)] text-sm  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={handleModifEmail}>Clôturer</button>
                </div>
            </menu>
        </div>
    )
}

