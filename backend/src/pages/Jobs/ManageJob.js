/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const api = new APIClient();

const ManageJob = () => {

  document.title ="Manage Job | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  const [editorData, setEditorData] = useState('');


  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {

    if(Id){
      fetchData();
    }else{
      populateFromData({
        user_id:"",
        job_position:"",
        orgnaization:"",
        job_descrition:"",
        job_min_amount:"",
        job_max_amount:""
      });
    }

    fetchOptions();
  }, []);



  const fetchOptions = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/user/get/0/manager`);
      if(response.status === "success") {
        const dataArray = response.data;
        setOptions(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/job/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);

      }else{
        history('/job/master-list');
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

    let FormDataObj = new FormData(event.target);
    FormDataObj.append('job_descrition',editorData);
    // let FormDataObj = formData;
    // FormDataObj.job_descrition = editorData;


    // Validate the form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/job/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/job/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/job/master-list');
    }else{
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }

  };

  const validateForm = (data) => {
    const errors = {};

    // Example: Required validation
    if (!data.user_id) {
      errors.employer = 'Employer is required';
    }

    if (!data.job_position.trim()) {
      errors.job_position = 'Job position is required';
    }

    if (!data.orgnaization.trim()) {
      errors.orgnaization = 'Orgnaization is required';
    }

    if (!data.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!data.job_min_amount) {
      errors.job_min_amount = 'Job min amount is required';
    }

    if (!data.job_max_amount) {
      errors.job_max_amount = 'Job max amount is required';
    }

    if(data.job_min_amount && data.job_max_amount && (data.job_min_amount > data.job_max_amount)){
      errors.job_max_amount = 'Job max amount must be greater than min amount.';
    }

    if (!editorData) {
      errors.job_descrition = 'Job description is required';
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Job | ${process.env.REACT_APP_SITE_NAME}`;

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

                      <div className="form-group mb-3" key="user_id">
                        <Label htmlFor="user_id" className="form-label">Employers</Label>
                        <Input type="select"  id="user_id" name="user_id" onChange={handleChange} value={formData.user_id || ''} >
                          <option value="">Select</option>
                          {options && options.map((element, index) => (
                            <option key={index} value={element.id}>{element.name}</option>
                          ))}
                        </Input>
                        {errors.employer && <div className="error" style={{ color: "red" }}>{errors.employer}</div>}
                      </div>

                      <div className="form-group mb-3" key="logo">
                        <Label htmlFor="logo" className="form-label">Image</Label>
                        <Input type="file" id="logo" name="logo" onChange={handleChange}/>
                        {
                          // eslint-disable-next-line
                          (typeof formData.logo === 'string' && formData.logo && formData.logo!=="" && formData.logo!=="null")?<div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark"><img src={`${formData.logo}`} className="w-100" /></div>:null
                        }
                      </div>

                      <div className="form-group mb-3" key="job_position">
                        <Label htmlFor="job_position" className="form-label">Job Position</Label>
                        <Input type="text" id="job_position" name="job_position" maxLength="150"  onChange={handleChange} value={formData.job_position || ''}/>
                        {errors.job_position && <div className="error" style={{ color: "red" }}>{errors.job_position}</div>}
                      </div>

                      <div className="form-group mb-3" key="orgnaization">
                        <Label htmlFor="orgnaization" className="form-label">Organization</Label>
                        <Input type="text" rows="6" id="orgnaization" name="orgnaization" maxLength="150"  onChange={handleChange} value={formData.orgnaization || ''}/>
                        {errors.orgnaization && <div className="error" style={{ color: "red" }}>{errors.orgnaization}</div>}
                      </div>

                      <div className="form-group mb-3" key="location">
                        <Label htmlFor="location" className="form-label">Location</Label>
                        <Input type="text" rows="6" id="location" name="location" maxLength="150"  onChange={handleChange} value={formData.location || ''}/>
                        {errors.location && <div className="error" style={{ color: "red" }}>{errors.location}</div>}
                      </div>

                      <div className="form-group mb-3" key="job_min_amount">
                        <Label htmlFor="job_min_amount" className="form-label">Min Amount ($)</Label>
                        <Input type="number" rows="6" id="job_min_amount" name="job_min_amount" maxLength="200"  onChange={handleChange} value={formData.job_min_amount || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.job_min_amount && <div className="error" style={{ color: "red" }}>{errors.job_min_amount}</div>}
                      </div>


                      <div className="form-group mb-3" key="job_max_amount">
                        <Label htmlFor="job_max_amount" className="form-label">Max Amount ($)</Label>
                        <Input type="number" rows="6" id="job_max_amount" name="job_max_amount" maxLength="200"  onChange={handleChange} value={formData.job_max_amount || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.job_max_amount && <div className="error" style={{ color: "red" }}>{errors.job_max_amount}</div>}
                      </div>

                      <CKEditor
                        editor={ ClassicEditor }
                        data={formData.job_descrition || ''}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            //console.log( 'Editor is ready to use!', editor );
                            setEditorData(formData.job_descrition);
                        } }
                        config={ {
                          toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
                        } }
                        onChange={ ( event , editor) => {
                          setEditorData(editor.getData());
                        }}
                      />
                      {errors.job_descrition && <div className="error" style={{ color: "red" }}>{errors.job_descrition}</div>}

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

export default ManageJob;