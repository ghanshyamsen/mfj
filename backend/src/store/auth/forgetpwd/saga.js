import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes";
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions";

import {
  postFakeForgetPwd,
  postJwtForgetPwd,
} from "../../../helpers/fakebackend_helper";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    const response = yield call(postFakeForgetPwd, user);
    if (response) {
      yield put(userForgetPasswordSuccess(response));
    }
  } catch (error) {
    yield put(userForgetPasswordError(error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;
