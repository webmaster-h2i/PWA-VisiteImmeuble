import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { errorMsg, addError } from '../store/errorSlice';
import { setToken } from '../store/tokenSlice.jsx';

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector(errorMsg);


  function handleSubmit(event){
    event.preventDefault();
    // Base url de l'api
    const apiURL = "https://api-navilite-dev.h2i.fr/api/";
    // Authentification
    axios.post(apiURL+'login',{},{
      auth:{
          username: email,
          password: password
      }
    }).then((response) => {

        dispatch(setToken(response.data.token));
        navigate('/immeubles');

    }).catch(e => {

        dispatch(addError(e.response.data.message));

    });
  }

  return (
    <div className="flex justify-center">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-500">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white flex justify-center">
                  Connexion
              </h1>
              <h2 className="text-white">{errors}</h2>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email"  name="email" id="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="{true}"/>
                  </div>
                  <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                        <input type="password" name="password" id="password" placeholder="mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="{true}"/>
                  </div>
                  <button type="submit" className="w-full text-white bg-blue-500 rounded-lg py-2 px-4 hover:bg-blue-600">Connexion</button>
              </form>
          </div>
        </div>
    </div>
  );
}