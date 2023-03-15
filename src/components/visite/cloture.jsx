import { useState } from "react";
import { updateCommentaire, updateDateCloture, getPdf } from "../../services/api/visiteApi";
import { useSelector } from 'react-redux';
import Loader from '../../components/loader';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import { fr } from 'date-fns/locale';
import moment from "moment";
registerLocale('fr', fr)

export default function Cloture(){

    const [clotureDate, setClotureDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);

    //Update le commentaire (mot du gestionnaire) dès que la textarea n'est plus focus 
    function updateComm(newComm){
        setLoading(true);
        let commFormat = [{
            "commentaire": newComm
        }]
        updateCommentaire(idVisite,commFormat);
        setLoading(false);
    }

    //Ajoute une date de cloture à la visite et renvoi le rapport
    function handleCloture(){
        setLoading(true);
        let cloture = [{
            "date_cloture": moment(clotureDate).format("YYYY-MM-DD HH:mm:ss")
        }]

        updateDateCloture(idVisite,cloture).then(
            getPdf(idVisite).then((response) => {
                let file = new Blob([response.data], {type: 'application/pdf'});
                let fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            })
        )
        setLoading(false);
    }

    if(loading){
        return(<Loader/>)
    }else{
        return(
            <div>
                <dialog id="clotureDialog" className="bg-gray-800">
                    <form method="dialog">
                        <div className="flex justify-center m-5">
                            <h3 className="text-lg text-white">Clôture de la visite</h3>
                        </div>
                        <div className="text-sm text-white m-1 text-justify">
                            <p>Êtes-vous certain de vouloir clôturer cette visite ?</p>
                            <p className="mt-2">Il vous sera par la suite impossible d'apporter des modifications à celle-ci.</p>
                        </div>
                        <menu>
                            <div className="flex justify-center mt-12 mr-3 ml-3">
                                <button className="w-full text-sm text-white  hover:bg-sky-700 rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                                <button className="w-full text-white text-sm  hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={handleCloture}>Clôturer</button>
                            </div>
                        </menu>
                    </form>
                </dialog>
                <div className="flex justify-center m-9">
                    <h3 className="text-lg text-white">Clôture de la visite</h3>
                </div>
                <div className="mt-9">
                    <DatePickerCloture clotureDate={clotureDate} setClotureDate={setClotureDate}/>
                </div>
                <div className="mt-9">
                    <CommentaireVisite updateComm={updateComm}/>
                </div>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/signatures"}}>Signatures</button>
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => document.getElementById('clotureDialog').showModal()}>Clôturer</button>
                </div>
            </div>
        )
    }
}

const DatePickerCloture = ({clotureDate, setClotureDate}) => {
    return (
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="datepickervisite" className="block mb-2 text-sm font-medium text-white">Fin de la visite *</label>
            <DatePicker name="datepickervisite" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" dateFormat="dd/MM/yyyy HH:mm:ss" locale="fr" selected={clotureDate} onChange={(date) => setClotureDate(date)}/>
        </div>
    );
};

const CommentaireVisite = ({updateComm}) => {
    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="commentaire" className="block mb-2 text-sm font-medium text-white">Mot du gestionnaire *</label>
            <textarea id="commentaire" rows="4" className="block p-2.5 w-full text-sm rounded-lg bg-gray-700  placeholder-gray-400 text-white " placeholder="mot du gestionnaire" onBlur={(objt) => updateComm(objt.target.value)}></textarea>
        </div>
    )
}