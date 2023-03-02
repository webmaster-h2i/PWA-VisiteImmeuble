import { forwardRef, useImperativeHandle, useState } from 'react';

//Permet d'afficher le detail d'un immeuble
export const DetailsImmeuble = forwardRef(({details}, ref) => {

    const [show, setShow] = useState(false);

    //Permet au composant parent d'accéder à la méthode showDetails
    useImperativeHandle(ref, () => ({
        showDetails,
    }));

    //Methode qui rend visible ou cache le détail d'un immeuble
    function showDetails(){
        show ? setShow(false): setShow(true);
    }

    //Affiche le détail d'un immeuble
    return(
        <div className={show ? '':'hidden'}>
            <div className='m-4 text-white'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='underline text-sm'>Digicode</div>
                    <div className='text-xs'>{details.details.digicode}</div>
                    <div className='underline text-sm'>Adresse</div>
                    <div className='text-xs'>{details.adresse}</div>
                    <div className='underline text-sm'>Ville</div>
                    <div className='text-xs'>{details.ville}</div>
                    <div className='underline text-sm'>Code postal</div>
                    <div className='text-xs'>{details.code_postal}</div>
                </div> 
            </div>
        </div>
    )
})