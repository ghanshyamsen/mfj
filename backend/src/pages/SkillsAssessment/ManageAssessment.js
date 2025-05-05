/* eslint-disable no-unreachable */
import React , { useEffect, useState  } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, Alert, Spinner, UncontrolledAlert } from 'reactstrap';

import "primereact/resources/themes/lara-light-cyan/theme.css";

import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useSelector, useDispatch } from "react-redux";

import { useParams, useNavigate } from "react-router-dom";

import { APIClient } from "../../helpers/api_helper";

import { MultiSelect } from 'primereact/multiselect';

import './skill.css';


const api = new APIClient();

const ManageSkillAssessment = () => {

  document.title ="Manage Skills Assessment | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState([]);



  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {

    getSkills();

    if(Id){
      fetchData();
    }else{
      populateFromData({});
    }
    // eslint-disable-next-line
  }, []);


  const getSkills = async() => {
    let resp = await api.get(`${process.env.REACT_APP_API_URL}/skills/get`);
    setSkills(resp.data);
    return resp;
  }

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/skills-assessment/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
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
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/skills-assessment/manage/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/skills-assessment/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/skills/assessment-list');
    }else{
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }
  };

  const validateForm = (data) => {

    console.log(data);
    const errors = {};
    // Example: Required validation
    if (!data.question || (data.question && !data.question.trim())) {
      errors.question = 'Question is required';
    }
    if (!data.option_a || (data.option_a && !data.option_a.trim())) {
      errors.option_a = 'Option One is required';
    }
    if (!data.option_b || (data.option_b && !data.option_b.trim())) {
      errors.option_b = 'Option Two is required';
    }
    if (!data.option_c || (data.option_c && !data.option_c.trim())) {
      errors.option_c = 'Option Three is required';
    }
    if (!data.option_d || (data.option_d && !data.option_d.trim())) {
      errors.option_d = 'Option Four is required';
    }
    if (!data.points_a) {
      errors.points_a = 'Points One (A) is required';
    }
    if (!data.points_b) {
      errors.points_b = 'Points Two (B) is required';
    }
    if (!data.points_c) {
      errors.points_c = 'Points Three (C) is required';
    }
    if (!data.points_d) {
      errors.points_d = 'Points Four (D) is required';
    }

    if (data.skill_a.length <= 0) {
      errors.skill_a = 'Skills (A) is required';
    }
    if (data.skill_b <= 0) {
      errors.skill_b = 'Skills (B) is required';
    }
    if (data.skill_c <= 0) {
      errors.skill_c = 'Skills (C) is required';
    }
    if (data.skill_d <= 0) {
      errors.skill_d = 'Skills (D) is required';
    }
    // You can add more validation logic here

    return errors;
  };


  document.title = `Manage Assessments | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <BreadCrumb title="Manage Assessments" pageTitle="" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
                  {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                      <div className="form-group mb-3" key="question">
                        <Label htmlFor="question" className="form-label">Question</Label>
                        <Input type="text" id="question" name="question"  onChange={handleChange} value={formData.question || ''}/>
                        {errors.question && <div className="error" style={{ color: "red" }}>{errors.question}</div>}
                      </div>

                      <Row>

                        <Col sm={4}>
                          <div className="form-group mb-3" key="option_a">
                            <Label htmlFor="option_a" className="form-label">Option One (A)</Label>
                            <Input type="text" id="option_a" name="option_a"  onChange={handleChange} value={formData.option_a || ''}/>
                            {errors.option_a && <div className="error" style={{ color: "red" }}>{errors.option_a}</div>}
                          </div>

                          <div className="form-group mb-3" key="option_b">
                            <Label htmlFor="option_b" className="form-label">Option Two (B)</Label>
                            <Input type="text" id="option_b" name="option_b"  onChange={handleChange} value={formData.option_b || ''}/>
                            {errors.option_b && <div className="error" style={{ color: "red" }}>{errors.option_b}</div>}
                          </div>

                          <div className="form-group mb-3" key="option_c">
                            <Label htmlFor="option_c" className="form-label">Option Three (C)</Label>
                            <Input type="text" id="option_c" name="option_c"  onChange={handleChange} value={formData.option_c || ''}/>
                            {errors.option_c && <div className="error" style={{ color: "red" }}>{errors.option_c}</div>}
                          </div>

                          <div className="form-group mb-3" key="option_d">
                            <Label htmlFor="option_d" className="form-label">Option Four (D)</Label>
                            <Input type="text" id="option_d" name="option_d"  onChange={handleChange} value={formData.option_d || ''}/>
                            {errors.option_d && <div className="error" style={{ color: "red" }}>{errors.option_d}</div>}
                          </div>

                        </Col>

                        <Col sm={4}>
                          <div className="form-group mb-3" key="points_a">
                            <Label htmlFor="points_a" className="form-label">Points For (A)</Label>
                            <Input type="text" id="points_a" name="points_a"  onChange={handleChange} value={formData.points_a || ''}/>
                            {errors.points_a && <div className="error" style={{ color: "red" }}>{errors.points_a}</div>}
                          </div>

                          <div className="form-group mb-3" key="points_b">
                            <Label htmlFor="points_b" className="form-label">Points For (B)</Label>
                            <Input type="text" id="points_b" name="points_b"  onChange={handleChange} value={formData.points_b || ''}/>
                            {errors.points_b && <div className="error" style={{ color: "red" }}>{errors.points_b}</div>}
                          </div>

                          <div className="form-group mb-3" key="points_c">
                            <Label htmlFor="points_c" className="form-label">Points For (C)</Label>
                            <Input type="text" id="points_c" name="points_c"  onChange={handleChange} value={formData.points_c || ''}/>
                            {errors.points_c && <div className="error" style={{ color: "red" }}>{errors.points_c}</div>}
                          </div>

                          <div className="form-group mb-3" key="points_d">
                            <Label htmlFor="points_d" className="form-label">Points For (D)</Label>
                            <Input type="text" id="points_d" name="points_d"  onChange={handleChange} value={formData.points_d || ''}/>
                            {errors.points_d && <div className="error" style={{ color: "red" }}>{errors.points_d}</div>}
                          </div>
                        </Col>


                        <Col sm={4}>
                          <div className="form-group mb-3" key="points_a">
                            <Label htmlFor="points_a" className="form-label d-block">Skill For (A)</Label>

                            <MultiSelect
                              value={formData.skill_a || []}
                              onChange={(event) => setFormData({ ...formData, ['skill_a']: event.target.value })}
                              options={skills}
                              optionLabel="title"
                              optionValue ="id"
                              placeholder="Skill For (A)"
                              maxSelectedLabels={3} className="w-full md:w-20rem" />

                            {errors.skill_a && <div className="error" style={{ color: "red" }}>{errors.skill_a}</div>}
                          </div>

                          <div className="form-group mb-3" key="points_b ">
                            <Label htmlFor="points_b" className="form-label d-block">Skill For (B)</Label>

                            <MultiSelect
                              value={formData.skill_b || []} onChange={handleChange}
                              onChange={(event) => setFormData({ ...formData, ['skill_b']: event.target.value })}
                              options={skills}
                              optionLabel="title"
                              optionValue ="id"
                              placeholder="Skill For (B)"
                              maxSelectedLabels={3}
                              className="w-full md:w-20rem"
                            />
                            {errors.skill_b && <div className="error" style={{ color: "red" }}>{errors.skill_b}</div>}
                          </div>

                          <div className="form-group mb-3" key="skill_c">
                            <Label htmlFor="skill_c" className="form-label d-block">Skill For (C)</Label>
                            <MultiSelect
                              value={formData.skill_c || []}
                              onChange={(event) => setFormData({ ...formData, ['skill_c']: event.target.value })}
                              options={skills}
                              name="skill_c"
                              optionLabel="title"
                              optionValue ="id"
                              placeholder="Skill For (C)"
                              maxSelectedLabels={3}
                              className="w-full md:w-20rem"
                            />
                            {errors.skill_c && <div className="error" style={{ color: "red" }}>{errors.skill_c}</div>}
                          </div>

                          <div className="form-group mb-3" key="skill_d">
                            <Label htmlFor="skill_d" className="form-label d-block">Skill For (D)</Label>
                            <MultiSelect
                              value={formData.skill_d || []}
                              onChange={(event) => setFormData({ ...formData, ['skill_d']: event.target.value })}
                              options={skills}
                              name="skill_d"
                              optionLabel="title"
                              optionValue ="id"
                              placeholder="Skill For (D)"
                              maxSelectedLabels={3}
                              className="w-full md:w-20rem"
                            />
                            {errors.skill_d && <div className="error" style={{ color: "red" }}>{errors.skill_d}</div>}
                          </div>
                        </Col>

                      </Row>

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


export default ManageSkillAssessment;