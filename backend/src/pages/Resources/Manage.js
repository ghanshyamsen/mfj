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

  document.title ="Manage Article | "+process.env.REACT_APP_SITE_NAME;

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
        for_user:"manager",
        category:"",
        brief_description:"",
        type: 'internal',
        description:""
      });
    }

    fetchOptions();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/article/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
      }else{
        history('/articles/list');
        window.notify('error',response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOptions = async () => {
    let response = await api.get(`${process.env.REACT_APP_API_URL}/article/category/get`);

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
      response =  await api.update(`${process.env.REACT_APP_API_URL}/article/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/article/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/articles/list');
    }else{
      window.notify('error',response.message);
      setIsSubmitting(false);
    }

  };

  const validateForm = (data) => {
    const errors = {};

    if (!data?.title?.trim()) {
      errors.title = 'Title is required';
    }


    if (!data?.for_user?.trim()) {
      errors.for_user = 'User type is required';
    }

    if (!data?.category?.trim()) {
      errors.category = 'Category is required';
    }

    if (!data?.brief_description?.trim()) {
      errors.brief_description = 'Bried description is required';
    }


    if (data?.type === 'internal' && !data?.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (data?.type === 'external') {
      if(!data?.url?.trim()){
        errors.url = 'Link is required';
      }else{
        const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
        const isValidUrl = urlRegex.test(data?.url);
        if(!isValidUrl){
          errors.url = 'Please enter a valid url.';
        }
      }
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Article | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Article" pageTitle="" />
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
                          (typeof formData.image === 'string' && formData.image && formData.image!=="" && formData.image!=="null")?
                            <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                              <img src={`${process.env.REACT_APP_MEDIA_URL}article/${formData.image}`} className="w-100" />
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

                      <div className="form-group mb-3" key="for_user">
                        <Label htmlFor="for_user" className="form-label">User Type</Label>
                        <Input type="select"  id="for_user" name="for_user" onChange={handleChange} value={formData.for_user || ''} >
                          <option value="">Select</option>
                          <option value="manager">Employer</option>
                          <option value="teenager">Student</option>
                          <option value="parents">Parent</option>
                        </Input>
                        {errors.for_user && <div className="error" style={{ color: "red" }}>{errors.for_user}</div>}
                      </div>




                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Title</Label>
                        <Input type="text" id="title" name="title" maxLength="250" onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>

                      <div className="form-group mb-3" key="brief_description">
                        <Label htmlFor="brief_description" className="form-label">Brief Description</Label>
                        <Input  type="textarea" rows="3" id="brief_description" name="brief_description" maxLength="150"  onChange={handleChange} value={formData.brief_description || ''}/>
                        {errors.brief_description && <div className="error" style={{ color: "red" }}>{errors.brief_description}</div>}
                      </div>


                      <div className="form-group mb-3" key="type">
                        <Label htmlFor="type" className="form-label">Type</Label>
                        <Input type="select"  id="type" name="type" onChange={handleChange} value={formData.type || 'internal'} >
                          <option value="">Select</option>
                          <option value="internal">Internal</option>
                          <option value="external">External</option>
                        </Input>
                        {errors.type && <div className="error" style={{ color: "red" }}>{errors.type}</div>}
                      </div>


                      {formData.type ==='internal' && <div className="form-group mb-3" key="description">

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
                      </div>}

                     {formData.type ==='external' && <div className="form-group mb-3" key="url">
                        <Label htmlFor="url" className="form-label">External Link</Label>
                        <Input type="text" id="url" name="url" maxLength="500" onChange={handleChange} value={formData.url || ''}/>
                        {errors.url && <div className="error" style={{ color: "red" }}>{errors.url}</div>}
                      </div>}

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