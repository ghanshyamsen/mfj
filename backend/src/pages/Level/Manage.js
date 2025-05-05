/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { MultiSelect } from 'primereact/multiselect';



import JoditEditor from 'jodit-react';


const api = new APIClient();

const Manage = () => {

  document.title ="Manage Level | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [pathlist, setPathList] = useState([]);

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

    getPaths();
  }, []);

  const getPaths = async () => {
    const response = await api.get(Id?`${process.env.REACT_APP_API_URL}/lms/upselling/${Id}`:`${process.env.REACT_APP_API_URL}/lms/upselling`);
    if(response.status) {
      setPathList(response.path)
    }
  }

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/level/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
      }else{
        history('/level/list');
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
      response =  await api.update(`${process.env.REACT_APP_API_URL}/level/update/${Id}`,formData);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/level/create`,formData);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/level/list');
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

    if (!data?.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!data?.title?.trim()) {
      errors.title = 'Title is required';
    }

    /* if (!data.order|| data?.order === 'e') {
      errors.order = 'Order is required';
    }else{
      if(data.order < 1 || data.order > 100 || !isFloat(data.order)){
        errors.order = 'Value must be greater than 1 and lower than 100';
      }
    } */

    if (!data.price|| data?.price === 'e') {
      errors.price = 'Credit price is required';
    }else{
      if(data.price < 1 || data.price > 100000){
        errors.price = 'Value must be greater than 1 and lower than 100000';
      }
    }

    if(data.paths.length <= 0){
      errors.paths = 'Paths is required';
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Level | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Level" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}

                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      {/* <div className="form-group mb-3" key="order">
                        <Label htmlFor="order" className="form-label">Order</Label>
                        <Input type="number" id="order" name="order" onChange={handleChange} value={formData.order || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.order && <div className="error" style={{ color: "red" }}>{errors.order}</div>}
                      </div> */}

                      <div className="form-group mb-3" key="name">
                        <Label htmlFor="name" className="form-label">Name</Label>
                        <Input type="text" id="name" name="name" maxLength="100" onChange={handleChange} value={formData.name || ''}/>
                        {errors.name && <div className="error" style={{ color: "red" }}>{errors.name}</div>}
                      </div>

                      <div className="form-group mb-3" key="paths">
                        <Label htmlFor="paths" className="form-label">Paths</Label>
                        <MultiSelect
                          value={formData.paths || []}
                          onChange={(event) => setFormData({ ...formData, ['paths']: event.target.value })}
                          options={pathlist||[]}
                          optionLabel="title"
                          optionValue ="_id"
                          placeholder="Select"
                          maxSelectedLabels={3}
                          name="paths"
                          className="w-full md:w-20rem"
                        />
                        {errors.paths && <div className="error" style={{ color: "red" }}>{errors.paths}</div>}
                      </div>

                      <div className="form-group mb-3" key="price">
                        <Label htmlFor="price" className="form-label">Credit Price</Label>
                        <Input type="number" id="price" name="price" onChange={handleChange} value={formData.price || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.price && <div className="error" style={{ color: "red" }}>{errors.price}</div>}
                      </div>

                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Title</Label>
                        <Input type="text" id="title" name="title" maxLength="250" onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>

                      <div className="form-group mb-3" key="description">
                        <Label htmlFor="description" className="form-label">Description</Label>
                        <Input rows="6" type="textarea" id="description" name="description" maxLength="500" onChange={handleChange} value={formData.description || ''}/>
                        {errors.description && <div className="error" style={{ color: "red" }}>{errors.description}</div>}
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