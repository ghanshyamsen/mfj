/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../../helpers/api_helper";

import JoditEditor from 'jodit-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const api = new APIClient();

const Manage = () => {

  document.title = `Manage Skill | ${process.env.REACT_APP_SITE_NAME}`;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([])

  const [pathlist, setPathList] = useState([]);
  const [skilllist, setSkillList] = useState([]);

  const [upsellingSkills, setUpsellingSkills] = useState([{ skill: '', discount: '' }]);
  const [upsellingPath, setUpsellingPath] = useState([{ path: '', discount: '' }]);

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
    getUpselling();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/lms/skill/get/${Id}`);
      if(response.status) {
        const dataArray = response.data;
        populateFromData(dataArray);

        if(dataArray.upselling_skills.length>0){
          setUpsellingSkills(dataArray.upselling_skills);
        }

        if(dataArray.upselling_path.length>0){
          setUpsellingPath(dataArray.upselling_path);
        }

      }else{
        history('/lms/skill/list');
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

    if(event.target.name ==='reward_price' || event.target.name === 'credit_price'){
      event.target.value = (event.target.value?formatToTwoDecimalPlaces(event.target.value):'');
    }

    if(event.target.name ==='expiration_period'){
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

    setIsSubmitting(true);

    let FormDataObj = new FormData(event.target);

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/lms/skill/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/lms/skill/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/lms/skill/list');
    }else{
      window.notify('error',response.message);
      setIsSubmitting(false);
    }

  };

  const validateForm = (data) => {

    const errors = {};

    if (!data.thumbnail) {
      errors.thumbnail = 'Thumbnail image is required';
    }

    if (!data.skill_logo) {
      errors.skill_logo = 'Skill logo is required';
    }

    if (!data.skill_badge) {
      errors.skill_badge = 'Skill badge is required';
    }

    if (!data.title?.trim()) {
      errors.title = 'Skill title is required';
    }

    if (!data.description?.trim()) {
      errors.description = 'Skill description is required';
    }

    if (!data.credit_price|| data?.credit_price === 'e') {
      errors.credit_price = 'Skill credit is required';
    }else{
      if(data.credit_price < 1 || data.credit_price > 100000){
        errors.credit_price = 'Value must be greater than 1 and lower than 100000';
      }
    }

    if (data?.reward_price === 'e') {
      errors.reward_price = 'Reward price is invalid.';
    }else{
      if(data.reward_price && (data.reward_price < 0 || data.reward_price > 100000)){
        errors.reward_price = 'Value must be greater than 0 and lower than 100000';
      }
    }

    if (!data.upselling || data.upselling?.length === 0) {
      //errors.upselling = 'Upselling is required';
    }

    if(upsellingSkills.length > 0){
      errors.upsellingskills = [];
      upsellingSkills.map((value, index) => {
        if(value.skill && !value.discount){
          errors['upsellingskills'][index]  = 'Discount is required.';
        }else{
          if(value.discount && (value.discount < 0 || value.discount > 100)){
            errors['upsellingskills'][index] = 'Value must be greater than 0 and lower than 100';
          }
        }
      });
    }

    if(upsellingPath.length > 0){
      errors.upsellingpath = [];
      upsellingPath.map((value, index) => {
        if(value.path && !value.discount){
          errors['upsellingpath'][index] = 'Discount is required.';
        }else{
          if(value.discount && (value.discount < 0 || value.discount > 100)){
            errors['upsellingpath'][index] = 'Value must be greater than 0 and lower than 100';
          }
        }
      });
    }

    /* if (!data.expiration_period) {
      errors.expiration_period = 'Expiration period is required';
    }else{
      if(data.expiration_period < 0 || data.expiration_period > 1000){
        errors.expiration_period = 'Value must be greater than 1 and lower than 1000';
      }
    } */

    if(data.video_link){
      //const urlRegex = /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-zA-Z0-9@:%._\+~#=]*)?(\?[;&a-zA-Z0-9%._\+~#=]*)?(#[a-zA-Z0-9-_]*)?$/;
      const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
      const isValidUrl = urlRegex.test(data.video_link);
      if(!isValidUrl){
        errors.video_link = 'Please enter a valid url.';
      }
    }

    if (errors.upsellingskills.length === 0) {
      delete errors.upsellingskills;
    }

    if (errors.upsellingpath.length === 0) {
      delete errors.upsellingpath;
    }

    // You can add more validation logic here
    return errors;
  };

  const getUpselling = async () => {
    const response = await api.get(Id?`${process.env.REACT_APP_API_URL}/lms/upselling/${Id}`:`${process.env.REACT_APP_API_URL}/lms/upselling`);
    if(response.status) {
     setPathList(response.path)
     setSkillList(response.skills)
    }
  }

  const addUpsellingSkill = () => {
    setUpsellingSkills([...upsellingSkills, { skill: '', discount: '' }]);
  };

  const addUpsellingPath = () => {
    setUpsellingPath([...upsellingPath, { path: '', discount: '' }]);
  };

  const handleChangeSkill = (index, field, value) => {
    const updatedSkills = [...upsellingSkills];
    updatedSkills[index][field] = (field === 'discount' && value)?formatToTwoDecimalPlaces(value):value;
    setUpsellingSkills(updatedSkills);
  };

  const handleChangePath = (index, field, value) => {
    const updatedPaths = [...upsellingPath];
    updatedPaths[index][field] = (field === 'discount' && value)?formatToTwoDecimalPlaces(value):value;
    setUpsellingPath(updatedPaths);
  };

  const removeUpsellingSkill = (index) => {
    setUpsellingSkills(upsellingSkills.filter((_, i) => i !== index));
  };

  const removeUpsellingPath = (index) => {
    setUpsellingPath(upsellingPath.filter((_, i) => i !== index));
  };

  document.title = `Manage Skill | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Skill" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      {/* <div className="form-group mb-3" key="order">
                        <Label htmlFor="order" className="form-label">Order</Label>
                        <Input type="number" id="order" name="order" onChange={handleChange} value={formData.order || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.order && <div className="error" style={{ color: "red" }}>{errors.order}</div>}
                      </div> */}

                      <Row>
                        <Col xs={12} sm={4}>
                          <div className="form-group mb-3" key="thumbnail">
                            <Label htmlFor="thumbnail" className="form-label">Thumbnail</Label>
                            <Input type="file" id="thumbnail" name="thumbnail"  onChange={handleChange}/>
                            {errors.thumbnail && <div className="error" style={{ color: "red" }}>{errors.thumbnail}</div>}
                            {
                              // eslint-disable-next-line
                              (typeof formData.thumbnail === 'string' && formData.thumbnail && formData.thumbnail!=="" && formData.thumbnail!=="null")?
                                <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                                  <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${formData.thumbnail}`} className="w-100" />
                                </div>:null
                            }
                          </div>
                        </Col>

                        <Col xs={12} sm={4}>
                          <div className="form-group mb-3" key="skill_logo">
                            <Label htmlFor="skill_logo" className="form-label">Skill Logo</Label>
                            <Input type="file" id="skill_logo" name="skill_logo"  onChange={handleChange}/>
                            {errors.skill_logo && <div className="error" style={{ color: "red" }}>{errors.skill_logo}</div>}
                            {
                              // eslint-disable-next-line
                              (typeof formData.skill_logo === 'string' && formData.skill_logo && formData.skill_logo!=="" && formData.skill_logo!=="null")?
                                <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                                  <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${formData.skill_logo}`} className="w-100" />
                                </div>:null
                            }
                          </div>
                        </Col>

                        <Col xs={12} sm={4}>
                          <div className="form-group mb-3" key="skill_badge">
                            <Label htmlFor="skill_badge" className="form-label">Skill Badge</Label>
                            <Input type="file" id="skill_badge" name="skill_badge"  onChange={handleChange}/>
                            {errors.skill_badge && <div className="error" style={{ color: "red" }}>{errors.skill_badge}</div>}
                            {
                              // eslint-disable-next-line
                              (typeof formData.skill_badge === 'string' && formData.skill_badge && formData.skill_badge!=="" && formData.skill_badge!=="null")?
                                <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                                  <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${formData.skill_badge}`} className="w-100" />
                                </div>:null
                            }
                          </div>
                        </Col>
                      </Row>

                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Skill Title</Label>
                        <Input type="text" id="title" name="title" maxLength="150" onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>

                      <div className="form-group mb-3" key="credit_price">
                        <Label htmlFor="credit_price" className="form-label">Credit Price</Label>
                        <Input type="number" id="credit_price" name="credit_price" onChange={handleChange} value={formData.credit_price || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.credit_price && <div className="error" style={{ color: "red" }}>{errors.credit_price}</div>}
                      </div>

                      <div className="form-group mb-3" key="reward_price">
                        <Label htmlFor="reward_price" className="form-label">Reward Price</Label>
                        <Input type="number" id="reward_price" name="reward_price" onChange={handleChange} value={formData.reward_price || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.reward_price && <div className="error" style={{ color: "red" }}>{errors.reward_price}</div>}
                      </div>

                      <>
                        <div className="form-group mb-3">
                          {upsellingSkills.map((upsellingSkill, index) => (
                            <Row key={index}>
                              <Col xs={12} sm={5}>
                                <div className="form-group mb-3">
                                  <Label htmlFor={`upselling_skill_${index}`} className="form-label">Upselling Skill</Label>
                                  <Input
                                    type="select"
                                    name={`upselling_skills[${index}][skill]`}
                                    value={upsellingSkill.skill}
                                    onChange={(e) => handleChangeSkill(index, 'skill', e.target.value)}
                                  >
                                    <option value="">Select</option>
                                    {skilllist.map((skill) => (
                                      <option key={skill._id} value={skill._id}>{skill.title}</option>
                                    ))}
                                  </Input>
                                </div>
                              </Col>

                              <Col xs={12} sm={5}>
                                <div className="form-group mb-3">
                                  <Label htmlFor={`upselling_discount_${index}`} className="form-label">Upselling Discount</Label>
                                  <Input
                                    type="number"
                                    name={`upselling_skills[${index}][discount]`}
                                    value={upsellingSkill.discount}
                                    onChange={(e) => handleChangeSkill(index, 'discount', e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                  />
                                  {errors.upsellingskills?.[0] && <div className="error" style={{ color: "red" }}>{errors.upsellingskills?.[0]}</div>}
                                </div>
                              </Col>
                              {upsellingSkills.length > 1 && <Col xs={12} sm={2} className="d-flex align-items-center">
                                <Button color="danger" onClick={() => removeUpsellingSkill(index)}>Remove</Button>
                              </Col>}
                            </Row>
                          ))}

                          <Button color="primary" onClick={addUpsellingSkill}>Add More</Button>
                        </div>
                      </>

                      <>
                        <div className="form-group mb-3">
                          {upsellingPath.map((upsellingPathItem, index) => (
                            <Row key={index}>
                              <Col xs={12} sm={5}>
                                <div className="form-group mb-3">
                                  <Label htmlFor={`upselling_path_${index}`} className="form-label">Upselling Path</Label>
                                  <Input
                                    type="select"
                                    name={`upselling_path[${index}][path]`}
                                    value={upsellingPathItem.path}
                                    onChange={(e) => handleChangePath(index, 'path', e.target.value)}
                                  >
                                    <option value="">Select</option>
                                    {pathlist.map((path) => (
                                      <option key={path._id} value={path._id}>{path.title}</option>
                                    ))}
                                  </Input>
                                </div>
                              </Col>

                              <Col xs={12} sm={5}>
                                <div className="form-group mb-3">
                                  <Label htmlFor={`upselling_discount_${index}`} className="form-label">Upselling Discount</Label>
                                  <Input
                                    type="number"
                                    name={`upselling_path[${index}][discount]`}
                                    value={upsellingPathItem.discount}
                                    onChange={(e) => handleChangePath(index, 'discount', e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                  />
                                  {errors.upsellingpath?.[0] && <div className="error" style={{ color: "red" }}>{errors.upsellingpath?.[0]}</div>}
                                </div>
                              </Col>
                              {upsellingPath.length > 1 && <Col xs={12} sm={2} className="d-flex align-items-center">
                                <Button color="danger" onClick={() => removeUpsellingPath(index)}>Remove</Button>
                              </Col>}
                            </Row>
                          ))}

                          <Button color="primary" onClick={addUpsellingPath}>Add More</Button>
                        </div>
                      </>

                      {/* <div className="form-group mb-3" key="expiration_period">
                        <Label htmlFor="expiration_period" className="form-label">Expiration Period (In Days)</Label>
                        <Input type="number" id="expiration_period" name="expiration_period" onChange={handleChange} value={formData.expiration_period || ''} onWheel={(e) => e.target.blur()}/>
                        {errors.expiration_period && <div className="error" style={{ color: "red" }}>{errors.expiration_period}</div>}
                      </div> */}

                      <div className="form-group mb-3" key="description">
                        <Label htmlFor="expiration_period" className="form-label">Skill Description</Label>
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

                      <div className="form-group mb-3" key="video_link">
                        <Label htmlFor="video_link" className="form-label">Video Link</Label>
                        <Input type="text" id="video_link" name="video_link" maxLength="500" onChange={handleChange} value={formData.video_link || ''}/>
                        {errors.video_link && <div className="error" style={{ color: "red" }}>{errors.video_link}</div>}
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