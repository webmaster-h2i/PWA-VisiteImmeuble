import SignatureCanvas from 'react-signature-canvas'
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addSignature } from '../../services/api/visiteApi';
import { useNavigate } from 'react-router-dom';

export default function Signature(){

    const sigPad = useRef('');
    let { nomPersonne } = useParams();
    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const navigate = useNavigate();

    function handleAddSignature(){

        let signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
        let signature = [{
            "personne": nomPersonne,
            "signature": signatureImage
        }]

        addSignature(idVisite,signature).then((response) => {
        }).then(
            navigate('/signatures')
        )
    }

    function handleClearSignature(){
        sigPad.current.clear()
    }

    return(
        <div>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-white">Signature</h3>
            </div>
            <div>
                <div className="flex justify-center">
                    <SignatureCanvas penColor='green'canvasProps={{width: 300, height: 300, className: 'sigCanvas border border-gray-300 bg-gray-700'}} ref={(ref) => { sigPad.current = ref }}/>
                </div>
            </div>
            <div>
                <div className="flex justify-center mt-12 mr-3 ml-3">
                    <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-blue-600 m-1" onClick={handleClearSignature}>Effacer</button>
                    <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-blue-600 m-1" onClick={handleAddSignature}>Valider</button>
                </div>
            </div>
        </div>
    )
}