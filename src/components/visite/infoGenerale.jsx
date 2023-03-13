import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import { fr } from 'date-fns/locale';
import CreatableSelect from 'react-select/creatable';
import { getPersonnes, addVisite } from '../../services/api/visiteApi';
import { useSelector, useDispatch } from 'react-redux';
import { setIdVisite, setinfoGenerales } from "../../store/visiteSlice.jsx";
import { useNavigate } from 'react-router-dom';
import moment from "moment";
registerLocale('fr', fr)

export default function InfoGenerale(){

    const [participants, setparticipants] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [contractuelle, setContractuelle] = useState('Non');
    const [objetVisite, setObjetVisite] = useState(false);
    const immeuble = useSelector((visite) => visite.visite.visite.immeuble);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getPersonnes().then((response) => {
            response.data.data.map((personne)=>
                setparticipants(participants =>[...participants,{value: personne.code_personne, label: personne.nom + ' ' +personne.prenom}])
            )
        })
    }, []);

    function handleCreateVisite(){

        //Création d'un tableau avec la liste des participants, si il est inscrit on ajoute son code, si il n'est pas inscrit on ajoute son nom
        let participantsVisite = [];
        selectedOption.map(participant => participantsVisite.push(participant.value))

        //Création de l'objet visite qui va être envoyé à l'API
        let visite = [{
            "code_immeuble": immeuble,
            "date_creation": moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
            "type": contractuelle === 'Oui' ? "Contractuelle" : "Ponctuelle",
            "objet": objetVisite,
            "participants": participantsVisite,
        }]

        //Call API
        addVisite(visite).then((response) => {
            dispatch(setIdVisite(response.data.data.id));
            dispatch(setinfoGenerales(visite));
            navigate("/element");
        })
    }

    return(
        <div>
            <div className="flex justify-center m-9">
                <h3 className="text-lg text-white">Informations générales</h3>
            </div>
            <div className="mt-9">
                <PersonnesVisite setSelectedOption={setSelectedOption} participants={participants} selectedOption={selectedOption}/>
            </div>
            <div className="mt-9">
                <DatePickerVisite startDate={startDate} setStartDate={setStartDate}/>
            </div>
            <div className="mt-9">
                <Contractuelle setContractuelle={setContractuelle} contractuelle={contractuelle}/>
            </div>
            <div className="mt-9">
                <ObjetVisite setObjetVisite={setObjetVisite}/>
            </div>
            <div className="flex justify-center mt-9 mr-3 ml-3">
                <button className="w-full text-white bg-sky-600 rounded-md py-2 px-4 hover:bg-sky-700" onClick={handleCreateVisite}>Ajout d'élément</button>
            </div>
        </div>
    )
}

const Contractuelle = ({setContractuelle, contractuelle}) => {
    return(
        <div className="m-3">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" onChange={(contr) => contr.target.checked ? setContractuelle('Oui'):setContractuelle('Non')}/>
                <div className="w-10 h-5 rounded-full dark:bg-gray-700 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-orange-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Visite contractuelle: {contractuelle}</span>
            </label>
        </div>
    )
}

const ObjetVisite = ({setObjetVisite}) => {
    return(
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="objetvisite" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Objet de la visite *</label>
            <textarea id="objetvisite" rows="4" className="block p-2.5 w-full text-sm rounded-lg bg-gray-700  placeholder-gray-400 text-white " placeholder="visite contractuelle" onChange={(objt) => setObjetVisite(objt.target.value)}></textarea>
        </div>
    )
}

const DatePickerVisite = ({startDate, setStartDate}) => {
    return (
        <div className="mt-9 mr-3 ml-3 mb-3">
            <label htmlFor="datepickervisite" className="block mb-2 text-sm font-medium text-white">Début de la visite *</label>
            <DatePicker name="datepickervisite" className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" dateFormat="dd/MM/yyyy HH:mm:ss" locale="fr" selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
    );
};
  
const PersonnesVisite = ({setSelectedOption, participants, selectedOption}) => {
    return(
        <div className="m-3">
            <label htmlFor="selectpersonnes" className="block mb-2 text-sm font-medium text-white">Participants *</label>
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
                        border: "none"
                    }),
                    valueContainer: (baseStyles) => ({
                        ...baseStyles,
                        border: "none"
                    }),
                    input: (baseStyles) => ({
                        ...baseStyles,
                        border: "none",
                        color: "white"
                    }),
                    multiValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "white"
                    }),
                }}
                classNames={{
                    valueContainer: () => 'bg-gray-700 rounded-lg text-white',
                    group: () => 'bg-gray-700',
                    dropdownIndicator: () => 'bg-gray-700',
                    container: () => 'bg-gray-700 rounded-lg p-1',
                    indicatorsContainer: () => 'bg-gray-700',
                    multiValueLabel: () => 'bg-white',
                    singleValue: () => 'text-white'
                }}
                isMulti
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={participants}
                placeholder={"Participants"}
                formatCreateLabel={userInput => `Ajouter : ${userInput}`}
            />
        </div>
    )
}