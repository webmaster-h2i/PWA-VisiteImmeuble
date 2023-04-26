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
        <div className={show ? 'bg-[color:var(--second-block-home-color)]':'hidden'}>
            <div className='text-[color:var(--first-text-color)] divide-x-4 p-2 border-t-2'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='text-xs'>Digicode</div>
                    <div className='text-xs'>{details.details.digicode}</div>
                    <div className='text-xs'>Adresse</div>
                    <div className='text-xs'>{details.adresse}</div>
                    <div className='text-xs'>Ville</div>
                    <div className='text-xs'>{details.ville}</div>
                    <div className='text-xs'>Code postal</div>
                    <div className='text-xs'>{details.code_postal}</div>
                </div> 
            </div>
        </div>
    )
})