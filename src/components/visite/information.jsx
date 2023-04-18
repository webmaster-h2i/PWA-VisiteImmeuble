import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import { fr } from 'date-fns/locale';
import CreatableSelect from 'react-select/creatable';
import { getPersonnes, addVisite, getOneVisite, updateVisite } from '../../services/api/visiteApi';
import { getImmeubles } from '../../services/api/immeubleApi';
import { useSelector, useDispatch } from 'react-redux';
import { setIdVisite, setinfoGenerales, setVisite, setAuthSignature, setImmeuble} from "../../store/visiteSlice.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { NotifyToaster } from '../tools/notifyToast';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import moment from "moment";
import Breadcrumb from '../tools/breadcrumb';
registerLocale('fr', fr)

export default function InfoGenerale(){

    const [participants, setparticipants] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [contractuelle, setContractuelle] = useState('Non');
    const [objetVisite, setObjetVisite] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let {visiteIdParam} = useParams();

    useEffect(() => {
        getPersonnes().then((response) => {
            //Récupère la liste des utilisateurs
            response.data.data.map(
                (personne) => setparticipants(participants =>[...participants,{value: personne.code_personne, label: personne.nom + ' ' +personne.prenom}])
            )
            //Si c'est une modification alors on récupère les data de la visite
            if(visiteIdParam){
                getVisiteToUpdate();
            }
        })
    }, []);

    //Récupère les data de la visite à modifier et les ajoute au formulaire et au state de visite global
    async function getVisiteToUpdate(){
        //Call API pour récupérer les informations de la visite
        await getOneVisite(visiteIdParam).then((response) =>{
            
            //Modifie les states du composant pour afficher les data de la visite dans le formulaire
            response.data.data.personnes.map((parti) => 
                setSelectedOption(selectedOption =>[...selectedOption,{value: parti.details ? parti.details.code_personne: parti.nom, label: parti.nom}])
            );
            setObjetVisite(response.data.data.objet);
            response.data.data.type === 'Contractuelle' ? setContractuelle('Oui'):setContractuelle('Non');
            setStartDate(moment(response.data.data.date_creation, "DD/MM/YYYY HH:mm").toDate());

            //Set les infos de la visite à modifier dans le state visite global
            dispatch(setVisite({
                "immeuble":response.data.data.immeuble.code_immeuble,
                "idVisite": visiteIdParam,
                "elements": response.data.data.elements,
                "photos": [],
                "info": formatObjectInfo(),
                "authSignature": null
            }))    
        });
    }

    const immeuble = useSelector((visite) => visite.visite.visite.immeuble);

    function formatObjectInfo(){

        //Création d'un tableau avec la liste des participants, si il est inscrit on ajoute son code, si il n'est pas inscrit on ajoute son nom
        let participantsVisite = [];
        selectedOption.map(participant => participantsVisite.push(participant.value));

        //Création de l'objet visite qui va être envoyé à l'API
        let info = [{
            "code_immeuble": immeuble,
            "date_creation": moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
            "type": contractuelle === 'Oui' ? "Contractuelle" : "Ponctuelle",
            "objet": objetVisite,
            "participants": participantsVisite,
        }];

        return info;
    }

    function handleCreateVisite(){

        let visite = formatObjectInfo();

        //On reset la signature du gestionnaire authentifié 
        dispatch(setAuthSignature(null));

        //Si l'id de la visite est présent en paramètre alors on modifie la visite sinon on la créé
        if(visiteIdParam){
            updateVisite(visiteIdParam,visite).then((response) => {
                NotifyToaster(response.data.message, 'info');
                dispatch(setinfoGenerales(visite));
                navigate("/element");
            })
        }else{
            addVisite(visite).then((response) => {
                NotifyToaster(response.data.message, 'info');
                dispatch(setIdVisite(response.data.data.id));
                dispatch(setinfoGenerales(visite));
                navigate("/element");
            })
        }
    }

    return(
        <div>
            <div className="flex ml-3 mt-8">
                <h1 className="text-4xl text-[color:var(--first-text-color)]">Visite d'immeuble</h1>
            </div>
            <div>
                <Breadcrumb/>
            </div>
            <div className="mt-9">
                <SelectImmeuble/>
            </div>
            <div className="mt-9">
                <DatePickerVisite startDate={startDate} setStartDate={setStartDate}/>
            </div>
            <div className="mt-9">
                <ObjetVisite setObjetVisite={setObjetVisite} objetVisite={objetVisite}/>
            </div>
            <div className="mt-9">
                <Contractuelle setContractuelle={setContractuelle} contractuelle={contractuelle}/>
            </div>
            <div className="mt-9">
                <PersonnesVisite setSelectedOption={setSelectedOption} participants={participants} selectedOption={selectedOption}/>
            </div>
            <div className="flex justify-between mx-auto m-9 p-4">
                <button className="text-[color:var(--first-button-color)] bg-[color:var(--second-button-color)] rounded-md py-2 px-4 border border-[color:var(--border-button)]" onClick={() => {window.location.href="/"}}>Annuler</button>
                <button className="text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] hover:bg-[color:var(--button-hover-color)] rounded-md py-2 px-4 shadow-2xl" onClick={handleCreateVisite}>Suivant<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

// Affiche la modale qui permet de sélectionner un immeuble lors du début de la visite 
const SelectImmeuble = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedImmeuble, setSelectedImmeuble] = useState(null);
    const [listImmeubles, setListImmeubles] = useState([]);

    //Call Api pour récupérer la liste des immeubles
    useEffect(() => {
        getImmeubles().then((response) => {
            setListImmeubles(response.data.data);
        })
    }, []);

    // Modifie le state locale et globale avec l'immeuble sélectionné 
    const handleSelect = (e) => {
        e.preventDefault();
        dispatch(setImmeuble(e.target.value));
        setSelectedImmeuble(e.target.value);
    }

    return(
      <div className="m-3">
        <label htmlFor="immeubles" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Selectionner un immeuble</label>
        <select id="immeubles" onChange={handleSelect} className="w-full border text-sm rounded-lg p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]">
            <option defaultValue></option>
            {listImmeubles.map(immeuble => <option className="text-lg" value={immeuble.code_immeuble} key={immeuble.code_immeuble}>{immeuble.code_immeuble} - {immeuble.nom}</option>)}
        </select>
      </div>
    )
}

