/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, Alert, Spinner, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useSelector, useDispatch } from "react-redux";

import { useParams, useNavigate } from "react-router-dom";

import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const ManageActivitie = () => {

  document.title ="Manage Activity | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [optionData, setOptionData] = useState([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {

    fetchOption();

    if(Id){
      fetchData();
    }else{
      populateFromData({
        title:""
      });
    }

    // eslint-disable-next-line
  }, []);


  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/activitie/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchOption = async () => {
    try {
      const category = await api.get(`${process.env.REACT_APP_API_URL}/activitie-category/get`);
      setOptionData(category.data);
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
    let FormDataObj = new FormData(event.target);
    // Validate the form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/activitie/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/activitie/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/activitie/master-list');
    }else{
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }

  };

  const validateForm = (data) => {
    const errors = {};
    // Example: Required validation
    if (!data.title.trim()) {
      errors.title = 'Activitie name is required';
    }

    if (!data.category) {
      errors.category = 'Category is required';
    }


    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Activities | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <BreadCrumb title="Manage Activities" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">


                      <div className="form-group mb-3" key="category">
                        <Label htmlFor="category" className="form-label">Category</Label>
                        <Input type="select"  id="category" name="category" onChange={handleChange} value={formData.category || ''} >
                          <option value="">Select</option>
                          {optionData && optionData.map((element, index) => (
                            <option key={index} value={element.id}>{element.title}</option>
                          ))}
                        </Input>
                        {errors.category && <div className="error" style={{ color: "red" }}>{errors.category}</div>}
                      </div>

                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Name</Label>
                        <Input type="text" id="title" name="title" maxLength="200"  onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>

                      <div className="form-group mb-3" key="image">
                        <Label htmlFor="image" className="form-label">Image</Label>
                        <Input type="file" id="image" name="image" onChange={handleChange}/>
                        {
                          // eslint-disable-next-line
                          (typeof formData.image === 'string' && formData.image && formData.image!=="" && formData.image!=="null")?<div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark"><img src={`${process.env.REACT_APP_MEDIA_URL}activitie/${formData.image}`} className="w-100" /></div>:null
                        }
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

export default ManageActivitie;