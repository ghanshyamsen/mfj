import axios from "axios";
import { api } from "../config";
import { Navigate } from "react-router-dom";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : (localStorage.getItem("authUser")?JSON.parse(localStorage.getItem("authUser")).token:null);

if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    let message;

    if (error.response) {
      // Check for status code and message in the error response
      const status = error.response.status;
      const errorMessage = error.response.data.message;

      switch (status) {
        case 500:
          message = "Internal Server Error";
          break;
        case 401:
          if (errorMessage === "jwt expired") {
            message = "Your session has expired. Please log in again.";
            // You can trigger a logout or token refresh here
            // For example:
            // logoutUser(); or refreshToken();
          } else {
            message = "Invalid credentials";
          }
          break;
        case 400:
          if (errorMessage === "jwt expired") {
            message = "Your session has expired. Please log in again.";
            // You can trigger a logout or token refresh here
            // For example:

            window.notify('error', message);
            logoutUser(); //or refreshToken();
          } else {
            message = "Invalid credentials";
          }
          break;
        case 404:
          message = "Sorry! The data you are looking for could not be found";
          break;
        default:
          message = errorMessage || error.message || "An unknown error occurred";
      }
    } else {
      // Fallback for no response from the server
      message = "Network error. Please try again later.";
    }

    window.notify('error', message);

    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });
      
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data, headers=false) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {

  // Checking authentication state for all tabs
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // FOR SAP : Multiple Tab
  if(isLoggedIn){
    const user = localStorage.getItem("authUser");
    return JSON.parse(user);
  }

  // FOR SAP : Single Tab
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};


const logoutUser = () => {
  try {
    // Clear session and local storage
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("configData");
    localStorage.removeItem("authUser");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('configData');

    // Redirect to the login page
    window.location.href = "/login"; // Use window.location to trigger a redirect
  } catch (error) {
    console.error("Logout failed: ", error);  // Log the error for debugging
  }
};
export { APIClient, setAuthorization, getLoggedinUser };