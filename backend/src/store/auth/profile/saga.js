import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { EDIT_PROFILE, RESET_PASSWORD } from "./actionTypes";
import { profileSuccess, passwordSuccess, profileError } from "./actions";
//Include Both Helper File with needed methods

import {
  postFakeProfile,
  postResetPassword,
  postJwtProfile,
} from "../../../helpers/fakebackend_helper";

function* editProfile({ payload: { user } }) {
  try {
    const response = yield call(postFakeProfile, user);

    yield put(profileSuccess(response));
  } catch (error) {
    yield put(profileError(error));
  }
}

function* resetPassword({ payload: { user } }) {
  try {
    const response = yield call(postResetPassword, user);

    if(!response.status){
      window.notify('error', response.message);
    }
    yield put(passwordSuccess(response));
  } catch (error) {
    yield put(profileError(error));
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;
