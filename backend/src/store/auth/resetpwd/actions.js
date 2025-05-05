import {
  AUTH_RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_FLAG,
} from "./actionTypes";

export const userResetPassword = (values) => {
  return {
    type: AUTH_RESET_PASSWORD,
    payload: { values },
  };
};

export const userResetPasswordSuccess = (message) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userResetPasswordError = (message) => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload: message,
  };
};
export const resetPasswordFlag = (error) => {
  return {
    type: RESET_PASSWORD_FLAG,
  };
};
