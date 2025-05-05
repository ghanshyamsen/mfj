import React from "react";
import "./App.css";
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import "bootstrap/dist/css/bootstrap.min.css";
import Route from "./Routes";
import 'react-toastify/dist/ReactToastify.css';
import { ProfileProvider } from './ProfileContext';
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer} from 'react-toastify';
import './util/utils'; // Import once to make functions available globally
import './util/validationUtils'; // Import once to make functions available globally
/* routes */
import { OnlineUsersProvider } from './OnlineUsersContext';

function App() {
  return (
    <PrimeReactProvider>
      <OnlineUsersProvider>
        <ProfileProvider>
          <React.Fragment>
            <Route />
            <ToastContainer />
          </React.Fragment>
        </ProfileProvider>
      </OnlineUsersProvider>
    </PrimeReactProvider>
  );
}

export default App;
