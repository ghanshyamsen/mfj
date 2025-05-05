import React from 'react';

//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// Fake Backend
import fakeBackend from "./helpers/AuthType/fakeBackend";

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PrimeReactProvider } from 'primereact/api';


global.notify = function(type, message){
  let options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  }

  switch (type) {
    case 'error':
      toast.error(message, options);
    break;

    case 'success':
      toast.success(message, options);
    break;

    case 'info':
      toast.info(message, options);
    break;

    case 'warning':
      toast.warn(message, options);
    break;

    default:
      toast(message, options);
    break;
  }
}

// Activating fake backend
//fakeBackend();

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

function App() {

  return (
    <React.Fragment>
      <PrimeReactProvider>
        <Route />
        <ToastContainer />
      </PrimeReactProvider>
    </React.Fragment>
  );
}

export default App;
