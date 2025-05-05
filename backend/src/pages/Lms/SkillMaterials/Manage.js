/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../../helpers/api_helper";
import axios from 'axios';

import { MultiSelect } from 'primereact/multiselect';

import JoditEditor from 'jodit-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const api = new APIClient();

const Manage = () => {

  document.title = `Manage Learning Material | ${process.env.REACT_APP_SITE_NAME}`;

  const { key:Id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const skill = urlParams.get('skill');
  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  //const [files, setFiles] = useState([])
  const [skills, setSkills] = useState([])
  const [ext, setExt] = useState('.zip')
  const [file, setFile] = useState(null);

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
        'source', '|','bold', 'italic', 'underline', '|',
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
      populateFromData({skill:skill,type:'content'});
    }

    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/lms/skill/get`);
      if(response.status) {
        const dataArray = response.data;
        setSkills(dataArray);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/lms/material/get/${Id}`);
      if(response.status) {
        const dataArray = response.data;
        populateFromData(dataArray);

      }else{
        history('/lms/learning-material/list');
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
    if (event.target.type === 'file') {

      const file = event.target.files[0];

      if (!validateFileByType(file, formData.type)) {
        const expectedExt = getExpectedExtension(formData.type);
        if(expectedExt){
          window.notify('error',`Invalid file type. Expected a ${expectedExt} file.`);
          return;
        }
      }

      setFormData({ ...formData, [event.target.name]: file });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }

  };

  const getExpectedExtension = (type) => {
    switch (type) {
      case 'html': return '.zip';
      case 'pdf': return '.pdf';
      case 'video': return '.mp4';
      default: return null;
    }
  };

  const validateFileByType = (file, type) => {
    if (!file || !type) return false;

    const expectedExt = getExpectedExtension(type);
    if (!expectedExt) return false;

    const actualExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    return actualExt === expectedExt;
  };

  useEffect(() => {
    switch (formData.type) {
      case 'html': setExt('.zip'); break;
      case 'pdf': setExt('.pdf'); break;
      case 'video': setExt('.mp4'); break;
    }
  },[formData.type])

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

    if(formData.type === 'video' && formData.material_media){
      //await handleUpload(formData.material_media);
    }


    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/lms/material/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/lms/material/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/lms/learning-material/list');
    }else{
      window.notify('error',response.message);
      setIsSubmitting(false);
    }

  };


  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

  const handleUpload = async (file) => {

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex);
      formData.append('totalChunks', totalChunks);
      formData.append('filename', file.name);

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/chunk/upload`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          console.error(`Chunk ${chunkIndex} upload failed`);
          throw new Error('Upload failed');
        }

        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded`);

      } catch (err) {
        alert(`Upload failed on chunk ${chunkIndex}`);
        break;
      }
    }

    alert('Upload complete!');
  };

  const validateForm = (data) => {

    const errors = {};

    if (!data.thumbnail) {
      errors.thumbnail = 'Thumbnail image is required';
    }

    if (!data.skill) {
      errors.skills = 'Skills is required';
    }

    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }

    // You can add more validation logic here
    return errors;
  };

  document.title = `Manage Learning Material | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Learning Material" pageTitle="" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">

                      <div className="form-group mb-3">
                        <Label htmlFor='Skill' className="form-label">Skill</Label>
                        <Input
                          type="select"
                          name='skill'
                          value={formData.skill||skill||''}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {skills.map((skill) => (
                            <option key={skill.id} value={skill.id}>{skill.title}</option>
                          ))}
                        </Input>
                        {errors.skills && <div className="error" style={{ color: "red" }}>{errors.skills}</div>}
                      </div>

                      <div className="form-group mb-3" key="thumbnail">
                        <Label htmlFor="thumbnail" className="form-label">Thumbnail</Label>
                        <Input type="file" id="thumbnail" name="thumbnail"  onChange={handleChange}/>
                        {errors.thumbnail && <div className="error" style={{ color: "red" }}>{errors.thumbnail}</div>}
                        {
                          // eslint-disable-next-line
                          (typeof formData.thumbnail === 'string' && formData.thumbnail && formData.thumbnail!=="" && formData.thumbnail!=="null")?
                            <div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark">
                              <img src={`${process.env.REACT_APP_MEDIA_URL}lms/material/${formData.thumbnail}`} className="w-100" />
                            </div>:null
                        }
                      </div>

                      <div className="form-group mb-3" key="title">
                        <Label htmlFor="title" className="form-label">Title</Label>
                        <Input type="text" id="title" name="title" maxLength="150" onChange={handleChange} value={formData.title || ''}/>
                        {errors.title && <div className="error" style={{ color: "red" }}>{errors.title}</div>}
                      </div>

                      <div className="form-group mb-3" key="brief_description">
                        <Label htmlFor="brief_description" className="form-label">Brief Description</Label>
                        <Input type="text" id="brief_description" name="brief_description" maxLength="150" onChange={handleChange} value={formData.brief_description || ''}/>
                        {errors.brief_description && <div className="error" style={{ color: "red" }}>{errors.brief_description}</div>}
                      </div>


                      <div className="form-group mb-3">
                        <Label htmlFor='Type' className="form-label">Type</Label>
                        <Input
                          type="select"
                          name='type'
                          value={formData.type||'content'}
                          onChange={handleChange}
                        >
                          <option value="content">Content</option>
                          <option value="html">Zip</option>
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                        </Input>
                        {errors.type && <div className="error" style={{ color: "red" }}>{errors.type}</div>}
                      </div>

                      {['html'].includes(formData.type) && <div className="form-group mb-3" key="content_media">
                        <Label htmlFor="content_media" className="form-label">Media Content</Label>
                        <Input type="file" id="content_media" name="content_media" accept={ext}  onChange={handleChange}/>
                        {errors.content_media && <div className="error" style={{ color: "red" }}>{errors.content_media}</div>}
                        {
                          // eslint-disable-next-line
                          (typeof formData.content_media === 'string' && formData.content_media && formData.content_media!=="" && formData.content_media!=="null")?
                            <div style={{width:"350px"}} className="p-2 m-1 rounded-3 bg-light">
                              <b>{formData.content_media}:</b>  <a href={`${process.env.REACT_APP_MEDIA_URL}lms/material/${formData.content_media}`} download>Download</a>
                            </div>:null
                        }
                      </div>}

                      {['pdf','video'].includes(formData.type) && <div className="form-group mb-3" key="material_media">
                        <Label htmlFor="material_media" className="form-label">Media Content</Label>
                        <Input type="file" id="material_media" name="material_media" accept={ext}  onChange={handleChange}/>
                        {errors.material_media && <div className="error" style={{ color: "red" }}>{errors.material_media}</div>}
                        {
                          // eslint-disable-next-line
                          (typeof formData.material_media === 'string' && formData.material_media && formData.material_media!=="" && formData.material_media!=="null")?
                            <div style={{width:"350px"}} className="p-2 m-1 rounded-3 bg-light">
                              <b>{formData.material_media}:</b>  <a href={`${process.env.REACT_APP_MEDIA_URL}lms/material/${formData.material_media}`} download>Download</a>
                            </div>:null
                        }
                      </div>}

                      {['content', 'video'].includes(formData.type) &&  <div className="form-group mb-3" key="description">
                        <Label htmlFor="description" className="form-label">Description</Label>
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