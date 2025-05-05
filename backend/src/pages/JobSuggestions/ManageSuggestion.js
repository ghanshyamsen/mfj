/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const Manage = () => {

  document.title ="Manage Suggestion | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);


  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {

    if(Id){
      fetchData();
    }else{
      populateFromData({
        job_category:"",
        job_title:"",
        job_description:""
      });
    }

    getOptions()
  }, []);

  const getOptions = async () => {

    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/job/category/get`);
      if(response.status) {
        const dataArray = response.data;
        setOptions(dataArray);
      }else{
        window.notify('error',response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/job/suggestion/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);

      }else{
        history('/job/suggestions');
        window.notify('error',response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    if (event.target.type === 'file') {
      setFormData({ ...formData, [event.target.name]: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit =  async (event) => {
    event.preventDefault();

    // Validate the form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/job/suggestion/update/${Id}`,formData);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/job/suggestion/create`,formData);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/job/suggestions');
    }else{
      window.notify('error',response.message);
    }

  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.job_category) {
      errors.job_category = 'Job category is required';
    }

    if (!data.job_title.trim()) {
      errors.job_title = 'Job title is required';
    }

    // if (!data.job_description.trim()) {
    //   errors.job_description = 'Job description is required';
    // }

    // You can add more validation logic here
    return errors;
  };


  document.title = `Manage Job | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Suggestion" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}

                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      <div className="form-group mb-3" key="job_category">
                        <Label htmlFor="job_category" className="form-label">Job Category</Label>
                        <Input type="select" id="job_category" name="job_category" maxLength="150"  onChange={handleChange} value={formData.job_category || ''}>
                          <option value="">Select</option>
                          {
                            options?.map(value => (<option value={value.id} key={value.id}>{value.title}</option>))
                          }
                        </Input>
                        {errors.job_category && <div className="error" style={{ color: "red" }}>{errors.job_category}</div>}
                      </div>

                      <div className="form-group mb-3" key="job_title">
                        <Label htmlFor="job_title" className="form-label">Job Title</Label>
                        <Input type="text" id="job_title" name="job_title" maxLength="150"  onChange={handleChange} value={formData.job_title || ''}/>
                        {errors.job_title && <div className="error" style={{ color: "red" }}>{errors.job_title}</div>}
                      </div>

                      <div className="form-group mb-3" key="job_description">
                        <Label htmlFor="job_description" className="form-label">Job Description</Label>
                        <Input  type="textarea" rows="20" id="job_description" name="job_description" maxLength="5000"  onChange={handleChange} value={formData.job_description || ''}/>
                        {errors.job_description && <div className="error" style={{ color: "red" }}>{errors.job_description}</div>}
                      </div>

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