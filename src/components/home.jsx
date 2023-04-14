import React from 'react';
import { useEffect, useState, useRef} from 'react';
import { getImmeubles } from '../services/api/immeubleApi';
import { getVisites, deleteVisite } from '../services/api/visiteApi';
import { ReactComponent as Building } from '../assets/icons/building.svg';
import { ReactComponent as ArrowDown } from '../assets/icons/arrowDown.svg';
import { ReactComponent as Pen } from '../assets/icons/pen.svg';
import { ReactComponent as Trash } from '../assets/icons/trash.svg';
import { ReactComponent as Plus} from '../assets/icons/plus.svg';
import { DetailsImmeuble } from './detailsImmeuble';
import ErrorMessage  from './errorMessage';
import Loader from '../components/loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setImmeuble } from '../store/visiteSlice.jsx';
import { NotifyToaster } from '../components/notifyToast';

export default function Home() {

  const [error, setError] = useState('');
  const selectImmeubleDialog = useRef('');
  const [listImmeubles, setListImmeubles] = useState([]);
  const [loading, setLoading] = useState(true);

  //Call Api pour récupérer la liste des immeubles
  useEffect(() => {
    getImmeubles().then((response) => {
        setListImmeubles(response.data.data);
    }).then( setLoading(false) )
  }, []);

  return (
    <div>
      <SelectImmeuble selectImmeubleDialog={selectImmeubleDialog} listImmeubles={listImmeubles}/>
      <div className='p-3'>
          <div className='flex justify-center pb-3'>
            <h1 className='text-white md:text-3xl text-3xl text-center p-5'>Bienvenue sur Navilite</h1>
          </div>
          <div className='flex justify-center mb-7'>
              <button className='bg-orange-600 hover:bg-sky-700 text-white font-bold py-3 px-3 rounded-full shadow-2xl' onClick={() => selectImmeubleDialog.current.showModal()}>
                <Plus className='w-8'/>
              </button>
          </div>
          <ErrorMessage errors={error}/>
          <div className='bg-sky-700 rounded-lg p-3'>
            <div className='mb-5 text-white'>
              <h4>Visites en cours</h4>
            </div>
              <VisitesEnCours setError={setError}/>
          </div>
      </div>
      <div className='p-3'>
        <div className='bg-sky-700 rounded-lg p-3'>
        <div className='mb-5 text-white'>
          <h4>Immeubles</h4>
        </div>
          <Immeubles listImmeubles={listImmeubles} loading={loading}/>
        </div>
      </div>
    </div>
  );
}

// Affiche la modale qui permet de sélectionner un immeuble lors du début de la visite 
const SelectImmeuble = ({selectImmeubleDialog, listImmeubles}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedImmeuble, setSelectedImmeuble] = useState(null);

    // Modifie le state locale et globale avec l'immeuble sélectionné 
    const handleSelect = (e) => {
        e.preventDefault();
        dispatch(setImmeuble(e.target.value));
        setSelectedImmeuble(e.target.value);
    }
    
    // Début de la visite, vérifie qu'un immeuble soit bien sélectionné
    const handleclick = (e) => {
        e.preventDefault();
        if(selectedImmeuble){
            NotifyToaster('Début de la visite', 'info');
            navigate('/info');
        }
    }

    return(
      <div>
        <dialog ref={selectImmeubleDialog} id="signatureDialog" className="bg-gray-800 w-full bdrp">
            <form method="dialog">
                <div className="m-2">
                  <div className="mt-9">
                    <label htmlFor="immeubles" className="block mb-2 text-sm font-medium text-white">Selectionner un immeuble</label>
                    <select id="immeubles" onChange={handleSelect} className="w-full max-w-md border text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                        <option defaultValue></option>
                        {listImmeubles.map(immeuble => <option className="text-lg" value={immeuble.code_immeuble} key={immeuble.code_immeuble}>{immeuble.code_immeuble} - {immeuble.nom}</option>)}
                    </select>
                  </div>
                </div>
                <menu>
                    <div className="flex justify-center mt-12 mr-3 ml-3">
                        <button className="w-full text-white  hover:bg-sky-700 rounded-md py-2 px-4 m-1" value="close">Annuler</button>
                        <button className="w-full text-white  hover:bg-sky-700 rounded-md py-2 px-4 m-1" onClick={handleclick}>Valider</button>
                    </div>
                </menu>
            </form>
        </dialog>
      </div>
    )
}



