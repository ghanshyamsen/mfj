import {
  AUTH_RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_FLAG,
} from "./actionTypes";

const initialState = {
  resetSuccessMsg: null,
  resetError: null,
};

const resetPassword = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_RESET_PASSWORD:
      state = {
        ...state,
        resetSuccessMsg: null,
        resetError: null,
      };
      break;
    case RESET_PASSWORD_SUCCESS:
      state = {
        ...state,
        resetSuccessMsg: action.payload.message,
      };
      break;
    case RESET_PASSWORD_ERROR:
      state = {
        ...state,
        resetError: action.payload.message,
      };
      break;
    case RESET_PASSWORD_FLAG:
      state = { ...state, resetError: action.payload.message };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default resetPassword;
