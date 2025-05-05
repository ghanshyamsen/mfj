/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Select, Button, Alert, Spinner, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";

import { APIClient } from "../../helpers/api_helper";

import JoditEditor from 'jodit-react';


const api = new APIClient();

const ManageEmails = () => {

  document.title ="Manage Emails | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [optionData, setOptionData] = useState([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  const editor = useRef(null);

  const config = useMemo(
		() => ({
      toolbarButtonSize: 'small',
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			//placeholder: 'Start typings...',
      toolbarAdaptive: false,
      toolbarSticky: false,
      buttons: [
        'source', '|',
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
        template_title:""
      });
    }


    // eslint-disable-next-line
  }, []);


  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/static/get-email/${Id}`);
      if(response.status) {
        const dataArray = response.data;
        populateFromData(dataArray);
      }else{
        window.notify('error',response.message);
        history('/email-list');
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
    let response;
    response =  await api.update(`${process.env.REACT_APP_API_URL}/static/update-email/${Id}`,FormDataObj);

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/email-list');
    }else{
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }

  };

  const validateForm = (data) => {
    const errors = {};
    // Example: Required validation
    if (!data.template_title.trim()) {
      errors.template_title = 'Title is required';
    }

    if (!data.template_subject.trim()) {
      errors.template_subject = 'Subject is required';
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Emails | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      <div className="form-group mb-3" key="template_title">
                        <Label htmlFor="template_title" className="form-label">Title</Label>
                        <Input type="text" id="template_title" name="template_title" maxLength="150"  onChange={handleChange} value={formData.template_title || ''}/>
                        {errors.template_title && <div className="error" style={{ color: "red" }}>{errors.template_title}</div>}
                      </div>


                      <div className="form-group mb-3" key="template_subject">
                        <Label htmlFor="template_subject" className="form-label">Subject</Label>
                        <Input type="text" id="template_subject" name="template_subject" maxLength="200"  onChange={handleChange} value={formData.template_subject || ''}/>
                        {errors.template_subject && <div className="error" style={{ color: "red" }}>{errors.template_subject}</div>}
                      </div>

                      <div className="form-group mb-3" key="template_content">
                        <Label htmlFor="template_content" className="form-label">Content</Label>
                        <JoditEditor
                          ref={editor}
                          value={formData.template_content || ''}
                          config={config}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) =>  setFormData({ ...formData, ['template_content']: newContent }) } // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => { setFormData({ ...formData, ['template_content']: newContent }) }}
                        />
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

export default ManageEmails;