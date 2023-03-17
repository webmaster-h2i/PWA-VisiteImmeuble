import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSecteurs, getComposants, addElement, addPhoto, deletePhoto, getOneElement } from '../../services/api/visiteApi';
import { setElements, setPhotos } from '../../store/visiteSlice.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as Cross } from '../../assets/icons/cross.svg';
import { ReactComponent as CloudUp } from '../../assets/icons/cloudUp.svg';

export default function Element(){

    const idVisite = useSelector((visite) => visite.visite.visite.idVisite);
    const [checkConforme, setCheckConforme] = useState('Non');
    const [checkOs, setCheckOs] = useState('Non');
    const [commentaire, setCommentaire] = useState('');
    const [listSecteurs, setListSecteurs] = useState([]);
    const [selectedSecteur, setSelectedSecteur] = useState('');
    const [listComposants, setListComposants] = useState([]);
    const [selectedComposant, setSelectedComposant] = useState('');
    const [listPhoto, setListPhoto] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let {secteurParam} = useParams();
    let {composantParam} = useParams();
    const isOnUpdate = (secteurParam && composantParam) ? true:false;

    useEffect(()=>{
        if(isOnUpdate){
            getOneElement(idVisite, secteurParam, composantParam).then((response) => {
                setSelectedSecteur(secteurParam);
                setSelectedComposant(composantParam);
                setCommentaire(response.data.data.commentaire);
                setCheckConforme(response.data.data.etat !== 1 ? 'Non':'Oui');
                setCheckOs(response.data.data.os_a_planifier !== 1 ? 'Non':'Oui');
                setListPhoto(response.data.data.photos)
            })
        }
    },[])

    //Récupère et formate l'élément et les photos et fait le call API
    function handleCreateElement(){

        let element = [{
            "secteur_id": selectedSecteur,
            "composant_id": selectedComposant,
            "etat": checkConforme !== 'Non' ? true:false,
            "os_a_planifier": checkOs !== 'Non' ? true:false,
            "commentaire": commentaire
        }]

        let photosB64 = [];
        
        listPhoto.map((photo) => !photo.id ? photosB64.push(photo.image):'');

        let photos = [{
            "secteur_id": selectedSecteur,
            "composant_id": selectedComposant,
            "image": photosB64
        }]

        dispatch(setElements(element));
        dispatch(setPhotos(photos));

        addElement(idVisite,element).then((response) => {
            if(response.status === 200 || response.status === 201){
                photosB64.length > 0 ? addPhoto(idVisite,photos).then(navigate('/recap')):navigate('/recap');    
            } 
        })
    }

    return(
        <div>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-white">Ajouter un élément</h3>
            </div>
            <div className="mt-8">
                <SelectSecteurs listSecteurs={listSecteurs} setListSecteurs={setListSecteurs} setSelectedSecteur={setSelectedSecteur} selectedSecteur={selectedSecteur}/>
            </div>
            <div className="mt-8">
                <SelectComposants listComposants={listComposants} setListComposants={setListComposants} setSelectedComposant={setSelectedComposant} selectedSecteur={selectedSecteur} selectedComposant={selectedComposant}/>
            </div>
            <div className="mt-9">
                <CheckBoxes checkConforme={checkConforme} setCheckConforme={setCheckConforme} checkOs={checkOs} setCheckOs={setCheckOs}/>
            </div>
            <div className="mt-8">
                <Commentaire commentaire={commentaire} setCommentaire={setCommentaire}/>
            </div>
            <div className="mt-7">
                <UploadPhoto listPhoto={listPhoto} setListPhoto={setListPhoto} selectedSecteur={selectedSecteur} selectedComposant={selectedComposant} isOnUpdate={isOnUpdate} idVisite={idVisite}/>
            </div>
            <div className="flex justify-center mt-7 mr-2 ml-2 mb-5">
                <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={handleCreateElement}>{secteurParam && composantParam ? "Modifier":"Créer"}</button>
                <button className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={() => {window.location.href="/recap"}}>Récapitulatif</button>
            </div>
        </div>
    )
}

