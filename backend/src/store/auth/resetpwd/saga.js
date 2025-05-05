import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { AUTH_RESET_PASSWORD } from "./actionTypes";
import { userResetPasswordSuccess, userResetPasswordError } from "./actions";

import {
  postResetPwd,
} from "../../../helpers/fakebackend_helper";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* resetPasswordUser({ payload: { values } }) {
  console.log(values);
  try {
    const response = yield call(postResetPwd, values);
    if (response) {
      yield put(userResetPasswordSuccess(response));
    }
  } catch (error) {
    yield put(userResetPasswordError(error));
  }
}

export function* watchUserResetPassword() {
  yield takeEvery(AUTH_RESET_PASSWORD, resetPasswordUser);
}

function* resetPasswordSaga() {
  yield all([fork(watchUserResetPassword)]);
}

export default resetPasswordSaga;
