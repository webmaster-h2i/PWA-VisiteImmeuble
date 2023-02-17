import React, { useState } from "react";

export default function Login() {

  const [codeCabinet, setEmail] = useState("");

  const [codeUtilisateur, setPassword] = useState("");

  function handleSubmit(event) {

    event.preventDefault();

    console.log(codeCabinet);
    console.log(codeUtilisateur);

  }

  return (
    <div className="flex justify-center">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-500">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white flex justify-center">
                  Connexion
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                        <label htmlFor="codeCabinet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code Cabinet</label>
                        <input type="number"  name="codeCabinet" id="codeCabinet" value={codeCabinet} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="code cabinet" required=""/>
                  </div>
                  <div>
                        <label htmlFor="codeUtilisateur" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code Utilisateur</label>
                        <input type="text" name="codeUtilisateur" id="codeUtilisateur" placeholder="code utilisateur" value={codeUtilisateur} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  <button type="submit" className="w-full text-white bg-blue-500 rounded-lg py-2 px-4 hover:bg-blue-600">Connexion</button>
              </form>
          </div>
      </div>
    </div>
  );

}