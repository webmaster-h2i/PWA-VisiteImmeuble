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
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { NotifyToaster } from './tools/notifyToast';
import ErrorMessage  from './tools/errorMessage';
import Loader from './tools/loader';

export default function Home() {

  const [error, setError] = useState('');
  const [listImmeubles, setListImmeubles] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((user) => user.token.user);

  //Call Api pour récupérer la liste des immeubles
  useEffect(() => {
    getImmeubles().then((response) => {
        setListImmeubles(response.data.data);
    }).then(setLoading(false))
  }, []);

  return (
    <div>
      <div className='m-3'>
          <div className='flex justify-center mt-8 mb-8'>
            <p>Bienvenue sur NaviLite <strong>{userInfo.name}</strong></p>
          </div>
          <ErrorMessage errors={error}/>
          <div className='bg-[color:var(--first-main-color)] rounded-lg p-3'>
            <div className='mb-5 text-lg text-[color:var(--second-text-color)]'>
              <h4>Visites en cours</h4>
            </div>
            <VisitesEnCours setError={setError}/>
          </div>
          <div className='bg-[color:var(--first-main-color)] rounded-lg p-3 mt-4'>
            <div className='mb-5 text-lg text-[color:var(--second-text-color)]'>
              <h4>Immeubles</h4>
            </div>
            <Immeubles listImmeubles={listImmeubles} loading={loading}/>
          </div>
      </div>
      <div className='fixed bottom-9 w-full p-3'>
        <button className='w-full inline-flex justify-center text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] rounded py-3 px-4 hover:bg-[color:var(--button-hover-color)] shadow-2xl' onClick={() => {window.location.href='/info'}}>
          <Plus/> <span className="ml-2">Ajouter une visite</span>
        </button>
      </div>
    </div>
  );
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
        NotifyToaster('La visite a bien été supprimé', 'success');
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
      <ul className='divide-y divide-gray-200 bg-[color:var(--first-block-home-color)] rounded-md p-2'>
        <li>
          <div className='flex justify-center text-[color:var(--first-text-color)]'>
            <h5>Aucune visite en cours</h5>
          </div>
        </li>
      </ul>
    )
  }
  
  return(
    <div>
      <ul className='border-b-2 bg-[color:var(--first-block-home-color)] p-2 rounded-t-md'>
          <li>
            <div className='flex items-center space-x-3 p-1'>
                <div className='flex-shrink-0 text-gray-500 text-xs'>
                  <h4>Début</h4>
                </div>
                <div className='flex-1 text-center min-w-0 text-gray-500 text-xs'>
                  <h4>Immeuble</h4>
                </div>
                <div className='inline-flex items-center text-gray-500 text-xs'>
                </div>
            </div>
          </li>
      </ul>
      <ul className='divide-y divide-gray-200 bg-[color:var(--second-block-home-color)] p-2 rounded-b-md'>
        {listVisite.map((visite, index) =>
          <li key={index} className='pb-3 sm:pb-4'>
            <div className='flex items-center space-x-3 p-1'>
                <div className='flex-shrink-0 text-[color:var(--first-text-color)] text-sm'>
                  {visite.date_creation}
                </div>
                <div className='flex-1 text-center min-w-0 text-[color:var(--first-text-color)] text-sm'>
                  {visite.immeuble.nom}
                </div>
                <div className='inline-flex items-center'>
                  <div className='p-1'>
                    <button className='text-[color:var(--first-text-color)] bg-[color:var(--first-block-home-color)] py-1 px-1 shadow-2xl border border-[color:var(--input-border-color)]' onClick={(e) => handleUpdateVisite(e,visite.id)}>
                      <Pen className='w-5'/>
                    </button>
                  </div>
                  <div className='p-1'>
                    <button className='text-[color:var(--first-text-color)] bg-[color:var(--first-block-home-color)] py-1 px-1 shadow-2xl border border-[color:var(--input-border-color)]' onClick={(e) => handleDeleteVisite(e,visite.id)}>
                      <Trash className='w-5'/>
                    </button>
                  </div>
                </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}


//Renvoi la liste des immeubles
const Immeubles = ({listImmeubles, loading}) => {

  //Tableau de ref lié au détail d'un immeuble. Permet de récupérer la function showDetails() du composant enfant (DetailsImmeuble) vers le composant parent (Home)
  const childRef = useRef([]);

  if(loading){return(<Loader/>)}

  if(listImmeubles.length <= 0){
    return(
      <ul className='divide-y divide-gray-200 bg-[color:var(--first-block-home-color)] rounded-md p-2'>
        <li>
          <div className='flex justify-center text-[color:var(--first-text-color)]'>
            <h5>Aucun immeuble</h5>
          </div>
        </li>
      </ul>
    )
  }

  return(
    <ul className='divide-y divide-gray-200 bg-[color:var(--first-block-home-color)] rounded-md'>
      {listImmeubles.map((immeuble, index) =>
        <li key={immeuble.code_immeuble} className='pt-2'>
          <div className='flex items-center space-x-4' onClick={() => childRef.current[index].showDetails() }>
              <div className='flex-shrink-1 text-[color:var(--first-text-color)] p-2'>
                <Building className='w-7'/>
              </div>
              <div className='flex-1 min-w-0 text-[color:var(--first-text-color)] text-sm'>
                {immeuble.code_immeuble} - {immeuble.nom}
              </div>
              <div className='inline-flex items-center text-base font-semibold'>
                <div className='text-[color:var(--first-text-color)] p-2'>
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
