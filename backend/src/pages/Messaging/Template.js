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

function MessageTemplate() {
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
        message: "",
        type: "",
      });
    }
  }, []);

  const fetchData = async () => {
    const response = await api.get(
      `${process.env.REACT_APP_API_URL}/message/template/get/${Id}`
    );
    if (response.status === "success") {
      const dataArray = response.data;
      populateFromData(dataArray);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    let response;
    if (Id) {
      response = await api.update(
        `${process.env.REACT_APP_API_URL}/message/template/update/${Id}`,
        formData
      );
    } else {
      response = await api.create(
        `${process.env.REACT_APP_API_URL}/message/template/create`,
        formData
      );
    }

    if (response.status) {
      console.log(response);
      window.notify("success", response.message);
      history("/messages/list");
    } else {
      window.notify("error", response.message);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.message) {
      errors.message = "Message is required";
    }
    if (!data.type) {
      errors.type = "Select Type";
    }
    return errors;
  };

  document.title = `Manage Message | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Message" pageTitle="" />
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
                        <Label htmlFor="type" className="form-label">
                          Type
                        </Label>
                        <Input
                          id="type"
                          name="type"
                          type="select"
                          onChange={handleChange}
                          value={formData.type || ""}
                        >
                          <option value="">Select</option>
                          <option value="both">Both</option>
                          <option value="student">Student</option>
                          <option value="employer">Employer</option>
                        </Input>
                        {errors.type && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.type}{" "}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <Label htmlFor="message" className="form-label">
                          Message
                        </Label>
                        <Input
                          type="textarea"
                          id="message"
                          name="message"
                          maxLength="500"
                          onChange={handleChange}
                          value={formData.message || ""}
                        />
                        {errors.message && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.message}
                          </div>
                        )}
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

export default MessageTemplate;
