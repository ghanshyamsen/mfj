import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postFakeLogin, {
      email: user.email,
      password: user.password,
    });

    if (response.status === "success") {

      // Storing authentication state
      sessionStorage.setItem("authUser", JSON.stringify(response));
      sessionStorage.setItem("configData", JSON.stringify(response.config));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authUser', JSON.stringify(response));
      localStorage.setItem('configData', JSON.stringify(response.config));
      yield put(loginSuccess(response));

      history('/dashboard');
    } else {
      yield put(apiError(response));
    }

  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {

    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("configData");
    localStorage.removeItem("authUser");
    localStorage.removeItem('isLoggedIn', 'true');
    localStorage.removeItem('configData');
    yield put(logoutUserSuccess(true));
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {

    const response = yield call(postSocialLogin, data);
    sessionStorage.setItem("authUser", JSON.stringify(response));
    sessionStorage.setItem("configData", JSON.stringify(response.config));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authUser', JSON.stringify(response));
    localStorage.setItem('configData', JSON.stringify(response.config));
    yield put(loginSuccess(response));

    setTimeout(() => {
      history('/dashboard');
    }, 1000);
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
