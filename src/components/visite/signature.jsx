import { getOneVisite } from '../../services/api/visiteApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Loader from '../loader';
import { addSignature } from '../../services/api/visiteApi';
import SignatureCanvas from 'react-signature-canvas'
import { useRef } from 'react';

export default function ListeSignature(){

    const [listePersonne, setListePersonne] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personneSelected, setPersonneSelected] = useState(null);
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const userInfo = useSelector((user) => user.token.user);
    const signatureDialog = useRef('');
   
    useEffect(() => {
        getOneVisite(idVisite).then((response) => {
            let persList = [];
            response.data.data.personnes.map((pers) => persList.push({...pers, "done": false}));
            setListePersonne(persList)
            setLoading(false)
        })

        console.log(listePersonne)
    },[]);

    //Ouvre la modal de dialogue lors de la clôture
    function openAlert(pers){
        let persSelect = pers.details !== null ? pers.details.code_personne: pers.nom; 
        setPersonneSelected(persSelect);
        signatureDialog.current.showModal();
    }

    if(loading){
        return(<Loader/>)
    }else{
        return(
            <div>
                <SignaturePad idVisite={idVisite} signatureDialog={signatureDialog} personneSelected={personneSelected}/>
                <div className="flex justify-center m-9">
                    <h3 className="text-lg text-white">Signature</h3>
                </div>
                {listePersonne.map((pers, index) =>
                    <div key={index} className="flex justify-center mr-5 ml-5 mt-4">
                        <button className="w-full text-white bg-orange-600 rounded-md py-2 px-4" onClick={() => openAlert(pers)}>{pers.nom}</button>
                    </div>
                )}
                <div className="flex justify-center mr-5 ml-5 mt-4">
                    <button className="w-full text-white bg-orange-600 rounded-md py-2 px-4" onClick={() => openAlert({'nom': 'AuthPersonne', 'details': null})}>{userInfo.name}</button>
                </div>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/recap"}}>Récapitulatif</button>
                    <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/cloture"}}>Clôture</button>
                </div>
            </div>
        )
    }
}

const SignaturePad = ({idVisite, signatureDialog, personneSelected}) => {

    const sigPad = useRef('');

    function handleAddSignature(){

        let signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
        let signature = [{
            "personne": personneSelected,
            "signature": signatureImage
        }]

        addSignature(idVisite,signature).then((response) => {
            console.log(response);
        })
    }

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