import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import {
  editProfile,
  resetPassword,
  resetProfileFlag,
} from "../../store/actions";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [email, setemail] = useState("");
  const [idx, setidx] = useState("");

  const { user, success, error, message } = useSelector((state) => ({
    user: state.Profile.user,
    email: state.Profile.email,
    success: state.Profile.success,
    error: state.Profile.error,
    message: state.Profile.message,
  }));

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));

      if (!isEmpty(user)) {
        obj.data.name = user.name;
        obj.data.email = user.email;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj.data.name);
      setemail(obj.data.email);
      setidx(obj.data._id);

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: userName || "Admin",
      email: email,
      idx: idx || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
      email: Yup.string()
      .email("Please Enter a Valid Email Address")
      .required("Please Enter Your Email Address"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    },
  });

  const passwordValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      current_password:"",
      password: "",
      confirm_password: "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      current_password : Yup.string().required("Please Enter Current Your Password"),
      password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password cannot be more than 30 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .required("Please Enter Your Password"),
      confirm_password: Yup.string()
        .required("Please Enter Your Confirm Password")
        .oneOf(
          [Yup.ref("password"), null],
          "Confirm Passwords must match to Password"
        ),
    }),
    onSubmit: (values) => {
      dispatch(resetPassword(values));
      passwordValidation.resetForm(); // Reset the form after submission
    },
  });

  document.title = "Profile | " + process.env.REACT_APP_SITE_NAME;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{message}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      {/* <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      /> */}
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userName || "Admin"}</h5>
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Update Profile</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group mb-3">
                  <Label className="form-label">Name</Label>
                  <Input
                    name="name"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="email"
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Email Address"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={
                      validation.touched.email && validation.errors.email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.email}
                    </FormFeedback>
                  ) : null}
                </div>
                <Input name="idx" value={idx} type="hidden" />
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>

          <h4 className="card-title mb-4">Update Password</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  passwordValidation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group mb-3">
                  <Label className="form-label">Current Password</Label>
                  <Input
                    name="current_password"
                    className="form-control"
                    placeholder="Enter Password"
                    type="password"
                    onChange={passwordValidation.handleChange}
                    onBlur={passwordValidation.handleBlur}
                    value={passwordValidation.values.current_password}
                    invalid={
                      passwordValidation.touched.current_password &&
                      passwordValidation.errors.current_password
                        ? true
                        : false
                    }
                  />
                  {passwordValidation.touched.current_password &&
                  passwordValidation.errors.current_password ? (
                    <FormFeedback type="invalid">
                      {passwordValidation.errors.current_password}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <Label className="form-label">Password</Label>
                  <Input
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    type="password"
                    onChange={passwordValidation.handleChange}
                    onBlur={passwordValidation.handleBlur}
                    value={passwordValidation.values.password}
                    invalid={
                      passwordValidation.touched.password &&
                      passwordValidation.errors.password
                        ? true
                        : false
                    }
                  />
                  {passwordValidation.touched.password &&
                  passwordValidation.errors.password ? (
                    <FormFeedback type="invalid">
                      {passwordValidation.errors.password}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mb-3">
                  <Label className="form-label">Confirm Password</Label>
                  <Input
                    name="confirm_password"
                    className="form-control"
                    placeholder="Enter Confirm Password"
                    type="password"
                    onChange={passwordValidation.handleChange}
                    onBlur={passwordValidation.handleBlur}
                    value={passwordValidation.values.confirm_password}
                    invalid={
                      passwordValidation.touched.confirm_password &&
                      passwordValidation.errors.confirm_password
                        ? true
                        : false
                    }
                  />
                  {passwordValidation.touched.confirm_password &&
                  passwordValidation.errors.confirm_password ? (
                    <FormFeedback type="invalid">
                      {passwordValidation.errors.confirm_password}
                    </FormFeedback>
                  ) : null}
                </div>
                <Input name="idx" value={idx} type="hidden" />
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
