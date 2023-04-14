import { getOneVisite } from '../../services/api/visiteApi';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import Loader from '../tools/loader';
import { addSignature } from '../../services/api/visiteApi';
import SignatureCanvas from 'react-signature-canvas';
import { NotifyToaster } from '../tools/notifyToast';
import { useRef } from 'react';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';
import { setAuthSignature } from "../../store/visiteSlice.jsx";

export default function ListeSignature(){

    const [listePersonne, setListePersonne] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personneSelected, setPersonneSelected] = useState(null);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const authSignature = useSelector((visite) => visite.visite.visite.authSignature);
    const userInfo = useSelector((user) => user.token.user);
    const signatureDialog = useRef('');
   
    useEffect(() => {
        //Récupère les data de la visite, dont les participants
        getOneVisite(idVisite).then((response) => {
            setListePersonne(response.data.data.personnes)
            //On format les data du gestionnaire connecté pour pouvoir l'ajouter à la liste des participants
            let gestionnaire = {
                "nom": userInfo.name,
                "details": {
                    "code_personne": "AuthPersonne"
                },
                "signature": authSignature
            }
            //Ajoute le gestionnaire connecté à la liste des personnes afin qu'il puisse signer
            setListePersonne(personnes => [...personnes, gestionnaire]);
            setLoading(false);
        })
    },[]);

    //Ouvre la modal de dialogue lors de la clôture
    function openAlert(pers){
        let persSelect = { "code":pers.details !== null ? pers.details.code_personne: pers.nom, "nom": pers.nom }; 
        setPersonneSelected(persSelect);
        signatureDialog.current.showModal();
    }

    if(loading){return(<Loader/>)}

    return(
        <div>
            <SignaturePad idVisite={idVisite} signatureDialog={signatureDialog} listePersonne={listePersonne} setListePersonne={setListePersonne} personneSelected={personneSelected} setLoading={setLoading}/>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-[color:var(--text-color)]">Signature</h3>
            </div>
            {listePersonne.map((pers, index) => 
                <div key={index} className="flex justify-center mr-5 ml-5 mt-4" >
                    <button className={pers.signature ? "w-full text-[color:var(--text-color)] bg-gray-600 rounded-md py-2 px-4":"w-full text-[color:var(--text-color)] bg-orange-600 rounded-md py-2 px-4"} onClick={() => openAlert(pers)} disabled={ pers.signature ? true:false}>{pers.nom}</button>
                </div>
            )}
            <div className="flex justify-center mt-12 mr-3 ml-3">
                <button className="w-full text-[color:var(--text-color)] bg-sky-600 hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/recap"}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Récapitulatif</button>
                <button className="w-full text-[color:var(--text-color)] bg-sky-600 hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/cloture"}}>Clôture<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

//Bloc de signature utilisant la librairie react-signature-canvas
const SignaturePad = ({idVisite, signatureDialog, listePersonne, personneSelected, setLoading}) => {

    //Objet signature
    const sigPad = useRef('');
    const dispatch = useDispatch();

    //Récupère la signature, formatage et envoi à l'API
    async function handleAddSignature(){

        setLoading(true);

        //Si la personne a signer on set à true le champ signature pour l'empêcher de modifier sa signature par la suite
        listePersonne.map(pers => (pers.nom === personneSelected.nom ? pers.signature = true:''));

        if(personneSelected.code === "AuthPersonne") dispatch(setAuthSignature(setAuthSignature(true)));

        //Récupération de la signature et formatage des datas 
        let signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
        let signature = [{
            "personne": personneSelected.code,
            "signature": signatureImage
        }]

       //Appel API pour ajouter la signature 
       addSignature(idVisite,signature).then((response) => {
            NotifyToaster(response.data.message,'info');
            setLoading(false);
        })
    }

    //Efface la signature du bloc
    function handleClearSignature(){
        sigPad.current.clear()
    }

    return(
        <div>
            <dialog ref={signatureDialog} onClose={handleClearSignature} id="signatureDialog" className="bg-gray-800">
                <form method="dialog">
                    <div className="flex justify-center">
                        <div>
                            <div>
                                <div className="flex justify-center m-2">
                                    <SignatureCanvas penColor='green'canvasProps={{width: 300, height: 500, className: 'sigCanvas border border-gray-300 bg-gray-700'}} ref={(ref) => { sigPad.current = ref }}/>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <button type="reset" className="text-[color:var(--text-color)] bg-sky-600 rounded-md py-2 px-6 hover:bg-[color:var(--button-color)] m-1" onClick={handleClearSignature}>Effacer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <menu>
                        <div className="flex justify-center mt-12 mr-3 ml-3">
                            <button className="w-full text-[color:var(--text-button-color)]  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                            <button className="w-full text-[color:var(--text-button-color)]  hover:bg-[color:var(--button-color)] rounded-md py-2 px-4 m-1" onClick={handleAddSignature}>Valider</button>
                        </div>
                    </menu>
                </form>
            </dialog>
        </div>
    )
}