//Renvoi la liste des visites en cours
const VisitesEnCours = () => {

  const [listVisite, setListVisite] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Call Api pour récupérer la liste des visites
  useEffect(() => {
    getVisiteHome()
  },[]);

  // Filtre les visites qui n'ont pas de date de cloture
  function getVisiteHome(){
    getVisites().then((response) => {
      response.data.data.map(visite => 
        !visite.date_cloture ? setListVisite(listVisite =>[...listVisite,visite]):'',
      )
    }).then(setLoading(false))
  }

  //Call Api pour supprimer une visite
  function handleDeleteVisite(event, idVisite){

    event.preventDefault();
    setLoading(true);

    // Supprime une visite en cours
    deleteVisite(idVisite).then(() => {
        //MAJ de l'état de la liste des visite en enlevant la visite supprimée
        let filterList = listVisite.filter( visite => visite.id !== idVisite);
        setListVisite(filterList);
        NotifyToaster('La visite a bien été supprimé', 'info');
        setLoading(false);
    })
  }

  // Redirige vers la page de modification d'une visite
  function handleUpdateVisite(event, idVisite){
    
    event.preventDefault();
    navigate('/info/'+idVisite)
  }

  if(loading){return(<Loader/>)}

  if(listVisite.length <= 0){
    return(
      <ul className='divide-y divide-gray-200 bg-neutral-800 rounded-md p-2'>
        <li>
          <div className='flex justify-center text-white'>
            <h5>Aucune visite en cours</h5>
          </div>
        </li>
      </ul>
    )
  }
  
  return(
    <ul className='divide-y divide-gray-200 bg-neutral-800 rounded-md p-2'>
      {listVisite.map((visite, index) =>
        <li key={index} className='pb-3 sm:pb-4 pt-2'>
          <div className='flex items-center space-x-3 p-1'>
              <div className='flex-shrink-0 text-white text-xs'>
                {visite.date_creation}
              </div>
              <div className='flex-1 text-center min-w-0 text-white text-xs'>
                {visite.immeuble.nom}
              </div>
              <div className='inline-flex items-center'>
                <div className='p-1'>
                <button className='bg-orange-600 text-white py-1 px-1 rounded-full shadow-2xl' onClick={(e) => handleUpdateVisite(e,visite.id)}>
                  <Pen className='w-4'/>
                </button>
                </div>
                <div className='p-1'>
                <button className='bg-orange-600 text-white py-1 px-1 rounded-full shadow-2xl' onClick={(e) => handleDeleteVisite(e,visite.id)}>
                  <Trash className='w-4'/>
                </button>
                </div>
              </div>
          </div>
        </li>
      )}
    </ul>
  )
}


//Renvoi la liste des immeubles
const Immeubles = ({listImmeubles, loading}) => {

  //Tableau de ref lié au détail d'un immeuble. Permet de récupérer la function showDetails() du composant enfant (DetailsImmeuble) vers le composant parent (Home)
  const childRef = useRef([]);

  if(loading){return(<Loader/>)}

  if(listImmeubles.length <= 0){
    return(
      <ul className='divide-y divide-gray-200 bg-neutral-800 rounded-md p-2'>
        <li>
          <div className='flex justify-center text-white'>
            <h5>Aucun immeuble</h5>
          </div>
        </li>
      </ul>
    )
  }

  return(
    <ul className='divide-y divide-gray-200 bg-neutral-800 rounded-md p-3'>
      {listImmeubles.map((immeuble, index) =>
        <li key={immeuble.code_immeuble} className='pb-3 sm:pb-4 pt-2'>
          <div className='flex items-center space-x-4' onClick={() => childRef.current[index].showDetails() }>
              <div className='flex-shrink-0 text-white'>
                <Building className='w-7'/>
              </div>
              <div className='flex-1 min-w-0 text-white text-xs'>
                {immeuble.code_immeuble} - {immeuble.nom}
              </div>
              <div className='inline-flex items-center text-base font-semibold'>
              <div className='text-white'>
                <ArrowDown className='w-5'/>
              </div>
              </div>
          </div>
          <DetailsImmeuble details={immeuble} ref={(element) => {childRef.current[index] = element}} />
        </li>
      )}
    </ul>
  )
}
