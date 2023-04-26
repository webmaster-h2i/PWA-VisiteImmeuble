import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import { fr } from 'date-fns/locale';
import CreatableSelect from 'react-select/creatable';
import { getPersonnes, addVisite, getOneVisite, updateVisite } from '../../services/api/visiteApi';
import { getImmeubles } from '../../services/api/immeubleApi';
import { useDispatch } from 'react-redux';
import { setinfoGenerales, setVisite, setImmeuble, setPersonnes} from "../../store/visiteSlice.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { NotifyToaster } from '../tools/notifyToast';
import { ReactComponent as ArrowRight} from '../../assets/icons/arrowRight.svg';
import moment from "moment";
import Breadcrumb from '../tools/breadcrumb';
import ErrorMessage from '../tools/errorMessage';
registerLocale('fr', fr)

export default function InfoGenerale(){

    const [participants, setparticipants] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [contractuelle, setContractuelle] = useState('Non');
    const [objetVisite, setObjetVisite] = useState('');
    const [selectedImmeuble, setSelectedImmeuble] = useState('');
    const [errorsForm, setErrorsForm] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //En cas de modification des informations de la visite le paramètre idVisite est ajouté à l'url 
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

    //Récupère les data de la visite à modifier et les ajoutes au formulaire et au state de visite global
    async function getVisiteToUpdate(){
        //Call API pour récupérer les informations de la visite
        await getOneVisite(visiteIdParam).then((response) =>{
            
            //Modifie les states du composant pour afficher les data de la visite dans le formulaire
            response.data.data.personnes.map((participant) => 
                setSelectedOption(selectedOption =>[...selectedOption,{value: participant.details ? participant.details.code_personne: participant.nom, label: participant.nom}])
            );
            setObjetVisite(response.data.data.objet);
            response.data.data.type === 'Contractuelle' ? setContractuelle('Oui'):setContractuelle('Non');
            setStartDate(moment(response.data.data.date_creation, "DD/MM/YYYY HH:mm").toDate());
            setSelectedImmeuble(response.data.data.immeuble);

            //Set les infos de la visite à modifier dans le state visite global
            dispatch(setVisite({
                "immeuble": response.data.data.immeuble,
                "idVisite": visiteIdParam,
                "elements": response.data.data.elements,
                "photos": [],
                "info": formatObjectInfo(),
                "authSignature": null,
                "personnes":[]
            }))    
        });
    }

    function handleCreateVisite(){

        let errors = ErrorMessage([selectedImmeuble,startDate,objetVisite,selectedOption]);

        if(errors.some(el => el !== "")){
            setErrorsForm(errors);
            return;
        }

        let info = formatObjectInfo();

        //Si l'id de la visite est présent en paramètre alors on modifie la visite sinon on la créé
        if(visiteIdParam){
            updateVisite(visiteIdParam,info).then((response) => {
                NotifyToaster(response.data.message, 'success');
                dispatch(setinfoGenerales(info));
                dispatch(setImmeuble(selectedImmeuble));
                dispatch(setPersonnes(selectedOption));
                navigate("/element");
            })
        }else{
            addVisite(info).then((response) => {
                NotifyToaster(response.data.message, 'success');
                dispatch(setVisite({
                    "immeuble": selectedImmeuble,
                    "idVisite": response.data.data.id,
                    "elements": [],
                    "photos": [],
                    "info": formatObjectInfo(),
                    "authSignature": null,
                    "personnes": selectedOption
                }))
                navigate("/element");
            })
        }
    }

    function formatObjectInfo(){

        //Création d'un tableau avec la liste des participants, si il est inscrit on ajoute son code, si il n'est pas inscrit on ajoute son nom
        let participantsVisite = [];
        selectedOption.map(participant => participantsVisite.push(participant.value));

        //Création de l'objet visite qui va être envoyé à l'API
        let info = [{
            "code_immeuble": selectedImmeuble.code_immeuble,
            "date_creation": moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
            "type": contractuelle === 'Oui' ? "Contractuelle" : "Ponctuelle",
            "objet": objetVisite,
            "participants": participantsVisite,
        }];

        return info;
    }

    return(
        <div>
            <div className="flex ml-8 mt-8">
                <h1 className="text-4xl text-[color:var(--first-text-color)]">Visite d'immeuble</h1>
            </div>
            <div>
                <Breadcrumb/>
            </div>
            <div className="mt-9">
                <SelectImmeuble selectedImmeuble={selectedImmeuble} setSelectedImmeuble={setSelectedImmeuble} visiteIdParam={visiteIdParam} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <DatePickerVisite startDate={startDate} setStartDate={setStartDate} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <ObjetVisite setObjetVisite={setObjetVisite} objetVisite={objetVisite} errorsForm={errorsForm}/>
            </div>
            <div className="mt-9">
                <Contractuelle setContractuelle={setContractuelle} contractuelle={contractuelle}/>
            </div>
            <div className="mt-9">
                <PersonnesVisite setSelectedOption={setSelectedOption} participants={participants} selectedOption={selectedOption} errorsForm={errorsForm}/>
            </div>
            <div className="flex justify-between mx-auto m-9 p-4 mt-10 mb-9">
                <button className="text-[color:var(--first-button-color)] bg-[color:var(--second-button-color)] rounded-md py-2 px-4 border border-[color:var(--border-button)]" onClick={() => {window.location.href="/"}}>Annuler</button>
                <button className="text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] hover:bg-[color:var(--button-hover-color)] rounded-md py-2 px-4 shadow-2xl" onClick={handleCreateVisite}>Suivant<i><ArrowRight className="w-5 inline ml-1 mb-1"/></i></button>
            </div>
        </div>
    )
}

