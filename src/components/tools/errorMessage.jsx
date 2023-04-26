export default function ErrorMessage(errors){

    let errorsArray = [];

    errors.map((champ) => 
        Array.isArray(champ) ? champ.length > 0 ? errorsArray.push(""):errorsArray.push("Ce champ ne peut être vide !"): champ ? errorsArray.push(""):errorsArray.push("Ce champ ne peut être vide !")
    )

   return errorsArray;
}