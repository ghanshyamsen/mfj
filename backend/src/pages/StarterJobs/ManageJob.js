/* eslint-disable no-unreachable */
import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

import BreadCrumb from '../../Components/Common/BreadCrumb';

const api = new APIClient();

const ManageJob = () => {
  const { key: Id } = useParams();
  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    career_id: "",
    personality_type:"",
    job_title: "",
    personality_traits: "",
    soft_skills: "",
    required_skills: "",
    typical_career_path: {
      starter_job: "",
      mid_level: "",
      advanced: "",
      specializations: ""
    }
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [ptoptions, setPtOptions] = useState([]);


  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  };

  useEffect(() => {
    if (Id) {
      fetchData();
    } else {
      populateFromData({
        career_id: "",
        job_title: "",
        personality_traits: "",
        soft_skills: "",
        required_skills: "",
        typical_career_path: {
          starter_job: "",
          mid_level: "",
          advanced: "",
          specializations: ""
        }
      });
    }
    fetchOptions();
    fetchPtOptions();
  }, [Id]);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/starter-job/get/${Id}`);
      if (response.status === "success") {
        populateFromData(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/career/get`);
      if (response.status === "success") {
        setOptions(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPtOptions = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/personality-type/get`);
      if (response.status) {
        setPtOptions(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split('[').map(k => k.replace(']', ''));

    if (keys.length === 2) {
      setFormData(prevData => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    let response;
    if (Id) {
      response = await api.update(`${process.env.REACT_APP_API_URL}/starter-job/update/${Id}`, formData);
    } else {
      response = await api.create(`${process.env.REACT_APP_API_URL}/starter-job/create`, formData);
    }

    if (response.status) {
      window.notify('success', response.message);
      history('/starter-jobs');
    } else {
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const validateForm = (data) => {

    const errors = {};
    if (!data.career_id) {
      errors.career_id = 'Career is required';
    }

    if (!data.personality_type) {
      errors.personality_type = 'Personality type is required';
    }

    if (!data.job_title.trim()) {
      errors.job_title = 'Job title is required';
    }
    if (!data.personality_traits.trim()) {
      errors.personality_traits = 'Personality traits are required';
    }
    if (!data.soft_skills.trim()) {
      errors.soft_skills = 'Soft skills are required';
    }
    if (!data.required_skills.trim()) {
      errors.required_skills = 'Required skills are required';
    }

    // ----------------------------------------------------------------

    if (!data.typical_career_path.starter_job.trim()) {
      errors.starter_job = 'Starter job are required';
    }

    if (!data.typical_career_path.mid_level.trim()) {
      errors.mid_level = 'Mid Level are required';
    }

    if (!data.typical_career_path.advanced.trim()) {
      errors.advanced = 'Advanced are required';
    }

    if (!data.typical_career_path.specializations.trim()) {
      errors.specializations = 'Specializations are required';
    }

    return errors;
  };

  document.title = `Manage Starter Job | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <BreadCrumb title="Manage Starter Job" pageTitle="" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg ? (<UncontrolledAlert color="success" className="alert-top-border"><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      <div className="form-group mb-3">
                        <Label htmlFor="career_id" className="form-label">Career</Label>
                        <Input type="select" id="career_id" name="career_id" onChange={handleChange} value={formData.career_id || ''}>
                          <option value="">Select</option>
                          {options && options.map((element, index) => (
                            <option key={index} value={element.id}>{element.title}</option>
                          ))}
                        </Input>
                        {errors.career_id && <div className="error" style={{ color: "red" }}>{errors.career_id}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="personality_type" className="form-label">Personality Type</Label>
                        <Input type="select" id="personality_type" name="personality_type" onChange={handleChange} value={formData.personality_type || ''}>
                          <option value="">Select</option>
                          {ptoptions && ptoptions.map((element, index) => (
                            <option key={index} value={element.id}>{element.title}</option>
                          ))}
                        </Input>
                        {errors.personality_type && <div className="error" style={{ color: "red" }}>{errors.personality_type}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="job_title" className="form-label">Job Title</Label>
                        <Input type="text" id="job_title" name="job_title" maxLength="150" onChange={handleChange} value={formData.job_title || ''} />
                        {errors.job_title && <div className="error" style={{ color: "red" }}>{errors.job_title}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="personality_traits" className="form-label">Personality Traits</Label>
                        <Input type="text" id="personality_traits" name="personality_traits" maxLength="200" onChange={handleChange} value={formData.personality_traits || ''} />
                        {errors.personality_traits && <div className="error" style={{ color: "red" }}>{errors.personality_traits}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="soft_skills" className="form-label">Soft Skills</Label>
                        <Input type="text" id="soft_skills" name="soft_skills" maxLength="200" onChange={handleChange} value={formData.soft_skills || ''} />
                        {errors.soft_skills && <div className="error" style={{ color: "red" }}>{errors.soft_skills}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="required_skills" className="form-label">Required Skills</Label>
                        <Input type="text" id="required_skills" name="required_skills" maxLength="200" onChange={handleChange} value={formData.required_skills || ''} />
                        {errors.required_skills && <div className="error" style={{ color: "red" }}>{errors.required_skills}</div>}
                      </div>

                      {/* Nested typical_career_path fields */}
                      <h5 className="form-label">Typical Career Path</h5>
                      <hr/>
                      <div className="form-group mb-3">
                        <Label htmlFor="typical_career_path[starter_job]" className="form-label">Starter Job</Label>
                        <Input type="text" id="typical_career_path[starter_job]" name="typical_career_path[starter_job]" maxLength="200" onChange={handleChange} value={formData.typical_career_path.starter_job || ''} />
                        {errors.starter_job && <div className="error" style={{ color: "red" }}>{errors.starter_job}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="typical_career_path[mid_level]" className="form-label">Mid Level</Label>
                        <Input type="text" id="typical_career_path[mid_level]" name="typical_career_path[mid_level]" maxLength="200" onChange={handleChange} value={formData.typical_career_path.mid_level || ''} />
                        {errors.mid_level && <div className="error" style={{ color: "red" }}>{errors.mid_level}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="typical_career_path[advanced]" className="form-label">Advanced</Label>
                        <Input type="text" id="typical_career_path[advanced]" name="typical_career_path[advanced]" maxLength="200" onChange={handleChange} value={formData.typical_career_path.advanced || ''} />
                        {errors.advanced && <div className="error" style={{ color: "red" }}>{errors.advanced}</div>}
                      </div>

                      <div className="form-group mb-3">
                        <Label htmlFor="typical_career_path[specializations]" className="form-label">Specializations</Label>
                        <Input type="text" id="typical_career_path[specializations]" name="typical_career_path[specializations]" maxLength="200" onChange={handleChange} value={formData.typical_career_path.specializations || ''} />
                        {errors.specializations && <div className="error" style={{ color: "red" }}>{errors.specializations}</div>}
                      </div>

                      <Button color="primary" type="submit" className="waves-effect waves-light">Submit</Button>
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
