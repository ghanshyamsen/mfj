/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, Alert, Spinner, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useSelector, useDispatch } from "react-redux";

import { useParams, useNavigate } from "react-router-dom";

import { APIClient } from "../../helpers/api_helper";



const api = new APIClient();

const EditObjective = () => {

  document.title ="Edit Objective | "+process.env.REACT_APP_SITE_NAME;

  const { key:oId } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);


  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/objective/get/${oId}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit =  async (event) => {
    event.preventDefault();
    let FormDataObj = formData;
    // Validate the form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const response =  await api.update(`${process.env.REACT_APP_API_URL}/objective/update/${oId}`,FormDataObj);
    // eslint-disable-next-line
    if(response.status === "success"){
      window.notify('success',response.message);
      history('/objective-questions');
      populateFromData(response.data);
      setTimeout(() => setSuccessMsg(''),5000);
    }else{
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    // Example: Required validation
    if (!data.question.trim()) {
      errors.question = 'Question is required';
    }
    if (!data.option_one.trim()) {
      errors.option_one = 'Option One is required';
    }
    if (!data.option_two.trim()) {
      errors.option_two = 'Option Two is required';
    }
    if (!data.option_three.trim()) {
      errors.option_three = 'Option Three is required';
    }
    if (!data.option_four.trim()) {
      errors.option_four = 'Option Four is required';
    }
    if (!data.summary_one.trim()) {
      errors.summary_one = 'Summary One is required';
    }
    if (!data.summary_two.trim()) {
      errors.summary_two = 'Summary Two is required';
    }
    if (!data.summary_three.trim()) {
      errors.summary_three = 'Summary Three is required';
    }
    if (!data.summary_four.trim()) {
      errors.summary_four = 'Summary Four is required';
    }

    // You can add more validation logic here

    return errors;
  };

  document.title = `Edit | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Objective" pageTitle="" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                      <div className="form-group mb-3" key="question">
                        <Label htmlFor="question" className="form-label">Question</Label>
                        <Input type="text" id="question" name="question"  onChange={handleChange} value={formData.question || ''}/>
                        {errors.question && <div className="error" style={{ color: "red" }}>{errors.question}</div>}
                      </div>
                      <Row>

                        <Col xs={6}>
                          <div className="form-group mb-3" key="option_one">
                            <Label htmlFor="option_one" className="form-label">Option One (A)</Label>
                            <Input type="text" id="option_one" name="option_one"  onChange={handleChange} value={formData.option_one || ''}/>
                            {errors.option_one && <div className="error" style={{ color: "red" }}>{errors.option_one}</div>}
                          </div>

                          <div className="form-group mb-3" key="option_two">
                            <Label htmlFor="option_two" className="form-label">Option Two (B)</Label>
                            <Input type="text" id="option_two" name="option_two"  onChange={handleChange} value={formData.option_two || ''}/>
                            {errors.option_two && <div className="error" style={{ color: "red" }}>{errors.option_two}</div>}
                          </div>

                          <div className="form-group mb-3" key="option_three">
                            <Label htmlFor="option_three" className="form-label">Option Three (C)</Label>
                            <Input type="text" id="option_three" name="option_three"  onChange={handleChange} value={formData.option_three || ''}/>
                            {errors.option_three && <div className="error" style={{ color: "red" }}>{errors.option_three}</div>}
                          </div>

                          <div className="form-group mb-3" key="option_four">
                            <Label htmlFor="option_four" className="form-label">Option Four (D)</Label>
                            <Input type="text" id="option_four" name="option_four"  onChange={handleChange} value={formData.option_four || ''}/>
                            {errors.option_four && <div className="error" style={{ color: "red" }}>{errors.option_four}</div>}
                          </div>

                        </Col>

                        <Col xs={6}>
                          <div className="form-group mb-3" key="summary_one">
                            <Label htmlFor="summary_one" className="form-label">Summary For (A)</Label>
                            <Input type="text" id="summary_one" name="summary_one"  onChange={handleChange} value={formData.summary_one || ''}/>
                            {errors.summary_one && <div className="error" style={{ color: "red" }}>{errors.summary_one}</div>}
                          </div>

                          <div className="form-group mb-3" key="summary_two">
                            <Label htmlFor="summary_two" className="form-label">Summary For (B)</Label>
                            <Input type="text" id="summary_two" name="summary_two"  onChange={handleChange} value={formData.summary_two || ''}/>
                            {errors.summary_two && <div className="error" style={{ color: "red" }}>{errors.summary_two}</div>}
                          </div>

                          <div className="form-group mb-3" key="summary_three">
                            <Label htmlFor="summary_three" className="form-label">Summary For (C)</Label>
                            <Input type="text" id="summary_three" name="summary_three"  onChange={handleChange} value={formData.summary_three || ''}/>
                            {errors.summary_three && <div className="error" style={{ color: "red" }}>{errors.summary_three}</div>}
                          </div>

                          <div className="form-group mb-3" key="summary_four">
                            <Label htmlFor="summary_four" className="form-label">Summary For (D)</Label>
                            <Input type="text" id="summary_three" name="summary_four"  onChange={handleChange} value={formData.summary_four || ''}/>
                            {errors.summary_four && <div className="error" style={{ color: "red" }}>{errors.summary_four}</div>}
                          </div>
                        </Col>

                      </Row>

                      <div className="mt-4">
                        <Button color="success" className="btn btn-success w-10" type="submit"> Submit </Button>
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

};

export default EditObjective;