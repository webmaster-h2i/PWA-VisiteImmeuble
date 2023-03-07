import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setToken } from "../store/tokenSlice.jsx";
import { signIn } from "../services/api/userApi";
import  ErrorMessage  from './errorMessage';

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  function handleSubmit(event){
    event.preventDefault();
    signIn(email,password).then((response) => {
        // Ajout du token dans un state global ( utilisation de Redux )
        dispatch(setToken(response.data.token));
        // Redirection vers la route immeubles ( utilisation du Router react ) 
        navigate('/accueil');
    }).catch(e => {
        setError(e.response.data.message);
    });
  }

  return (
    <div className="h-screen flex items-center bg-[url('../assets/images/building3.jpg')] bg-no-repeat bg-cover bg-center">
      <div className="m-auto">
        <div className="flex justify-center pb-9">
          <h1 className="text-white text-3xl">Bienvenu sur NaviLite</h1>
        </div>
        <div className="w-full">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <ErrorMessage errors={error}/>
              <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email"  name="email" id="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="{true}"/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                      <input type="password" name="password" id="password" placeholder="mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="{true}"/>
                  </div>
                  <button type="submit" className="w-full text-white bg-sky-700 rounded-lg py-2 px-4 hover:bg-blue-600">Connexion</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}