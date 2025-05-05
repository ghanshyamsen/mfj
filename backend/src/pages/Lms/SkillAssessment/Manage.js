/* eslint-disable no-unreachable */
import React , { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';

import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../../helpers/api_helper";

import { MultiSelect } from 'primereact/multiselect';

import JoditEditor from 'jodit-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const api = new APIClient();

const Manage = () => {

  document.title = `Manage Skill Assessment | ${process.env.REACT_APP_SITE_NAME}`;

  const { key:Id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const skill = urlParams.get('skill');

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([])
  const [skills, setSkills] = useState([])
  const [questions, setQuestions] = useState([
    { question: "", options: ["",""],  answer:"" }
  ])

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
      populateFromData({skill:skill});
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
      const response = await api.get(`${process.env.REACT_APP_API_URL}/lms/assessment/get/${Id}`);
      if(response.status) {
        const dataArray = response.data;
        populateFromData(dataArray);
        setQuestions(dataArray.questions);

      }else{
        history('/lms/skill-assessment/list');
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
      window.scrollToError();
      return;
    }

    setIsSubmitting(true);

    let FormDataObj = new FormData(event.target);

    setErrors({});
    let response;
    if(Id){
      response =  await api.update(`${process.env.REACT_APP_API_URL}/lms/assessment/update/${Id}`,FormDataObj);
    }else{
      response =  await api.create(`${process.env.REACT_APP_API_URL}/lms/assessment/create`,FormDataObj);
    }

    // eslint-disable-next-line
    if(response.status){
      window.notify('success',response.message);
      history('/lms/skill-assessment/list');
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

    if (!data.skill) {
      errors.skills = 'Skills is required';
    }

    data.questions = questions;
    // Validate questions array
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      errors.questions = 'At least one question is required';
    } else {
      data.questions.forEach((question, index) => {
        // Initialize question error object if it doesn't exist
        if (!errors.questions) errors.questions = [];

        // Validate each question
        const questionErrors = {};
        if (!question.question?.trim()) {
          questionErrors.question = 'Question text is required';
        }
        if (!Array.isArray(question.options) || question.options.length < 2) {
          questionErrors.options = 'At least two options are required';
        } else if (question.options.some(option => !option.trim())) {
          questionErrors.options = 'All options must be non-empty';
        }

        if (!question.answer?.trim()) {
          questionErrors.answer = 'Answer is required';
        } else if (!question.options.includes(question.answer.trim())) {
          questionErrors.answer = 'Answer must match one of the options';
        }

        // Add question errors if any
        if (Object.keys(questionErrors).length > 0) {
          errors.questions[index] = questionErrors;
        }
      });
    }

    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }


    if(errors?.questions.length === 0){
      delete errors.questions;
    }


    // You can add more validation logic here
    return errors;
  };

  const removeQuestions = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      // Remove the option from the specific question
      updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);

      return updatedQuestions;
    });
  };

  const addQuestions = () => {
    setQuestions(() => [
      ...questions,
      { question: "", options: ["",""],  answer:"" }
    ])
  }

  const addMoreOption = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].options.push(""); // Add an empty option
      return updatedQuestions;
    });
  }

  const handleChangeQuestion = (index, key, value, subindex = "") => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      // Handle update for the main question or answer
      if (key === "question") {
        updatedQuestions[index].question = value;
      } else if (key === "answer") {
        updatedQuestions[index].answer = value;
      }

      // Handle update for the options array
      else if (key === "options" && subindex !== "") {
        updatedQuestions[index].options[subindex] = value; // Update the specific option
      }

      return updatedQuestions;
    });
  };

  document.title = `Manage Skill Assessment | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Skill Assessment" pageTitle="" />
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
                              <img src={`${process.env.REACT_APP_MEDIA_URL}lms/assessment/${formData.thumbnail}`} className="w-100" />
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

                      <div className="form-group mb-3" key="description">
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
                      </div>


                      <>
                        <div className="form-group mb-3">
                          {questions.map((value, index) => (
                            <div style={{border:'1px solid #e3e3e3',padding: '30px'}}  key={index}>
                              <Row>

                                <Col xs={11} sm={11}>
                                  <div className="form-group mb-3">
                                    <Label htmlFor={`questions_${index}`} className="form-label">Question {index+1}</Label>
                                    <Input
                                      type="text"
                                      name={`questions[${index}][question]`}
                                      value={value.question}
                                      onChange={(e) => handleChangeQuestion(index, 'question', e.target.value)}
                                    />
                                    {errors.questions?.[index]?.question && <div className="error" style={{ color: "red" }}>{errors.questions?.[index].question}</div>}
                                  </div>
                                </Col>


                                {questions.length > 1 && <Col xs={1} sm={1} className="d-flex align-items-center">
                                  <Button color="danger" onClick={() => removeQuestions(index)}>Remove</Button>
                                </Col>}


                                <Col xs={8} sm={8}>
                                  <div className="p-3">
                                    {
                                      value.options.map((subvalue, subindex) => (
                                        <div className="form-group mb-3" key={`option_${index+subindex}`}>
                                          <Label htmlFor={`option_${index}`} className="form-label d-flex justify-content-between">
                                            Option {subindex+1} {value.options?.length > 2 && <span style={{cursor:"pointer",color:"red"}} onClick={() => { removeOption(index, subindex) }}>X</span>}
                                          </Label>
                                          <Input
                                            type="text"
                                            name={`questions[${index}][options][${subindex}]`}
                                            value={subvalue}
                                            onChange={(e) => handleChangeQuestion(index, 'options', e.target.value, subindex)}
                                          />
                                        </div>
                                      ))
                                    }
                                    {errors.questions?.[index]?.options && <div className="error" style={{ color: "red" }}>{errors.questions?.[index].options}</div>}
                                    <Button color="primary" onClick={() => { addMoreOption(index) }}>Add More Option</Button>
                                  </div>
                                </Col>

                                <Col xs={8} sm={8}>
                                  <div className="form-group mb-3">
                                    <Label htmlFor={`questions_${index}`} className="form-label">Answer</Label>
                                    <Input
                                      type="select"
                                      name={`questions[${index}][answer]`}
                                      value={value.answer}
                                      onChange={(e) => handleChangeQuestion(index, 'answer', e.target.value)}
                                    >
                                      <option value="">Select</option>
                                      { value.options.map(value => ( value && <option value={value} key={value}>{value}</option> ))}
                                    </Input>
                                    {errors.questions?.[index]?.answer && <div className="error" style={{ color: "red" }}>{errors.questions?.[index].answer}</div>}
                                  </div>
                                </Col>

                              </Row>
                            </div>
                          ))}
                        </div>

                        <Button color="primary" onClick={addQuestions}>Add More Questions</Button>
                      </>

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