import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSecteurs, getComposants, addElement, addPhoto } from '../../services/api/visiteApi';
import { setElements, setPhotos } from '../../store/visiteSlice.jsx';
import { useNavigate } from 'react-router-dom';

export default function Element(){

    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const [checkConforme, setCheckConforme] = useState('Non');
    const [checkOs, setCheckOs] = useState('Non');
    const [commentaire, setCommentaire] = useState('');
    const [listSecteurs, setListSecteurs] = useState([]);
    const [selectedSecteur, setSelectedSecteur] = useState(null);
    const [listComposants, setListComposants] = useState([]);
    const [selectedComposant, setSelectedComposant] = useState(null);
    const [listPhoto, setListPhoto] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleCreateElement(){

        let element = [{
            "secteur_id": selectedSecteur,
            "composant_id": selectedComposant,
            "etat": checkConforme !== 'Non' ? true:false,
            "os_a_planifier": checkOs !== 'Non' ? true:false,
            "commentaire": commentaire
        }]

        let photos = [{
            "secteur_id": selectedSecteur,
            "composant_id": selectedComposant,
            "image": listPhoto
        }]

        dispatch(setElements(element));
        dispatch(setPhotos(photos));

        addElement(idVisite,element).then((response) => {
            if(response.status === 200 || response.status === 201){
                addPhoto(idVisite,photos)
            } 
        }).then(
            navigate('/recap')
        )
    }

    return(
        <div>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-white">Ajouter un élément</h3>
            </div>
            <div className="mt-9">
                <SelectSecteurs listSecteurs={listSecteurs} setListSecteurs={setListSecteurs} setSelectedSecteur={setSelectedSecteur}/>
            </div>
            <div className="mt-9">
                <SelectComposants listComposants={listComposants} setListComposants={setListComposants} setSelectedComposant={setSelectedComposant} selectedSecteur={selectedSecteur}/>
            </div>
            <div className="mt-9">
                <CheckBoxes checkConforme={checkConforme} setCheckConforme={setCheckConforme} checkOs={checkOs} setCheckOs={setCheckOs}/>
            </div>
            <div className="mt-9">
                <Commentaire commentaire={commentaire} setCommentaire={setCommentaire}/>
            </div>
            <div className="mt-9">
                <UploadPhoto listPhoto={listPhoto} setListPhoto={setListPhoto} selectedSecteur={selectedSecteur} selectedComposant={selectedComposant}/>
            </div>
            <div className="flex justify-center mt-12 mr-3 ml-3">
                <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-blue-600" onClick={handleCreateElement}>Créer l'élément</button>
            </div>
        </div>
    )
}

const SelectSecteurs = ({listSecteurs, setListSecteurs, setSelectedSecteur}) => {

    useEffect(() => {
        getSecteurs().then((response) => {
            setListSecteurs(response.data.data);
        })
    }, [setListSecteurs]);

    const handleSelect = (e) => {
        e.preventDefault();
        setSelectedSecteur(e.target.value);
    }

    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="Secteur" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Parties communes</label>
            <select onChange={handleSelect} id="Secteur" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option defaultValue></option>
                {listSecteurs.map(secteur => <option className="text-lg" value={secteur.id} key={secteur.id}>{secteur.nom}</option>)}
            </select>
        </div>
    )
}

const SelectComposants = ({listComposants, setListComposants, setSelectedComposant, selectedSecteur}) => {

    useEffect(() => {
        getComposants().then((response) => {
            setListComposants(response.data.data);
        })
    }, [setListComposants]);

    const handleSelect = (e) => {
        e.preventDefault();
        setSelectedComposant(e.target.value);
    }

    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="composants" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Composant</label>
            <select onChange={handleSelect} id="composants" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option defaultValue></option>
                { selectedSecteur ? listComposants.map(composant => <option className="text-lg" value={composant.id} key={composant.id}>{composant.nom}</option>): ''}
            </select>
        </div>
    )
}

const CheckBoxes = ({checkConforme,setCheckConforme,checkOs,setCheckOs}) => {
    return(
        <div className="m-3">
            <label className="relative inline-flex items-center cursor-pointer">
            <input onChange={(conf) => conf.target.checked ? setCheckConforme('Oui'):setCheckConforme('Non')} type="checkbox" value="" className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Conforme: {checkConforme}</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer ml-5">
            <input onChange={(os) => os.target.checked ? setCheckOs('Oui'):setCheckOs('Non')} type="checkbox" value="" className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Nécessite OS: {checkOs}</span>
            </label>
        </div>
    )
}

const Commentaire = ({setCommentaire}) => {
    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="commentaire" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Commentaire</label>
            <textarea id="commentaire" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Commentaire" onChange={(com) => setCommentaire(com.target.value)}></textarea>
        </div>
    )
}

const UploadPhoto = ({listPhoto, setListPhoto, selectedSecteur, selectedComposant}) => {

    function handleFileUpload(file){

        //Converti la photo en fichier base64
        let reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = () => {
            let bs64 = reader.result;
            setListPhoto(photos =>[...photos, bs64]);
        };
    }

    if(selectedSecteur && selectedComposant){
        return(
            <div className="mt-9 mr-3 ml-3 mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Ajouter une photo</label>
                <input onChange={(file) => handleFileUpload(file.target.files)} className="block w-full text-sm text-white border border-gray-500 rounded-lg cursor-pointer bg-gray-500" id="file_input" type="file"/>
            </div>
        )
    }
}