const SelectSecteurs = ({listSecteurs, setListSecteurs, setSelectedSecteur, selectedSecteur}) => {

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
            <select value={selectedSecteur} onChange={handleSelect} id="Secteur" className="border text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                <option defaultValue></option>
                {listSecteurs.map(secteur => <option className="text-lg" value={secteur.id} key={secteur.id}>{secteur.nom}</option>)}
            </select>
        </div>
    )
}

const SelectComposants = ({listComposants, setListComposants, setSelectedComposant, selectedSecteur, selectedComposant}) => {

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
            <select value={selectedComposant} onChange={handleSelect} id="composants" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-orange-600 focus:border-orange-600">
                <option defaultValue></option>
                { selectedSecteur ? listComposants.map(composant => <option className="text-lg" value={composant.id} key={composant.id}>{composant.nom}</option>): ''}
            </select>
        </div>
    )
}

const CheckBoxes = ({checkConforme,setCheckConforme,checkOs,setCheckOs}) => {

    let checkedOs = checkOs === 'Non' ? false: true;
    let checkedConforme = checkConforme === 'Non' ? false:true;

    return(
        <div className="m-3">
            <label className="relative inline-flex items-center cursor-pointer">
                <input checked={checkedConforme} onChange={(conf) => conf.target.checked ? setCheckConforme('Oui'):setCheckConforme('Non')} type="checkbox" value="" className="sr-only peer" />
                <div className="w-10 h-5 rounded-full dark:bg-gray-700 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-orange-600"></div>
                <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Conforme: {checkConforme}</span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer ml-5">
                <input checked={checkedOs} onChange={(os) => os.target.checked ? setCheckOs('Oui'):setCheckOs('Non')} type="checkbox" value="" className="sr-only peer" />
                <div className="w-10 h-5 rounded-full dark:bg-gray-700 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-orange-600"></div>
                <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Nécessite OS: {checkOs}</span>
            </label>
        </div>
    )
}

const Commentaire = ({commentaire, setCommentaire}) => {
    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="commentaire" className="block mb-2 text-sm font-medium text-white">Commentaire</label>
            <textarea value={commentaire} id="commentaire" rows="4" className="block p-2.5 w-full text-sm rounded-lg bg-gray-700 placeholder-gray-400 text-white" placeholder="Commentaire" onChange={(com) => setCommentaire(com.target.value)}></textarea>
        </div>
    )
}

const UploadPhoto = ({listPhoto, setListPhoto, selectedSecteur, selectedComposant, idVisite}) => {

    //Toutes les photos qui existent lors de la modification ont un id contrairement à celles ajoutée pendant
    //C'est ce qui permet de faire la distinction

    function handleFileUpload(file){
        //Converti la photo en fichier base64
        let reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = () => {
            let bs64 = reader.result;
            setListPhoto(photos =>[...photos,{'id': null, 'image':bs64}]);
        };
    }

    function handleFileDelete(file,idPhoto){

        let filterList = listPhoto.filter(photo => photo.image !== file);
        setListPhoto(filterList);
        if(idPhoto){
            deletePhoto(idVisite,idPhoto);
        }
    }

    if(selectedSecteur && selectedComposant){
        return(
            <div>
                <div>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col m-2 p-5 items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer  hover:bg-bray-800 bg-gray-700  border-gray-600 hover:border-gray-500 hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center">
                                <CloudUp className="w-9 text-orange-500"/>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Ajouter une photo</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={(file) => handleFileUpload(file.target.files)}/>
                        </label>
                    </div> 
                </div>
                <div className="flex flex-wrap mt-3">
                   {listPhoto.map((photo, index) => <div key={index} className="relative"><img className="max-w-10 max-h-12 m-3" src={ photo.id ? 'data:image/png;base64,'+photo.image:photo.image} alt="element"/><div className="absolute top-0 right-0" onClick={() => handleFileDelete(photo.image,photo.id)}><Cross className="w-6 text-red-500"/></div></div>)}
                </div>
            </div>
        )
    }
}