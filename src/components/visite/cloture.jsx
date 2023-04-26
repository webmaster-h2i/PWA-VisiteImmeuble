import { useEffect, useState } from "react";
import { updateCommentaire, updateDateCloture, getPdf, sendMail, getOneVisite } from "../../services/api/visiteApi";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import { fr } from "date-fns/locale";
import moment from "moment";
import { NotifyToaster } from '../tools/notifyToast';
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';
import Breadcrumb from '../tools/breadcrumb';
import ErrorMessage from '../tools/errorMessage';
registerLocale("fr", fr)

export default function Cloture(){

    const [clotureDate, setClotureDate] = useState(new Date());
    const [updateComm, setUpdateComm] = useState("");
    const [listePersEmail, setListePersEmail] = useState([]);
    const [errorsForm, setErrorsForm] = useState([]);
    const visite = useSelector((visite) => visite.visite.visite);
    
    const navigate = useNavigate();

    function handleModalCloture(){

        let errors = ErrorMessage([clotureDate,updateComm]);
        if(errors.some(el => el !== "")){
            setErrorsForm(errors);
            return;
        }
        document.getElementById('clotureDialog').showModal();
    }

    //Cloture la visite
    function clotureVisite(){
        let cloture = [{
            "date_cloture": moment(clotureDate).format("YYYY-MM-DD HH:mm:ss")
        }];

        let listeEmail = [];

        if(listePersEmail.length > 0){
           listePersEmail.map((lpe) => listeEmail.push(lpe.email));
        }

        //MAJ du commentaire avant cloture de la visite puis génération du pdf
        updateCommentaire(visite.idVisite,[{"commentaire": updateComm}]).then((response) => {
            updateDateCloture(visite.idVisite,cloture).then((response) => {
                getPdf(visite.idVisite).then((response) => {
                    let file = new Blob([response.data], {type: 'application/pdf'});
                    let fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    if(listeEmail.length > 0){
                        sendMail(visite.idVisite,[{"participants":listeEmail}]);
                    }
                    NotifyToaster("Visite terminée",'success');
                    navigate("/");
                })
            })
        })
    }

    return(
        <div>
            <dialog id="clotureDialog" className="bg-[color:var(--bg-color)]">
            <form method="dialog">
               <ClosingDialog clotureVisite={clotureVisite}/>
            </form>
            </dialog>
            <div className="flex ml-8 mt-8">
                <h1 className="text-4xl text-[color:var(--first-text-color)]">Visite d'immeuble</h1>
            </div>
            <div>
                <Breadcrumb/>
            </div>
            <div className="mt-9">
                <DatePickerCloture clotureDate={clotureDate} setClotureDate={setClotureDate} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <CommentaireVisite setUpdateComm={setUpdateComm} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <EnvoiParMail visite={visite} setListePersEmail={setListePersEmail} listePersEmail={listePersEmail}/>
            </div>
            <div className="flex justify-center mt-10 mr-3 ml-3 space-x-6 mb-9">
                <button className="w-full text-[color:var(--first-button-color)] bg-[color:var(--second-button-color)] border-[color:var(--border-button)] border rounded-md py-2 px-4" onClick={() => {window.location.href="/signatures"}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Signatures</button>
                <button className="w-full text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] hover:bg-[color:var(--button-hover-color)] rounded-md py-2 px-4 shadow-2xl" onClick={handleModalCloture}>Clôturer<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

const DatePickerCloture = ({clotureDate, setClotureDate, errorsForm}) => {
    return (
        <div className="mr-3 ml-3 mb-3">
            <label htmlFor="datepickervisite" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Fin de la visite *</label>
            <DatePicker name="datepickervisite" className={`border text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[0] ?"border-red-500":""}`} dateFormat="dd/MM/yyyy HH:mm:ss" locale="fr" selected={clotureDate} onChange={(date) => setClotureDate(date)}/>
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[0]}</p>
        </div>
    );
};

const CommentaireVisite = ({setUpdateComm, errorsForm}) => {
    return(
        <div className="mr-3 ml-3 mb-3">
            <label htmlFor="commentaire" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Mot du gestionnaire *</label>
            <textarea id="commentaire" rows="3" className={`block border p-2.5 w-full text-sm rounded-lg bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[1] ?"border-red-500":""}`} placeholder="mot du gestionnaire" onBlur={(objt) => setUpdateComm(objt.target.value)}></textarea>
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[1]}</p>
        </div>
    )
}

const ClosingDialog = ({clotureVisite}) => {
    return(
        <div>
            <div className="flex justify-center m-5">
                <h3 className="text-lg text-[color:var(--first-text-color)]">Clôture de la visite</h3>
            </div>
            <div className="text-sm text-[color:var(--first-text-color)] m-1 text-justify">
                <p>Êtes-vous certain de vouloir clôturer cette visite ?</p>
                <p className="mt-2">Il vous sera par la suite impossible d'apporter des modifications à celle-ci.</p>
            </div>
            <menu>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-sm text-[color:var(--first-button-color)] bg-[color:var(--input-color)] border border-[color:var(--border-button)] rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                    <button className="w-full text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] text-sm  hover:bg-[color:var(--first-button-color)] rounded-md py-2 px-4 m-1" onClick={() => clotureVisite()}>Clôturer</button>
                </div>
            </menu>
        </div>
    )
}

const EnvoiParMail = ({visite, setListePersEmail, listePersEmail}) => {

    const [listePersonne, setListePersonne] = useState([]);
    const [envoiEmail, setEnvoiEmail] = useState(false);

    useEffect(()=>{
        getOneVisite(visite.idVisite).then((response) => {
            setListePersonne(response.data.data.personnes)
        })
    },[visite.idVisite]);

    return(
        <div className="mr-3 ml-3 mb-3">
            <div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="false" className="sr-only peer" onChange={() => envoiEmail ? setEnvoiEmail(false):setEnvoiEmail(true)}/>
                    <div className="w-10 h-5 rounded-full bg-[color:var(--second-toggle-color)] peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-[color:var(--first-toggle-color)]"></div>
                    <span className="ml-3 text-sm font-medium text-[color:var(--first-text-color)]">Envoi du rapport par mail</span>
                </label>
            </div>
            {
                envoiEmail ? <div className="mt-9"><ListeEnvoiEmail listePersonne={listePersonne} setListePersEmail={setListePersEmail} listePersEmail={listePersEmail}/></div>:<div></div>
            }
        </div>
    )
}

const ListeEnvoiEmail = ({listePersonne, setListePersEmail, listePersEmail}) => {

    const [listeIndexEmail, setListeIndexEmail] = useState([]);

    //Permet d'ajouter les personnes cochées dans la liste des personnes à qui envoyer le rapport
    function handleCheckBox(e, personne, index){
        if(e.target.checked){
            //Ajoute la persone coché à la liste des personnes à qui envoyer le rapport
            setListePersEmail((listePersEmail) => [...listePersEmail, personne]);
            //Permet d'afficher le champ email
            setListeIndexEmail((listeIndexEmail) => [...listeIndexEmail, index])
        }else{
            //Enlève la personne décoché de la liste des personnes à qui envoyer le rapport
            let filterPersEmail = listePersEmail.filter(pers => pers.nom !== personne.nom);
            setListePersEmail(filterPersEmail);
            //Enlève l'index du champ email de la liste pour ne plus l'afficher
            let filterIndexEmail = listeIndexEmail.filter(ind => ind !== index);
            setListeIndexEmail(filterIndexEmail);
        }
    }

    function handleModifEmail(e){

        //Met à jour l'email de la personne correspondante
        listePersEmail.map((el) => el.nom === e.target.getAttribute('personne') ? el.email = e.target.value:"");
    }

    return(
        <div>
            {listePersonne.map((personne, index) => 
            <div className="mt-5" key={index}>
                <div className="flex items-center ml-1">
                    <input onChange={(e) => handleCheckBox(e,{"nom": personne.nom,"email": personne.details !== null ? personne.details.email:undefined}, index)} id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-[color:var(--first-text-color)] accent-[color:var(--first-main-color)]"/>
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-[color:var(--first-text-color)]">{personne.nom}</label>
                </div>
                {
                    listeIndexEmail.includes(index) ?
                    <div className="mt-3">
                        <input onBlur={(e) => handleModifEmail(e)} type="email" name="email" id="email" placeholder="email" personne={personne.nom} defaultValue={!personne.details.email ? '':personne.details.email} className="border text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]"/>
                    </div>:
                    <div></div>
                }
            </div>
            )}
        </div>
    )
}

