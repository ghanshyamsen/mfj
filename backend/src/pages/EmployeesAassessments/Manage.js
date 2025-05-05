/* eslint-disable no-unreachable */
import React , { useEffect, useState  } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, Alert, Spinner, UncontrolledAlert } from 'reactstrap';

import "primereact/resources/themes/lara-light-cyan/theme.css";

import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";

import { APIClient } from "../../helpers/api_helper";

import { MultiSelect } from 'primereact/multiselect';

const api = new APIClient();

//Employees Assessments
const Manage = () => {

  document.title ="Manage Employees Assessments| "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState([]);



  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {
    if(Id){
      fetchData();
    }else{
      populateFromData({});
    }
    // eslint-disable-next-line
  }, []);



  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/employees-assessments/get/${Id}`);
      if(response.status) {
        const dataArray = response.data;
        populateFromData(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Extract the key and index from the name
    const match = name.match(/(\w+)\[(\d+)\]/);

    if (match) {
      const key = match[1]; // e.g., "options"
      const index = parseInt(match[2], 10); // e.g., 0

      // Update the formData with the new value at the correct index
      setFormData(prevFormData => ({
        ...prevFormData,
        [key]: [
          ...prevFormData[key].slice(0, index), // Keep elements before the current index
          value, // Replace or add the new value at the current index
          ...prevFormData[key].slice(index + 1), // Keep elements after the current index
        ]
      }));
    } else {
      // Handle other cases if needed
      setFormData({ ...formData, [name]: value });
    }
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
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/employees-assessments/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/employees-assessments/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/employees-assessments');
    }else{
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }
  };


  const alfa = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const validateForm = (data) => {
    //
    const errors = {};
    // Example: Required validation
    if (!data.question || (data.question && !data.question.trim())) {
      errors.question = 'Question is required';
    }

    for(let i = 0; i < 4; i++){
      if (!data?.options?.[i] || (data?.options?.[i] && !data?.options?.[i].trim())) {
        if(!errors.options){
          errors.options = [];
        }
        errors.options[i] = `Option (${alfa[i]}) is required`;
      }
    }


    for(let i = 0; i < 4; i++){
      if (!data?.interpretation_guide?.[i] || (data?.interpretation_guide?.[i] && !data?.interpretation_guide?.[i].trim())) {

        if(!errors.interpretation_guide){
          errors.interpretation_guide = [];
        }

        errors.interpretation_guide[i] = `Interpretation (${alfa[i]}) is required`;
      }
    }

    return errors;
  };


  document.title = `Manage Employees Assessments | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <BreadCrumb title="Manage Employees Assessments" pageTitle="" />
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

                        <Col sm={6}>
                          {[0, 1, 2, 3, 4].map((index) => (
                            <div className="form-group mb-3" key={`option_${index}`}>
                              <Label htmlFor={`option_${index}`} className="form-label">
                                {`Option ${alfa[index]}`}
                              </Label>
                              <Input
                                type="text"
                                id={`options_${index}`}
                                name={`options[${index}]`}
                                onChange={handleChange}
                                value={formData?.options?.[index] || ''}
                              />
                              {errors?.options?.[`${index}`] && (
                                <div className="error" style={{ color: 'red' }}>
                                  {errors.options[`${index}`]}
                                </div>
                              )}
                            </div>
                          ))}
                        </Col>

                        <Col sm={6}>
                          {[0, 1, 2, 3, 4].map((index) => (
                            <div className="form-group mb-3" key={`points_${index}`}>
                              <Label htmlFor={`points_${index}`} className="form-label">
                                {`Interpretation ${alfa[index]}`}
                              </Label>
                              <Input
                                type="text"
                                id={`interpretation_guide${index}`}
                                name={`interpretation_guide[${index}]`}
                                onChange={handleChange}
                                value={formData?.interpretation_guide?.[index] || ''}
                              />
                              {errors?.interpretation_guide?.[`${index}`] && (
                                <div className="error" style={{ color: 'red' }}>
                                  {errors.interpretation_guide[`${index}`]}
                                </div>
                              )}
                            </div>
                          ))}
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


export default Manage;