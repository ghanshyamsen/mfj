import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  EDIT_PROFILE,
  RESET_PROFILE_FLAG,
  RESET_PASSWORD,
  PASSWORD_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  success: "",
  user: {},
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case RESET_PASSWORD:
      state = { ...state };
      break;
    case PASSWORD_SUCCESS:
      state = {
        ...state,
        success: action.payload.status,
        message: action.payload.message,
        user: "",
      };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        success: action.payload.status,
        message: action.payload.message,
        user: action.payload.data,
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        error: action.payload,
      };
      break;
    case RESET_PROFILE_FLAG:
      state = {
        ...state,
        success: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
