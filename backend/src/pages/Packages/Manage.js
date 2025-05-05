/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const Manage = () => {

  document.title ="Manage Package | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

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

    if(Id){
      fetchData();
    }else{
      populateFromData({
        package_name:"",
        package_credits:"",
        package_price:"",
        package_popular:"",
        package_image:"",
        package_discount:"0"
      });
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/package/get/${Id}`);
      if(response.status) {
        const dataArray = response.data;
        populateFromData(dataArray);

      }else{
        history('/package/list');
        window.notify('error',response.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  function formatToTwoDecimalPlaces(number) {
    // Convert the number to a string
    const numberString = number.toString();

    // Check if the number has a decimal point
    if (numberString.includes('.')) {
        // Format to two decimal places
        let nnumber =  parseFloat(number);

        return (numberString.split('.')?.[1]?.length > 2)?nnumber.toFixed(2):nnumber;
    } else {
        // No decimal point, return as is or append ".00"
        return number; // Returns a string with ".00"
    }
  }

  function removeDecimal(num) {
    if (typeof num === 'number' || typeof num === 'string') {
      return Math.floor(num);
    } else {
      return num;
    }
  }

  const handleChange = (event) => {


    if(event.target.name ==='package_price' || event.target.name === 'package_discount'){
      event.target.value = (event.target.value?formatToTwoDecimalPlaces(event.target.value):'');
    }

    if(event.target.name ==='package_credits'){
      event.target.value = (event.target.value?removeDecimal(event.target.value):'');
    }

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

    let FormDataObj = new FormData(event.target);

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/package/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/package/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/package/list');
    }else{
      window.notify('error',response.message);
    }

  };

  const validateForm = (data) => {

    const errors = {};

    if (!data.package_image) {
      errors.package_image = 'Package image is required';
    }

    if (!data.package_name.trim()) {
      errors.package_name = 'Package name is required';
    }

    if (!data.package_credits|| data?.package_credits === 'e') {
      errors.package_credits = 'Package credit is required';
    }else{
      if(data.package_credits < 1 || data.package_credits > 100000){
        errors.package_credits = 'Value must be greater than 1 and lower than 100000';
      }
    }

    if (!data.package_price || data?.package_price === 'e') {
      errors.package_price = 'Package price is required';
    }else{
      if(data.package_price < 1 || data.package_price > 100000){
        errors.package_price = 'Value must be greater than 1 and lower than 100000';
      }
    }

    if (data.package_discount === '' || data?.package_discount === 'e') {
      errors.package_discount = 'Package discount is required';
    }else{
      if(data.package_discount < 0 || data.package_discount > 100){
        errors.package_discount = 'Value must be greater than 0 and lower than 100';
      }
    }


    if (data.package_popular==="") {
      errors.package_popular = 'Package popular is required';
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Package | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Package" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}

                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      <div className="form-group mb-3" key="image">
                        <Label htmlFor="package_image" className="form-label">Image</Label>
                        <Input type="file" id="package_image" name="package_image"  onChange={handleChange}/>
                        {errors.package_image && <div className="error" style={{ color: "red" }}>{errors.package_image}</div>}
                        {
                          // eslint-disable-next-line
                          (typeof formData.package_image === 'string' && formData.package_image && formData.package_image!=="" && formData.package_image!=="null")?
                            <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                              <img src={`${process.env.REACT_APP_MEDIA_URL}package/${formData.package_image}`} className="w-100" />
                            </div>:null
                        }
                      </div>

                      <div className="form-group mb-3" key="package_name">
                        <Label htmlFor="package_name" className="form-label">Package Name</Label>
                        <Input type="text" id="package_name" name="package_name" maxLength="150"  onChange={handleChange} value={formData.package_name || ''}/>
                        {errors.package_name && <div className="error" style={{ color: "red" }}>{errors.package_name}</div>}
                      </div>

                      <div className="form-group mb-3" key="package_credits">
                        <Label htmlFor="package_credits" className="form-label">Package Credits</Label>
                        <Input type="number" id="package_credits" name="package_credits"   onChange={handleChange} value={formData.package_credits || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.package_credits && <div className="error" style={{ color: "red" }}>{errors.package_credits}</div>}
                      </div>

                      <div className="form-group mb-3" key="package_price">
                        <Label htmlFor="package_price" className="form-label">Package Price</Label>
                        <Input type="number" id="package_price" name="package_price"   onChange={handleChange} value={formData.package_price || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.package_price && <div className="error" style={{ color: "red" }}>{errors.package_price}</div>}
                      </div>

                      <div className="form-group mb-3" key="package_discount">
                        <Label htmlFor="package_price" className="form-label">Package Discount</Label>
                        <Input type="number" id="package_discount" name="package_discount"   onChange={handleChange} value={formData.package_discount || '0'} onWheel={(e) => e.target.blur()}/>
                        {errors.package_discount && <div className="error" style={{ color: "red" }}>{errors.package_discount}</div>}
                      </div>



                      <div className="form-group mb-3" key="package_popular">
                        <Label htmlFor="package_popular" className="form-label">Package Popular</Label>
                        <Input
                          type="select"
                          id="package_popular"
                          name="package_popular"
                          onChange={handleChange}
                          value={formData.package_popular ?? ''}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </Input>
                        {errors.package_popular && (
                          <div className="error" style={{ color: "red" }}>{errors.package_popular}</div>
                        )}
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