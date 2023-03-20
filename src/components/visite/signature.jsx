import { getOneVisite } from '../../services/api/visiteApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Loader from '../loader';
import { addSignature, deleteSignature } from '../../services/api/visiteApi';
import SignatureCanvas from 'react-signature-canvas';
import { NotifyToaster } from '../../components/notifyToast';
import { useRef } from 'react';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';

export default function ListeSignature(){

    const [listePersonne, setListePersonne] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personneSelected, setPersonneSelected] = useState(null);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const userInfo = useSelector((user) => user.token.user);
    const signatureDialog = useRef('');
   
    useEffect(() => {
        //Récupère les data de la visite, dont les participants
        getOneVisite(idVisite).then((response) => {
            setListePersonne(response.data.data.personnes)
            setLoading(false)
        })
    },[idVisite]);

    //Ouvre la modal de dialogue lors de la clôture
    function openAlert(pers){
        let persSelect = { "code":pers.details !== null ? pers.details.code_personne: pers.nom, "signature":pers.signature}; 
        setPersonneSelected(persSelect);
        signatureDialog.current.showModal();
    }

    if(loading){
        return(<Loader/>)
    }else{
        return(
            <div>
                <SignaturePad idVisite={idVisite} signatureDialog={signatureDialog} personneSelected={personneSelected} setLoading={setLoading}/>
                <div className="flex justify-center m-9">
                    <h3 className="text-lg text-white">Signature</h3>
                </div>
                {listePersonne.map((pers, index) => 
                    <div key={index} className="flex justify-center mr-5 ml-5 mt-4">
                        <button className={"w-full text-white bg-orange-600 rounded-md py-2 px-4"} onClick={() => openAlert(pers)}>{pers.nom}</button>
                    </div>
                )}
                <div className="flex justify-center mr-5 ml-5 mt-4">
                    <button className="w-full text-white bg-orange-600 rounded-md py-2 px-4" onClick={() => openAlert({'nom': 'AuthPersonne', 'details': null})}>{userInfo.name}</button>
                </div>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/recap"}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Récapitulatif</button>
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/cloture"}}>Clôture<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
                </div>
            </div>
        )
    }
}

//Bloc de signature utilisant la librairie react-signature-canvas
const SignaturePad = ({idVisite, signatureDialog, personneSelected, setLoading}) => {

    //Objet signature
    const sigPad = useRef('');

    //Récupère la signature, formatage et envoi à l'API
    async function handleAddSignature(){

        setLoading(true);
        let signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
        let signature = [{
            "personne": personneSelected.code,
            "signature": signatureImage
        }]

        if(personneSelected.signature || personneSelected.code === 'AuthPersonne'){
           await deleteSignature(idVisite, [{"personne": personneSelected.code}])
        }
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
                                    <button type="reset" className="text-white bg-sky-600 rounded-md py-2 px-6 hover:bg-sky-700 m-1" onClick={handleClearSignature}>Effacer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <menu>
                        <div className="flex justify-center mt-12 mr-3 ml-3">
                            <button className="w-full text-white  hover:bg-sky-700 rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                            <button className="w-full text-white  hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={handleAddSignature}>Valider</button>
                        </div>
                    </menu>
                </form>
            </dialog>
        </div>
    )
}