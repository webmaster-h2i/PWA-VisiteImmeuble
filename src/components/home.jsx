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
import  ErrorMessage  from './errorMessage';

export default function Home() {

  const [error, setError] = useState('');

  return (
    <div>
      <div className='p-3'>
          <div className='flex justify-center pb-3'>
            <h1 className='text-white md:text-3xl text-3xl text-center p-5'>Bienvenue sur Navilite</h1>
          </div>
          <div className='flex justify-center mb-7'>
            <a href={"/visite"}>
              <button className='bg-sky-600 hover:bg-sky-800 text-white font-bold py-3 px-3 rounded-full shadow-2xl'>
                <Plus className='w-8'/>
              </button>
            </a>
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
          <Immeubles/>
        </div>
      </div>
    </div>
  );
}

//Renvoi la liste des visites en cours
function VisitesEnCours({setError}){

  const [listVisite, setListVisite] = useState([]);

  //Call Api pour récupérer la liste des immeubles
  useEffect(() => {
    getVisites().then((response) => {
        setListVisite(response.data.data);
    })
  }, []);

  //Call Api pour supprimer une visite
  function handleDeleteVisite(event, idVisite){
    event.preventDefault();
    deleteVisite(idVisite).then( (response) => {
      if(response.status !== 200){
        setError(response.data.message);
      }else{
        getVisites().then((response) => {
          setListVisite(response.data.data);
        })
      }
    }
    )
  }

  if(listVisite.length > 0){
    return(
      <ul className='max-w-md divide-y divide-gray-200 bg-neutral-800 rounded-md p-2'>
        {listVisite.map((visite, index)=>
          <li key={index} className='pb-3 sm:pb-4 pt-2'>
            <div className='flex items-center space-x-3 p-1'>
                <div className='flex-shrink-0 text-white text-xs'>
                  {visite.date_creation}
                </div>
                <div className='flex-1 text-center min-w-0 text-white text-sm'>
                  {visite.immeuble.nom}
                </div>
                <div className='inline-flex items-center'>
                  <div className='p-1'>
                  <button className='bg-sky-600 text-white py-1 px-1 rounded-full shadow-2xl'>
                    <Pen className='w-5'/>
                  </button>
                  </div>
                  <div className='p-1'>
                  <button className='bg-sky-600 text-white py-1 px-1 rounded-full shadow-2xl' onClick={(e) => handleDeleteVisite(e,visite.id)}>
                    <Trash className='w-5'/>
                  </button>
                  </div>
                </div>
            </div>
          </li>
        )}
      </ul>
    )
  }else{
    return(
      <ul className='max-w-md divide-y divide-gray-200 bg-neutral-800 rounded-md p-2'>
        <li>
          <div className='flex justify-center text-white'>
            <h5>Aucune visite en cours</h5>
          </div>
        </li>
      </ul>
    )
  }
  
}

//Renvoi la liste des immeubles
function Immeubles(){

  const [listImmeubles, setListImmeubles] = useState([]);

  //Call Api pour récupérer la liste des immeubles
  useEffect(() => {
    getImmeubles().then((response) => {
        setListImmeubles(response.data.data);
    })
  }, []);

  //Tableau de ref lié au détail d'un immeuble. Permet de récupérer la function showDetails() du composant enfant (DetailsImmeuble) vers le composant parent (Home)
  const childRef = useRef([]);

  if(listImmeubles.length > 0){
    return(
      <ul className='max-w-md divide-y divide-gray-200 bg-neutral-800 rounded-md p-3'>
        {listImmeubles.map((immeuble, index) =>
          <li key={immeuble.code_immeuble} className='pb-3 sm:pb-4 pt-2'>
            <div className='flex items-center space-x-4' onClick={() => childRef.current[index].showDetails() }>
                <div className='flex-shrink-0 text-white'>
                  <Building className='w-8'/>
                </div>
                <div className='flex-1 min-w-0 text-white text-sm'>
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
  }else{
    return(
      <ul className='max-w-md divide-y divide-gray-200 bg-neutral-800 rounded-md p-2'>
        <li>
          <div className='flex justify-center text-white'>
            <h5>Aucun immeuble</h5>
          </div>
        </li>
      </ul>
    )
  }

  
}