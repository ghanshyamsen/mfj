import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  UncontrolledAlert,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
const api = new APIClient();

function ManageBadge() {
  const { key: Id } = useParams();
  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});

  const populateFromData = (data) => {
    setFormData(data);
    setData(data);
  };

  useEffect(() => {
    if (Id) {
      fetchData();
    } else {
      populateFromData({
        title: "",
      });
    }
  }, []);

  const fetchData = async () => {
    const response = await api.get(
      `${process.env.REACT_APP_API_URL}/badge/get/${Id}`
    );
    if (response.status === "success") {
      const dataArray = response.data;
      console.log(dataArray);
      populateFromData(dataArray);
    }
  };
  const handleChange = (event) => {
    if (event.target.type === "file") {
      setFormData({ ...formData, [event.target.name]: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let FormDataObj = new FormData(event.target);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    let response;
    if (Id) {
      response = await api.update(
        `${process.env.REACT_APP_API_URL}/badge/update/${Id}`,
        FormDataObj
      );
    } else {
      response = await api.create(
        `${process.env.REACT_APP_API_URL}/badge/create`,
        FormDataObj
      );
    }

    if (response.status) {
      window.notify("success", response.message);
      history("/messages/badge/list");
    } else {
      window.notify("error", response.message);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.title) {
      errors.title = "title is required";
    }
    if (!data.badge_image) {
      errors.badgeImage = "Badge Image is required";
    }
    return errors;
  };

  document.title = `Manage Badge | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Badge" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (
                    <UncontrolledAlert
                      color="danger"
                      className="alert-top-border mb-xl-0"
                    >
                      {" "}
                      <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i>
                      <strong>Danger</strong> - {errorMsg}{" "}
                    </UncontrolledAlert>
                  ) : null}
                  {successMsg ? (
                    <UncontrolledAlert
                      color="success"
                      className="alert-top-border"
                    >
                      {" "}
                      <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i>
                      <strong>Success</strong> - {successMsg}{" "}
                    </UncontrolledAlert>
                  ) : null}
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit}>
                      <div className="form-group mb-3">
                        <Label htmlFor="title" className="form-label">
                          Title
                        </Label>
                        <Input
                          type="text"
                          id="title"
                          name="title"
                          maxLength="150"
                          onChange={handleChange}
                          value={formData.title || ""}
                        />
                        {errors.title && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.title}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <Label htmlFor="badge_image" className="form-label">
                          Badge Image
                        </Label>
                        <Input
                          id="badge_image"
                          name="badge_image"
                          type="file"
                          onChange={handleChange}
                        ></Input>
                        {errors.badgeImage && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.badgeImage}
                          </div>
                        )}
                        {typeof formData.badge_image === "string" &&
                        formData.badge_image &&
                        formData.badge_image !== "" &&
                        formData.badge_image !== "null" ? (
                          <div
                            style={{ width: "200px" }}
                            className="p-2 m-1 rounded-3 bg-dark"
                          >
                            <img
                              src={`${process.env.REACT_APP_MEDIA_URL}badge/${formData.badge_image}`}
                              className="w-100"
                              alt={formData?.badgeImage}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        <Button
                          color="success"
                          className="btn btn-success w-10"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default ManageBadge;
