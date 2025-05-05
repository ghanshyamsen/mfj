/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, Alert, Spinner, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useSelector, useDispatch } from "react-redux";

import { APIClient } from "../../helpers/api_helper";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const api = new APIClient();

const Config = () => {

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [editorData, setEditorData] = useState({});


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const populateFromData = async (dataArray) => {
    const defaultValues = {};
    dataArray.forEach((config) => {
      defaultValues[config.config_key] = config.config_value==="null" ? null : config.config_value;
    });

    setFormData(defaultValues);
    setData(dataArray);

    sessionStorage.removeItem("configData");
    sessionStorage.setItem("configData", JSON.stringify(defaultValues));
    localStorage.setItem("configData", JSON.stringify(defaultValues));
  }

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/config/get`);
      const dataArray = response.data;
      populateFromData(dataArray);
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
    FormDataObj.append('app_data_privacy_content',(editorData.app_data_privacy_content||formData['app_data_privacy_content']));
    FormDataObj.append('app_privacy_content',(editorData.app_privacy_content||formData['app_privacy_content']));

    const response =  await api.update(`${process.env.REACT_APP_API_URL}/config/update`,FormDataObj);
    // eslint-disable-next-line
    if(response.status === "success"){
      setSuccessMsg(response.message);
      window.notify('success',response.message);
      populateFromData(response.data);
      setTimeout(() => setSuccessMsg(''),5000);
    }else{
      window.notify('error',response.message);
      setErrorMsg(response.message);
      setTimeout(() => setErrorMsg(''),5000);
    }
  };

  document.title = `Config | ${process.env.REACT_APP_SITE_NAME}`;

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
                      {data.map((config) => (
                        <div className="form-group mb-3" key={config.config_key}>
                          <Label htmlFor={config.config_key} className="form-label">{config.config_name}</Label>
                          {
                            config.config_type ==='file'?
                            <Input type={config.config_type} id={config.config_key} name={config.config_key}  onChange={handleChange} />:
                            (config.config_type ==='editor'?
                              <CKEditor
                                  editor={ ClassicEditor }
                                  data={formData[config.config_key] || ''}
                                  onReady={ editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log( 'Editor is ready to use!', editor );
                                      setEditorData({...editorData, [config.config_key]:formData[config.config_key]});
                                  } }
                                  config={ {
                                    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
                                  } }
                                  onChange={ ( event , editor) => {
                                    setEditorData({...editorData, [config.config_key]:editor.getData()});
                                  }}
                              />
                              :<Input type={config.config_type} id={config.config_key} name={config.config_key}  onChange={handleChange} value={formData[config.config_key] || ''}/>
                            )
                          }
                          {
                            // eslint-disable-next-line
                            (config.config_type==='file' && config.config_value!=="" && config.config_value!=="null")?<div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark"><img src={`${process.env.REACT_APP_MEDIA_URL}logo/${config.config_value}`} className="w-100" /></div>:null
                          }
                        </div>
                      ))}
                      <div className="mt-4">
                        <Button color="success" className="btn btn-success w-10" type="submit">
                          Submit
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

export default Config;