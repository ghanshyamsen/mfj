import React from 'react';
import { Navigate, useNavigate, useLocation, useParams  } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useProfile } from '../ProfileContext';

const isTokenExpired = (token) => {
  if (!token) return true;

  const { exp } = jwtDecode(token);
  if (!exp) return true;
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
};

const AuthStudentProtected = (props) => {

  GetConfig();

  const  TOKEN = localStorage.getItem('token');

  if(TOKEN && isTokenExpired(TOKEN)){
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedUser');
    localStorage.removeItem('Roles');

    window.showToast("Session expired. Please log in again.", 'error');
  }


  const isLoggedUser = localStorage.getItem('isLoggedUser');
  const location = useLocation();
  const history = useNavigate();
  const {key} = useParams();

  if(isLoggedUser){

    const userData = JSON.parse(localStorage.getItem('userData'));


    if(userData?.user_type !== 'teenager'){
      window.showToast("You don't have permission to access this module.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }

    UpdateUserData(TOKEN);
  }

  if(!isLoggedUser){
    //window.showToast('Your session has been expired, please login for access.','warning');
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return <>{props.children}</>
};


const UpdateUserData = async (TOKEN) => {

  const history = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch(`${process.env.REACT_APP_API_URL}/app/get-profile/${userData._id}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.status == 'success') {
      localStorage.setItem('userData',JSON.stringify(result.data));
      if(result.data.user_type === 'subuser'){
        localStorage.setItem('Roles', result.data.role);
      }
    }else{

      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedUser');
      localStorage.removeItem('Roles');
      window.showToast(result.message,'error');
      history('/login');
    }
  })
  .catch((error) => console.error(error));

  fetch(`${process.env.REACT_APP_API_URL}/app/refresh-token`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.status) {
      localStorage.setItem('token',result.token);
    }
  })
  .catch((error) => console.error(error));
}

const GetConfig = () => {

  const { setSiteLogo } = useProfile();

  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch(`${process.env.REACT_APP_API_URL}/app/get-config`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.status) {

      localStorage.setItem('ConfigData',JSON.stringify(result.data));
    }
  })
  .catch((error) => console.error(error));


}

export { AuthStudentProtected };