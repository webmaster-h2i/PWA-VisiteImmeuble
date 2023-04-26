import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSecteurs, getComposants, addElement, addPhoto, deletePhoto, getOneElement } from '../../services/api/visiteApi';
import { setElements, setPhotos } from '../../store/visiteSlice.jsx';
import { useParams } from 'react-router-dom';
import { ReactComponent as Cross } from '../../assets/icons/cross.svg';
import { ReactComponent as CloudUp } from '../../assets/icons/cloudUp.svg';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import { ReactComponent as ArrowLeft} from '../../assets/icons/arrowLeft.svg';
import { ReactComponent as Plus} from '../../assets/icons/plus.svg';
import { NotifyToaster } from '../tools/notifyToast';
import Loader from '../tools/loader';
import Breadcrumb from '../tools/breadcrumb';
import ErrorMessage from '../tools/errorMessage';


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
    const [loading, setLoading] = useState(true);
    const [errorsForm, setErrorsForm] = useState([]);
    const dispatch = useDispatch();
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
        setLoading(false);
    },[])

    //Récupère et formate l'élément et les photos et fait le call API
    async function handleCreateElement(){

        let errors = ErrorMessage([selectedSecteur,selectedComposant,commentaire]);

        if(errors.some(el => el !== "")){
            setErrorsForm(errors);
            return;
        }

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
        setLoading(true);

        await addElement(idVisite,element).then((response) => {

            if(photosB64.length > 0) addPhoto(idVisite,photos);
            if(!secteurParam && !composantParam) clearFields(); 
            NotifyToaster(response.data.message, 'success');
            setLoading(false);
        })
    }

    //Permet de vider les champs de formulaire après l'ajout d'un élément
    function clearFields(){
        setCheckConforme('Non');
        setCheckOs('Non');
        setCommentaire('');
        setSelectedSecteur('');
        setSelectedComposant('');
        setListPhoto([])
        setErrorsForm([]);
    }

    if(loading){return(<Loader/>)}

    return(
        <div>
            <div className="flex ml-8 mt-8">
                <h1 className="text-4xl text-[color:var(--first-text-color)]">Visite d'immeuble</h1>
            </div>
            <div>
                <Breadcrumb/>
            </div>
            <div className="mt-8">
                <SelectSecteurs listSecteurs={listSecteurs} setListSecteurs={setListSecteurs} setSelectedSecteur={setSelectedSecteur} selectedSecteur={selectedSecteur} errorsForm={errorsForm}/>
            </div>
            <div className="mt-8">
                <SelectComposants listComposants={listComposants} setListComposants={setListComposants} setSelectedComposant={setSelectedComposant} selectedSecteur={selectedSecteur} selectedComposant={selectedComposant} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <CheckBoxes checkConforme={checkConforme} setCheckConforme={setCheckConforme} checkOs={checkOs} setCheckOs={setCheckOs}/>
            </div>
            <div className="mt-8">
                <Commentaire commentaire={commentaire} setCommentaire={setCommentaire} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <UploadPhoto listPhoto={listPhoto} setListPhoto={setListPhoto} selectedSecteur={selectedSecteur} selectedComposant={selectedComposant} idVisite={idVisite}/>
            </div>
            <div className="w-full mt-5 p-3">
                <button className='w-full inline-flex justify-center text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] rounded py-3 px-4 hover:bg-[color:var(--button-hover-color)]' onClick={handleCreateElement}>
                    <Plus/> <span className="ml-2">{secteurParam && composantParam ? "Modifier":"Ajouter"}</span>
                </button>
            </div>
            <div className="flex justify-center mt-10 mr-3 ml-3 space-x-6 mb-9">
                <button className="w-full text-[color:var(--first-button-color)] bg-[color:var(--second-button-color)] border-[color:var(--border-button)] border rounded-md py-2 px-4" onClick={() => {window.location.href="/info/"+idVisite}}><i><ArrowLeft className="w-5 inline mr-1 mb-1"/></i>Info. générale</button>
                <button className="w-full text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] hover:bg-[color:var(--button-hover-color)] rounded-md py-2 px-4 shadow-2xl" onClick={() => {window.location.href="/recap"}}>Récapitulatif<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

const SelectSecteurs = ({listSecteurs, setListSecteurs, setSelectedSecteur, selectedSecteur, errorsForm}) => {

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
            <label htmlFor="Secteur" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Parties communes*</label>
            <select value={selectedSecteur} onChange={handleSelect} id="Secteur" className={`border text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[0] ?"border-red-500":""}`}>
                <option defaultValue></option>
                {listSecteurs.map(secteur => <option className="text-sm" value={secteur.id} key={secteur.id}>{secteur.nom}</option>)}
            </select>
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[0]}</p>
        </div>
    )
}

const SelectComposants = ({listComposants, setListComposants, setSelectedComposant, selectedSecteur, selectedComposant, errorsForm}) => {

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
            <label htmlFor="composants" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Composant*</label>
            <select value={selectedComposant} onChange={handleSelect} id="composants" className={`border text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[1] ?"border-red-500":""}`}>
                <option defaultValue></option>
                { selectedSecteur ? listComposants.map(composant => <option className="text-sm" value={composant.id} key={composant.id}>{composant.nom}</option>): ''}
            </select>
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[1]}</p>
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
                <div className="w-10 h-5 rounded-full bg-[color:var(--second-toggle-color)] peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-[color:var(--first-toggle-color)]"></div>
                <span className="ml-3 text-sm font-medium text-[color:var(--first-text-color)]">Conforme: {checkConforme}</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer ml-5">
                <input checked={checkedOs} onChange={(os) => os.target.checked ? setCheckOs('Oui'):setCheckOs('Non')} type="checkbox" value="" className="sr-only peer" />
                <div className="w-10 h-5 rounded-full bg-[color:var(--second-toggle-color)] peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-[color:var(--first-toggle-color)]"></div>
                <span className="ml-3 text-sm font-medium text-[color:var(--first-text-color)]">Intervention: {checkOs}</span>
            </label>
        </div>
    )
}

const Commentaire = ({commentaire, setCommentaire, errorsForm}) => {
    return(
        <div className="mt-7 mr-3 ml-3 mb-3">
            <label htmlFor="commentaire" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Commentaire*</label>
            <textarea value={commentaire} id="commentaire" rows="3" className={`block border p-2.5 w-full text-sm rounded-lg bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[2] ?"border-red-500":""}`} placeholder="Commentaire" onChange={(com) => setCommentaire(com.target.value)}></textarea>
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[2]}</p>
        </div>
    )
}

const UploadPhoto = ({listPhoto, setListPhoto, idVisite}) => {

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

    
    return(
        <div>
            <div>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center ml-3 mr-3 justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-[color:var(--input-color)]">
                        <div className="flex flex-col items-center justify-center">
                            <CloudUp className="w-9 text-[color:var(--first-button-color)]"/>
                            <p className="mb-2 text-sm text-gray-400">Ajouter une photo</p>
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