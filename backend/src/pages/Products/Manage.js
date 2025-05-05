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

  document.title ="Manage Product | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useRef(null);

  const config = useMemo(
		() => ({
      toolbarButtonSize: 'small',
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			placeholder: '',
      toolbarAdaptive: false,
      toolbarSticky: false,
      buttons: [
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', 'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'image', 'table', 'link', '|',
        'align', 'undo', 'redo', '|',
        'hr', 'eraser'
      ],
      statusbar: false
		}),
		[]
	);

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
        category:"",
        description:""
      });
    }

    fetchOptions();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/product/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
      }else{
        history('/product/list');
        window.notify('error',response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOptions = async () => {
    let response = await api.get(`${process.env.REACT_APP_API_URL}/product/category/get`);

    if(response.status){
      setOptions(response.data);
    }
  }

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
      response =  await api.update(`${process.env.REACT_APP_API_URL}/product/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/product/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/product/list');
    }else{
      window.notify('error',response.message);
      setIsSubmitting(false);
    }

  };

  const validateForm = (data) => {
    const errors = {};

    if (!data?.image) {
      errors.image = 'Image is required';
    }

    if (!data?.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!data?.category?.trim()) {
      errors.category = 'Category is required';
    }

    if (!data?.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!data.price|| data?.price === 'e') {
      errors.price = 'Credit is required';
    }else{
      if(data.price < 1 || data.price > 100000){
        errors.price = 'Value must be greater than 1 and lower than 100000';
      }
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Product  | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Product" pageTitle="" />
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
                            <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                              <img src={`${process.env.REACT_APP_MEDIA_URL}product/${formData.image}`} className="w-100" />
                            </div>:null
                        }
                      </div>

                      <div className="form-group mb-3" key="category">
                        <Label htmlFor="category" className="form-label">Category</Label>
                        <Input type="select"  id="category" name="category" onChange={handleChange} value={formData.category || ''} >
                          <option value="">Select</option>
                          {options && options.map((element, index) => (
                            <option key={index} value={element.id}>{element.title}</option>
                          ))}
                        </Input>
                        {errors.category && <div className="error" style={{ color: "red" }}>{errors.category}</div>}
                      </div>

                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Title</Label>
                        <Input type="text" id="title" name="title" maxLength="250" onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>


                      <div className="form-group mb-3" key="price">
                        <Label htmlFor="price" className="form-label">Credit Price</Label>
                        <Input type="number" id="price" name="price" onChange={handleChange} value={formData.price || ''} onWheel={(e) => e.target.blur()}  />
                        {errors.price && <div className="error" style={{ color: "red" }}>{errors.price}</div>}
                      </div>

                      <div className="form-group mb-3" key="description">

                        <JoditEditor
                          ref={editor}
                          value={formData.description || ''}
                          config={config}
                          name="description"
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) =>  setFormData({ ...formData, ['description']: newContent }) } // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => { setFormData({ ...formData, ['description']: newContent }) }}
                        />

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