/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


import JoditEditor from 'jodit-react';


const api = new APIClient();

const Manage = () => {

  document.title ="Manage Rank | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {
    if(Id){
      fetchData();
    }else{
      populateFromData({
        title:"",
        order:""
      });
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/rank/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
      }else{
        history('/rank/list');
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

    setIsSubmitting(true);

    let FormDataObj = new FormData(event.target);

    setErrors({});
    let response;

    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/rank/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/rank/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/rank/list');
    }else{
      window.notify('error',response.message);
      setIsSubmitting(false);
    }

  };

  function isFloat(n){
    const inputNumber = n;
    const isInteger = inputNumber % 1 === 0;
    return isInteger;
  }

  const validateForm = (data) => {
    const errors = {};

    if (!data?.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!data.order|| data?.order === 'e') {
      errors.order = 'Order is required';
    }else{
      if(data.order < 1 || data.order > 100 || !isFloat(data.order)){
        errors.order = 'Value must be greater than 1 and lower than 100';
      }
    }

    if (!data.path_count|| data?.path_count === 'e') {
      errors.path_count = 'Path number is required';
    }else{
      if(data.path_count < 0 || data.path_count > 100 || !isFloat(data.path_count)){
        errors.path_count = 'Value must be greater than 1 and lower than 100 and integer';
      }
    }

    if (!data.skill_count|| data?.skill_count === 'e') {
      errors.skill_count = 'Skill number is required';
    }else{
      if(data.skill_count < 0 || data.skill_count > 100 || !isFloat(data.skill_count)){
        errors.skill_count = 'Value must be greater than 1 and lower than 100 and integer';
      }
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Rank | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Rank" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}

                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      <div className="form-group mb-3" key="image">
                        <Label htmlFor="title" className="form-label">Image</Label>
                        <Input type="file" id="image" name="image"  onChange={handleChange}/>
                        {errors.image && <div className="error" style={{ color: "red" }}>{errors.image}</div>}
                        {
                          // eslint-disable-next-line
                          (typeof formData?.image === 'string' && formData?.image && formData?.image!=="" && formData?.image!=="null")?
                            <div style={{width:"100px"}} className="p-2 m-1 rounded-3 bg-dark">
                              <img src={`${process.env.REACT_APP_MEDIA_URL}rank/${formData.image}`} className="w-100" />
                            </div>:null
                        }
                      </div>

                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Title</Label>
                        <Input type="text" id="title" name="title" maxLength="250" onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>


                      <div className="form-group mb-3" key="order">
                        <Label htmlFor="order" className="form-label">Rank Order</Label>
                        <Input type="number" id="order" name="order" onChange={handleChange} value={formData.order || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.order && <div className="error" style={{ color: "red" }}>{errors.order}</div>}
                      </div>

                      <div className="form-group mb-3" key="path_count">
                        <Label htmlFor="path_count" className="form-label">Need to be Path</Label>
                        <Input type="number" id="path_count" name="path_count" onChange={handleChange} value={formData.path_count || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.path_count && <div className="error" style={{ color: "red" }}>{errors.path_count}</div>}
                      </div>


                      <div className="form-group mb-3" key="skill_count">
                        <Label htmlFor="skill_count" className="form-label">Need to be Skill</Label>
                        <Input type="number" id="skill_count" name="skill_count" onChange={handleChange} value={formData.skill_count || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.skill_count && <div className="error" style={{ color: "red" }}>{errors.skill_count}</div>}
                      </div>


                      <div className="mt-4">
                        <Button color="success" className="btn btn-success w-10" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin /> Submitting...
                            </>
                          ) : (
                            'Submit'
                          )}
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

};

export default Manage;