const DatePickerVisite = ({startDate, setStartDate}) => {
    return (
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="datepickervisite" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Début de la visite *</label>
            <DatePicker name="datepickervisite" className="border text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]" dateFormat="dd/MM/yyyy HH:mm" locale="fr" selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
    );
};

const ObjetVisite = ({setObjetVisite, objetVisite}) => {
    return(
        <div className="m-3">
            <label htmlFor="objetvisite" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Objet de la visite *</label>
            <textarea id="objetvisite" rows="4" className="block p-2.5 w-full text-sm rounded-lg bg-[color:var(--input-color)] border border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]" placeholder="visite contractuelle" onChange={(objt) => setObjetVisite(objt.target.value)} defaultValue={objetVisite}></textarea>
        </div>
    )
}

const Contractuelle = ({setContractuelle, contractuelle}) => {

    let checked = contractuelle === 'Non' ? false: true;
    return(
        <div className="m-3">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={(contr) => contr.target.checked ? setContractuelle('Oui'):setContractuelle('Non')}/>
                <div className="w-10 h-5 rounded-full bg-[color:var(--second-toggle-color)] peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-[color:var(--first-toggle-color)]"></div>
                <span className="ml-3 text-sm font-medium text-[color:var(--first-text-color)]">Visite contractuelle: {contractuelle}</span>
            </label>
        </div>
    )
}
  
const PersonnesVisite = ({setSelectedOption, participants, selectedOption}) => {
   
    if(selectedOption.length >= 0){
        return(
            <div className="m-3">
                <label htmlFor="selectpersonnes" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Participants *</label>
                <CreatableSelect
                    name="selectpersonnes"
                    styles={{
                        control: (baseStyles) => ({
                        ...baseStyles,
                        boxShadow: "none", 
                        border: "none",
                        backgroundColor: "none",
                        borderWidth: "0px"
                        }),
                        container: (baseStyles) => ({
                            ...baseStyles,
                        }),
                        valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            border: "none"
                        }),
                        input: (baseStyles) => ({
                            ...baseStyles,
                            color: "white"
                        }),
                        multiValue: (baseStyles) => ({
                            ...baseStyles,
                            color: "white"
                        }),
                    }}
                    classNames={{
                        valueContainer: () => 'rounded-lg bg-[color:var(--input-color)] border-[color:var(--input-border-color)]',
                        group: () => 'bg-[color:var(--input-color)]',
                        dropdownIndicator: () => 'bg-[color:var(--input-color)]',
                        container: () => 'bg-[color:var(--input-color)] rounded-lg p-1 border border-[color:var(--input-border-color)] text-sm',
                        indicatorsContainer: () => 'bg-[color:var(--input-color)]',
                    }}
                    isMulti
                    value={selectedOption}
                    onChange={setSelectedOption}
                    options={participants}
                    placeholder={"Participants"}
                    formatCreateLabel={userInput => `Ajouter : ${userInput}`}
                />
            </div>
        )
    }
}