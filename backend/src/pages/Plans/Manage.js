/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

import JoditEditor from 'jodit-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const api = new APIClient();

const Manage = () => {

  document.title = `Manage Plan | ${process.env.REACT_APP_SITE_NAME}`;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
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
      populateFromData({});
    }

  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/plan/get/${Id}`);
      if(response.status) {

        const dataArray = response.data;
        populateFromData(dataArray);

      }else{
        history('/plan/list');
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

    if(event.target.name ==='plan_price'){
      event.target.value = (event.target.value?formatToTwoDecimalPlaces(event.target.value):'');
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

    setIsSubmitting(true);

    let FormDataObj = new FormData(event.target);

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/plan/update/${Id}`,formData);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/plan/create`,formData);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/plan/list/'+formData.plan_for);
    }else{
      window.notify('error',response.message);
      setIsSubmitting(false);
    }

  };

  const validateForm = (data) => {

    const errors = {};

    if (!data.plan_name?.trim()) {
      errors.plan_name = 'Plan name is required';
    }

    if (!data.plan_title?.trim()) {
      errors.plan_title = 'Plan title is required';
    }

    /* if (!data.plan_price_text?.trim()) {
      errors.plan_price_text = 'Plan price text is required';
    } */

    /* if (!data.plan_description?.trim()) {
      errors.plan_description = 'Plan description is required';
    } */

    if (data.plan_price==='' || data?.plan_price === 'e') {
      errors.plan_price = 'Plan price is required';
    }else{
      if(data.plan_price < 0 || data.plan_price > 100000){
        errors.plan_price = 'Value must be greater than 1 and lower than 100000';
      }
    }


    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Plan | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Plan" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      {/* <div className="form-group mb-3" key="plan_key">
                        <Label htmlFor="plan_key" className="form-label">Plan Key</Label>
                        <Input type="select" id="plan_key" name="plan_key" onChange={handleChange} value={formData.plan_key || ''} >
                          <option value="">Select</option>

                          <option value="cover_letter">Cover Letter</option>
                          <option value="resume_template">Resume Template</option>
                          <option value="guidance_counselor">Guidance Counselor</option>
                          <option value="life_time_access">Life Time Access</option>
                          <option value="lms_access">Lms Access</option>
                          <option value="all_feature_access">All Feature Access</option>

                          <option value="free_plan">Free Plan</option>
                          <option value="pro_plan">Pro Plan</option>
                          <option value="premium_plan">Premium Plan</option>
                          <option value="enterprise_plan">Enterprise Plan</option>
                        </Input>
                        {errors.plan_key && <div className="error" style={{ color: "red" }}>{errors.plan_key}</div>}
                      </div>

                      <div className="form-group mb-3" key="plan_for">
                        <Label htmlFor="plan_for" className="form-label">Plan For</Label>
                        <Input type="select" id="plan_for" name="plan_for" onChange={handleChange} value={formData.plan_for || ''} >
                          <option value="">Select</option>
                          <option value="student">Student</option>
                          <option value="employer">Employer</option>
                        </Input>
                        {errors.plan_for && <div className="error" style={{ color: "red" }}>{errors.plan_for}</div>}
                      </div> */}

                      <div className="form-group mb-3" key="plan_name">
                        <Label htmlFor="plan_name" className="form-label">Plan Name</Label>
                        <Input type="text" id="plan_name" name="plan_name" maxLength="150" onChange={handleChange} value={formData.plan_name || ''}/>
                        {errors.plan_name && <div className="error" style={{ color: "red" }}>{errors.plan_name}</div>}
                      </div>

                      <div className="form-group mb-3" key="plan_title">
                        <Label htmlFor="plan_title" className="form-label">Plan Title</Label>
                        <Input type="text" id="plan_title" name="plan_title"  maxLength="250" onChange={handleChange} value={formData.plan_title || ''}/>
                        {errors.plan_title && <div className="error" style={{ color: "red" }}>{errors.plan_title}</div>}
                      </div>

                      <div className="form-group mb-3" key="plan_price">
                        <Label htmlFor="plan_price" className="form-label">Plan Price</Label>
                        <Input type="number" id="plan_price" name="plan_price" onChange={handleChange} value={formData?.plan_price!==""?formData?.plan_price:''} onWheel={(e) => e.target.blur()}/>
                        {errors.plan_price && <div className="error" style={{ color: "red" }}>{errors.plan_price}</div>}
                      </div>



                      <div className="form-group mb-3" key="plan_price_text">
                        <Label htmlFor="plan_price_text" className="form-label">Plan Price Text</Label>
                        <Input type="text" id="plan_price_text" name="plan_price_text"  maxLength="250" onChange={handleChange} value={formData.plan_price_text || ''}/>
                        {errors.plan_price_text && <div className="error" style={{ color: "red" }}>{errors.plan_price_text}</div>}
                      </div>


                      {formData.plan_for === 'employer' &&
                        <>
                          <hr/>

                          {formData.plan_key!=='enterprise_plan' && <div className="form-group mb-3" key="plan_job">
                            <Label htmlFor="plan_job" className="form-label">Plan Job (Active job at time)</Label>
                            <Input type="number" id="plan_job" name="plan_job" onChange={handleChange} value={formData?.plan_job!==""?formData?.plan_job:''} onWheel={(e) => e.target.blur()}/>
                            {errors.plan_job && <div className="error" style={{ color: "red" }}>{errors.plan_job}</div>}
                          </div>}

                          <div className="form-group mb-3" key="plan_analytics">
                            <Label htmlFor="plan_analytics" className="form-label">All Analytics</Label>
                            <Input type="select" id="plan_analytics" name="plan_analytics" onChange={handleChange} value={formData.plan_analytics || ''} >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Input>
                            {errors.plan_analytics && <div className="error" style={{ color: "red" }}>{errors.plan_analytics}</div>}
                          </div>

                          <div className="form-group mb-3" key="plan_matches">
                            <Label htmlFor="plan_matches" className="form-label">Check Your Matches</Label>
                            <Input type="select" id="plan_matches" name="plan_matches" onChange={handleChange} value={formData.plan_matches || ''} >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Input>
                            {errors.plan_matches && <div className="error" style={{ color: "red" }}>{errors.plan_matches}</div>}
                          </div>

                          <div className="form-group mb-3" key="plan_boosted">
                            <Label htmlFor="plan_boosted" className="form-label">Boosted Automatically</Label>
                            <Input type="select" id="plan_boosted" name="plan_boosted" onChange={handleChange} value={formData.plan_boosted || ''} >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Input>
                            {errors.plan_boosted && <div className="error" style={{ color: "red" }}>{errors.plan_boosted}</div>}
                          </div>
                        </>
                      }



                      <div className="form-group mb-3" key="plan_description">
                        <Label htmlFor="plan_description" className="form-label">Plan Description</Label>
                        <JoditEditor
                          ref={editor}
                          value={formData.plan_description || ''}
                          config={config}
                          name="plan_description"
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) =>  setFormData({ ...formData, ['plan_description']: newContent }) } // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => { setFormData({ ...formData, ['plan_description']: newContent }) }}
                        />
                        {errors.plan_description && <div className="error" style={{ color: "red" }}>{errors.plan_description}</div>}
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