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

const AuthProtected = (props) => {

  const  TOKEN = localStorage.getItem('token');
  GetConfig();

  if(TOKEN && isTokenExpired(TOKEN)){
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedUser');
    localStorage.removeItem('Roles');
    window.showToast("Session expired. Please log in again.", 'error');
  }


  const isLoggedUser = localStorage.getItem('isLoggedUser');
  const location = useLocation();
  const {key} = useParams();

  if(isLoggedUser){

    UpdateUserData(TOKEN);

    const userData = JSON.parse(localStorage.getItem('userData'));

    if(userData?.user_type === 'subuser'){
      const Roles = JSON.parse(userData.role);
      localStorage.setItem('Roles', JSON.stringify(Roles));

      if(!Roles.admin_access){

        if(!Roles.communication && location.pathname === '/chat'){
          window.showToast("You don't have permission to access this module.",'error');
          return <Navigate to="/dashboard" state={{ from: location }} />
        }

        if(!Roles.job_posting && location.pathname === '/post-job'){
          window.showToast("You don't have permission to access this module.",'error');
          return <Navigate to="/dashboard" state={{ from: location }} />
        }

        if(!Roles.edit_job_position && key && location.pathname === `/post-job/${key}`){
          window.showToast("You don't have permission to access this module.",'error');
          return <Navigate to="/dashboard" state={{ from: location }} />
        }

        if(!Roles.search_candidates && (location.pathname === `/select-job` || (key && location.pathname === `candidates/${key}`))){
          window.showToast("You don't have permission to access this module.",'error');
          return <Navigate to="/dashboard" state={{ from: location }} />
        }

        if(!Roles.view_applicants && location.pathname === `/applicants`){
          window.showToast("You don't have permission to access this module.",'error');
          return <Navigate to="/dashboard" state={{ from: location }} />
        }
      }

      if(location.pathname === `/manage-sub-user` || location.pathname === `/manage-role`){
        window.showToast("You don't have permission to access this module.",'error');
        return <Navigate to="/dashboard" state={{ from: location }} />
      }
    }

    if(userData?.user_type !== 'manager' && userData?.user_type !== 'subuser'){
      if(
        (location.pathname === '/post-job') ||
        (key && location.pathname === `/post-job/${key}`) ||
        (location.pathname === `/select-job` || (key && location.pathname === `candidates/${key}`)) ||
        (location.pathname === `/applicants`) ||
        (location.pathname === `/manage-sub-user` || location.pathname === `/manage-role`)
      ){
        window.showToast("You don't have permission to access this module.",'error');
        return <Navigate to="/dashboard" state={{ from: location }} />
      }
    }



    if((userData?.user_type !== 'manager' && userData?.user_type !== 'subuser' && userData?.user_type !== 'teenager') && location.pathname === `/jobs`){
      window.showToast("You don't have permission to access this module.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }
    // location.pathname === `/checkout/${key}` ||
    if((userData?.user_type === 'manager' || userData?.user_type === 'subuser') &&
      (location.pathname === `/wallet` || location.pathname === `/packages` || location.pathname === `/leaderboard` || location.pathname === `/products` || location.pathname === `/product-detail/${key}` ||  location.pathname === `/product-orders`)
    ){

      window.showToast("You don't have permission to access this module.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }
  }

  if(!isLoggedUser){
    //window.showToast('Your session has been expired, please login for access.','warning');
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return <>{props.children}</>
};

const AcesssRoute = (props) => {

  const  isLoggedUser = localStorage.getItem('isLoggedUser');
  const location = useLocation();
  GetConfig();


  if(isLoggedUser && location.pathname!=='/linkedin'){
    return (
      <Navigate to={{pathname : '/dashboard', state: {from:props.location} }} />
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
    if(result.status === 'success') {
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



export { AuthProtected, AcesssRoute };