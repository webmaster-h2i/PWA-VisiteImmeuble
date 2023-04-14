import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './assets/global.css';
import router from './routes/routes';
import { RouterProvider } from 'react-router-dom';
import { Provider } from "react-redux";
import store from './store/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import Navbar from './components/navBar';
import { ToastContainer } from 'react-toastify';

// Persistor permet de sauvegarder dans le localStorage les informations des states globaux (react-redux)
const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navbar/>
        <ToastContainer className="text-sm"/>
        <RouterProvider router={router} basename="/" />
      </PersistGate>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
