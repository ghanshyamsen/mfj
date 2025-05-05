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

const AuthManagerProtected = (props) => {

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
  const {key, job} = useParams();

  if(isLoggedUser){

    const userData = JSON.parse(localStorage.getItem('userData'));

    if(userData?.user_type !== 'manager' && userData?.user_type !== 'subuser'){
      window.showToast("You don't have permission to access this module.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }

    const isSubscribed = window.isSubscribed();

    UpdateUserData(TOKEN);

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


        if(!Roles.view_applicants && (location.pathname === `/candidates/${key}` || location.pathname === `/candidate-info/${key}/${job}`)){
          window.showToast("You don't have permission to access this module.",'error');
          return <Navigate to="/dashboard" state={{ from: location }} />
        }

        if(!Roles.edit_job_position && key && (location.pathname === `/post-job/${key}` || location.pathname === `/job-review/${key}`)){
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
    }

    if((location.pathname === `/manage-sub-user` || location.pathname === `/manage-role`) && userData.employer_type!=='Franchise' && userData.employer_type!=='Multi-Location Operator'){
      window.showToast("You don't have permission to access this module.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }

    if((location.pathname === `/company-profile` || location.pathname === `/subscription`)  && userData?.user_type === 'subuser'){
      window.showToast("You don't have permission to access this module.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }

    if((!isSubscribed && (location.pathname === '/post-job' || location.pathname === '/jobs')) || (!isSubscribed && location.pathname !== '/subscription' && userData?.personality_assessment_complete_status)){
      window.showToast("Please select a plan",'error');
      return <Navigate to="/subscription" state={{ from: location }} />
    }

    if(userData?.user_type === 'manager' && location.pathname === '/post-job' && !userData?.personality_assessment_complete_status){
      window.showToast("Please complete your Personality Assessment first.",'error');
      return <Navigate to="/dashboard" state={{ from: location }} />
    }

    /* if(isSubscribed){
      if(userData.plan_id.plan_matches === 'no' && (location.pathname === '/select-job' || location.pathname === `/candidates/${key}` || location.pathname === `/candidate-info/${key}/${job}`)){
        window.showToast("You don't have permission to access this module, Please upgrade your plan to access this module.",'error');
        return <Navigate to="/subscription" state={{ from: location }} />
      }
    } */

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


export { AuthManagerProtected };