import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/tokenSlice.jsx";
import { signIn } from "../services/api/userApi";
import  ErrorMessage  from "./tools/errorMessage";
import Septlogo from "../assets/images/septlogo.png";
import { ReactComponent as Eye } from "../assets/icons/eye.svg";
import { ReactComponent as EyeSlash } from "../assets/icons/eyeSlash.svg";

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [typePassword, setTypePassword] = useState("password");

  function handleSubmit(event){
    event.preventDefault();
    // Call API pour l'authentification
    signIn(email,password).then((response) => {
        // Ajout du token dans un state global ( utilisation de Redux )
        dispatch(setToken(response.data.token));
        // Ajout des infos de l'utilisateur connecté dans un state global 
        dispatch(setUser(response.data.user));
        // Redirection vers la route immeubles ( utilisation du Router react ) 
        navigate('/accueil');
    }).catch(e => {
        // Affichage du message d'erreur
        setError(e.response.data.message);
    });
  }

  return (
    <div className="h-screen">
      <div className="pt-32">
        <div className="flex justify-center">
          <img src={Septlogo} className="h-20" alt="Septeo Logo" />
        </div>
        <div className="flex justify-center pt-8">
          <h1 className="text-[color:var(--first-text-color)] text-3xl">NaviLite</h1>
        </div>
        <div className="flex justify-center pt-8">
          <h4 className="text-[color:var(--first-text-color)] text-sm">Connectez-vous à votre compte</h4>
        </div>
        <div className="w-full">
          <div className="p-6 pt-2 space-y-4 md:space-y-6 sm:p-8">
              <ErrorMessage errors={error}/>
              <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Email*</label>
                      <input type="email" name="email" id="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]" required={true}/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-[color:var(--first-text-color)]">Mot de passe*</label>
                      <div className="absolute right-8 mt-3 mr-1">
                        {typePassword === "password" ? <EyeSlash onClick={() => setTypePassword("text")}/>:<Eye onClick={() => setTypePassword("password")}/>}
                      </div>
                      <input type={typePassword} name="password" id="password" placeholder="mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-[color:var(--input-color)] border-[color:var(--input-border-color)] placeholder-gray-400 text-[color:var(--first-text-color)]" required={true}/>
                  </div>
                  <button type="submit" className="w-full text-[color:var(--second-text-color)] bg-[color:var(--first-button-color)] rounded py-3 px-4 hover:bg-[color:var(--button-hover-color)] shadow-2xl">Connexion</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}