// Affiche la modale qui permet de sélectionner un immeuble lors du début de la visite 
const SelectImmeuble = ({selectedImmeuble, setSelectedImmeuble, visiteIdParam, errorsForm}) => {

    const dispatch = useDispatch();
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
        let immeuble = e.target.value ? JSON.parse(e.target[e.target.selectedIndex].getAttribute('immeuble')):"";
        setSelectedImmeuble(immeuble);
        dispatch(setImmeuble(immeuble));
    }

    return(
      <div className="m-3">
        <label htmlFor="immeubles" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Selectionner un immeuble*</label>
        <select disabled={visiteIdParam ? "disabled":""} id="immeubles" value={selectedImmeuble.code_immeuble} onChange={handleSelect} className={`w-full border text-sm rounded-lg p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[0] ?"border-red-500":""}`} required={true}>
            <option defaultValue></option>
            {listImmeubles.map(immeuble => <option className="text-sm" value={immeuble.code_immeuble} immeuble={JSON.stringify(immeuble)} key={immeuble.code_immeuble}>{immeuble.code_immeuble} - {immeuble.nom}</option>)}
        </select>
        <p className='italic text-red-500 text-xs mt-2'>{errorsForm[0]}</p>
      </div>
    )
}

const DatePickerVisite = ({startDate, setStartDate, errorsForm}) => {
    return (
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="datepickervisite" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Début de la visite *</label>
            <DatePicker name="datepickervisite" className={`border text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[1] ?"border-red-500":""}`} dateFormat="dd/MM/yyyy HH:mm" locale="fr" selected={startDate} onChange={(date) => setStartDate(date)} />
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[1]}</p>
        </div>
    );
};

const ObjetVisite = ({setObjetVisite, objetVisite, errorsForm}) => {
    return(
        <div className="m-3">
            <label htmlFor="objetvisite" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Objet de la visite *</label>
            <textarea id="objetvisite" rows="3" className={`block p-2.5 w-full text-sm rounded-lg bg-[color:var(--input-color)] border border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)] ${ errorsForm[2] ?"border-red-500":""}`} placeholder="visite contractuelle" onChange={(objt) => setObjetVisite(objt.target.value)} defaultValue={objetVisite} required={true}></textarea>
            <p className='italic text-red-500 text-xs mt-2'>{errorsForm[2]}</p>
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
  
const PersonnesVisite = ({setSelectedOption, participants, selectedOption, errorsForm}) => {
   
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
                        container: () => `bg-[color:var(--input-color)] rounded-lg p-1 border border-[color:var(--input-border-color)] text-sm ${ errorsForm[3] ?"border-red-500":""}`,
                        indicatorsContainer: () => 'bg-[color:var(--input-color)]',
                    }}
                    isMulti
                    value={selectedOption}
                    onChange={setSelectedOption}
                    options={participants}
                    placeholder={"Participants"}
                    formatCreateLabel={userInput => `Ajouter : ${userInput}`}
                />
                <p className='italic text-red-500 text-xs mt-2'>{errorsForm[3]}</p>
            </div>

        )
    }
}