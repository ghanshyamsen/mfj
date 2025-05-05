import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import QuestionTwo from './QuestionTwo';
import QuestionThree from './QuestionThree';
import QuestionFour from './QuestionFour';
import QuestionFive from './QuestionFive';
import QuestionSix from './QuestionSix';
import QuestionSeven from './QuestionSeven';
import Review from './Review';
import Dropdown from 'react-bootstrap/Dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';
import Books from '../../../assets/images/Books.svg';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

import { Modal } from 'react-bootstrap';

import { useProfile } from '../../../ProfileContext';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Calendar } from 'primereact/calendar'
function Education() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();
    const [currentStep, setCurrentStep] = useState(1);
    const [education, setEducation] = useState([]);
    const [educationList, setEducationList] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ismove, setIsMove] = useState(false);
    const [showListing, setSetListing] = useState(true);
    const [educationInfo, setEducationInfo] = useState([]);
    const [editeducation, setEditEducation] = useState({});
    const [editIndex, setEditIndex] = useState('');
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('token');

    const handleSubmit = () => {
        if(education.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Education');
        }
        navigate(EditUrl||'/dashboard');
    };


    const goDashboardPage = () => {
        if(educationList.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Education');
        }
        navigate(EditUrl||'/dashboard');
    };

    // Function to update or add an object at a specific index
    const updateOrAddObjectAtIndex = (index, newObject) => {
        setEducation((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;
            return newArray;
        });
    };

    const updateOrdering = (index, newObject) => {
        setEducationList((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;

            return newArray;
        });
    };

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };


        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {

            if(result.status === 'S'){
                if(result.data.education_complete_status){
                    setEducationList(result.data.education);
                }else{
                    setSetListing(false);
                }

                setLoading(true);
            }else{
                window.showToast("Please complete your personal details first.","error");
                navigate('/dashboard');
            }

        })
        .catch((error) => console.error(error.message));

    },[])

    useEffect(() => {
        if(ismove){
            updateResume()
        }
    },[educationList]);

    const updateResume = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            education:educationList
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status=='S'){
                if(!ismove){
                    //goDashboardPage();
                }
            }
        })
        .catch((error) => console.error(error));
    }

    const moveHigher = (key) =>{

        let currentKey = key;
        let upperKey = (key-1);
        let currentArray = educationList[key];
        let upperArray = educationList[(key-1)];

        updateOrdering(upperKey,currentArray);
        updateOrdering(currentKey,upperArray);
        setIsMove(true);
    }

    const formattedEducationList = () =>  {
        return educationList.map((education, index) => (
            <div className='education_info' key={index}>
                {education.map((value, i) => (
                    i === 0 ? (
                        <div className='info_title' key={i}>
                            <h2>{value.answer}</h2>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                    <img src={Dots} alt="" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {index > 0 && <Dropdown.Item onClick={() => { moveHigher(index) }}>Move higher</Dropdown.Item>}
                                    <Dropdown.Item onClick={() => { EditEducationForm(index, education) }}>Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{
                                        setEditIndex(index)
                                        setShowAlert(true)
                                    }}> Delete </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    ) : null
                ))}

                {education.map((value, i) => {
                    switch (value.question_tag) {
                        case 'college_degree':
                            return value.answer && <p className='it-text' key={i}>{value.answer}</p>;
                        case 'study_field':
                            return value.answer && <p className='it-text' key={i}>{value.answer}</p>;
                        case 'graduation_start_year':
                            return null;
                        case 'graduation_end_year':
                            return <p className='id-text' key={i}>{window.formatDate(education.find(e => e.question_tag === 'graduation_start_year')?.answer)} - {window.formatDate(education.find(e => e.question_tag === 'graduation_end_year')?.answer)}</p>;
                        case 'gpa':
                            return <p className='id-text' key={i}>Grade {value.answer}</p>;
                        case 'education_description':
                            return value.answer && <p className='it-text' key={i}>{value.answer}</p>;
                        default:
                            return null;
                    }
                })}
            </div>
        ));
    }

    const EditEducationForm = (index, education) => {
        setEducationInfo(education);
        setEditIndex(index);
        setShowModal(true);
        const obj = education.reduce((acc, education) => {
            acc[education.question_tag] = education.answer;
            return acc;
        }, {});
        setEditEducation(obj);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };



    const handleChange = (e) => {
        if(e.target.name === "graduation_start_year" || e.target.name === "graduation_end_year"){
            e.target.value = e.target.value?window.formatmdyDate(e.target.value):'';
        }
        setEditEducation({...editeducation, [e.target.name]: e.target.value});

        setEducationInfo(educationInfo.map(education => {
            if (education.question_tag === e.target.name) {
                return {
                    ...education,
                    answer: e.target.value,
                    [education.question_tag]: e.target.value
                };
            }
            return education;
        }))
    }

    const validated = (data) => {

        const errors = {};
        if(!data.school_name.trim()){
           errors.school_name = "Please enter school name.";
        }

        if(!data.graduation_start_year){
            errors.graduation_start_year = "Please select start year.";
        }

        if(!data.graduation_end_year){
            errors.graduation_end_year = "Please select end year.";
        }

        if(data.graduation_start_year && data.graduation_end_year && (new Date((data.graduation_start_year)) > new Date((data.graduation_end_year)))){
            errors.graduation_end_year = "End date must be greater than start date.";
        }

        return errors;
    }

    const showPicker = (e) => {
       if( e.target.name === "graduation_start_year" || e.target.name === "graduation_end_year"){
            // Your logic for showing the date picker
            return e.target.showPicker();
       }
    };

    const editSave = () => {
        const validate = validated(editeducation);
        if(Object.keys(validate).length > 0){
            setErrors(validate);
            return;
        }

        setEducationList(prevEducationList => {
            const newEducationList = [...prevEducationList];
            newEducationList[editIndex] = educationInfo;
            return newEducationList;
        });

        setShowModal(false);
        setIsMove(true);
    }

    const deleteEdu = (Index=false) => {

        setEducationList(prevEducationList => {
            const newEducationList = [...prevEducationList];
            newEducationList.splice((Index||editIndex), 1);
            return newEducationList;
        });

        //window.showToast(result.message,"success");

        setIsMove(true);
        setShowModal(false);
        setShowAlert(false);

    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            <div className="objectives-and-summary-page resume_infomation_moduals">
                <Container>
                    {loading && showListing && <div className='dcb_block'>
                        <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>
                        <div className='heading_row'>
                            <h1 className='rim_heading'> Education </h1>
                        </div>
                        <div className='add_more_content_block'>
                            <button className='add_education' onClick={()=> setSetListing(false)}> <img src={Plus} alt="" /> <span> Add education </span> </button>
                            {formattedEducationList()}
                        </div>
                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn mb-2' onClick={goDashboardPage}>Save and exit</button>
                        </div>
                    </div>}

                    {loading && !showListing && <div className='dcb_block'>
                        <div className='heading_row'>
                            {currentStep === 8 ? (
                                <h1 className='rim_heading'> Review </h1>
                            ) : (
                                <span className='mcount'>{currentStep}/7</span>
                            )}
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>

                        <Wizard startIndex={index}>
                            <QuestionOne
                                GoNextStep={() => setCurrentStep(2)}
                                goDashboardPage={goDashboardPage}
                                education={education[0]}
                                setEducation={updateOrAddObjectAtIndex}
                            />
                            <QuestionTwo
                                GoBackStep={() => setCurrentStep(1)}
                                GoNextStep={() => setCurrentStep(3)}
                                education={education[1]}
                                setEducation={updateOrAddObjectAtIndex}
                            />
                            <QuestionThree
                                GoBackStep={() => setCurrentStep(2)}
                                GoNextStep={() => setCurrentStep(4)}
                                education={education[2]}
                                setEducation={updateOrAddObjectAtIndex}
                            />
                            <QuestionFour
                                GoBackStep={() => setCurrentStep(3)}
                                GoNextStep={() => setCurrentStep(5)}
                                education={education[3]}
                                setEducation={updateOrAddObjectAtIndex}
                            />
                            <QuestionFive
                                GoBackStep={() => setCurrentStep(4)}
                                GoNextStep={() => setCurrentStep(6)}
                                education={education[4]}
                                setEducation={updateOrAddObjectAtIndex}
                                last={education[3]}
                            />
                            <QuestionSix
                                GoBackStep={() => setCurrentStep(5)}
                                GoNextStep={() => setCurrentStep(7)}
                                education={education[5]}
                                setEducation={updateOrAddObjectAtIndex}
                            />
                            <QuestionSeven
                                GoBackStep={() => setCurrentStep(6)}
                                GoNextStep={() => setCurrentStep(8)}
                                education={education[6]}
                                setEducation={updateOrAddObjectAtIndex}
                            />
                            <Review
                                handleSubmit={handleSubmit}
                                setStep={(key) => setCurrentStep(key)}
                                education={education}
                            />
                        </Wizard>
                    </div>}
                </Container>
            </div>

            {/* Model */}

            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={deleteEdu}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                The record will get deleted.
            </SweetAlert>

            <Modal className={`edit_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'>Edit education</h1>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <form>

                            {
                                educationInfo && educationInfo.map((education,index) => (
                                    education.question_tag === "education_description" ?
                                    <FloatingLabel key={index} controlId="floatingdesc" label={education.label} className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name={education.question_tag}
                                            value={education.answer}
                                            onChange={handleChange}
                                            placeholder=""
                                            maxLength="300"
                                        />
                                        <p className="phone_Text"> {education.answer.length}/300 </p>
                                    </FloatingLabel>

                                    :
                                        (
                                            (education.question_tag === "graduation_start_year" || education.question_tag === "graduation_end_year")?
                                            <>
                                                <FloatLabel key={index} className="mb-3">
                                                    <Calendar
                                                        name={education.question_tag}
                                                        value={education.answer?new Date(window.parseDateString(education.answer)):''}
                                                        onChange={handleChange}
                                                        maxLength="25"
                                                        dateFormat="mm/yy"
                                                        placeholder=''
                                                        maxDate={education.question_tag==='graduation_start_year'?new Date():''}
                                                        view="month"
                                                    />
                                                    {education.question_tag === "graduation_start_year" && <label htmlFor={education.question_tag}> Education Start Year <span className='required'>*</span></label>}
                                                    {education.question_tag === "graduation_end_year" && <label htmlFor={education.question_tag}> Education End Year <span className='required'>*</span></label>}
                                                </FloatLabel>
                                                {education.question_tag === "graduation_start_year" && errors.graduation_start_year && <small className='error' style={{color:"red"}}>{errors.graduation_start_year}</small>}
                                                {education.question_tag === "graduation_end_year" && errors.graduation_end_year && <small className='error' style={{color:"red"}}>{errors.graduation_end_year}</small>}
                                             </>
                                            :
                                            <FloatingLabel key={index} controlId={education.label} label={<>{education.label} <span className="required">*</span></>} className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name={education.question_tag}
                                                    value={education.answer}
                                                    onChange={handleChange}
                                                    onClick={showPicker}
                                                    placeholder=""
                                                />
                                                {education.question_tag === "school_name" && errors.school_name && <small className='error' style={{color:"red"}}>{errors.school_name}</small>}
                                            </FloatingLabel>
                                        )



                                ))
                            }
                            <div className='btn_block mt-5'>
                                <button type="button" className='btn submit_btn back-button' onClick={()=>{setShowAlert(true)}}> Delete </button>
                                <button type="button" onClick={editSave} className='btn submit_btn'> Save </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/*  */}

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    {/* <Modal.Title>Education</Modal.Title> */}
                    <div className='icons'>
                        <img src={Books} alt="" />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <div className="make_resume_content_block">
                            <div className="make_resume_content">
                                <h2 className="mrc_heading"> Welcome to the Education Section </h2>
                                <p className="src_desc"> Your education is a crucial building block for your future career. Employers look at your educational background to understand your level of knowledge and skills in certain areas. </p>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> How It Works </h2>
                                <ul className="">
                                    <li> You’ll enter details about your education, including schools attended, courses taken, and any relevant information. </li>
                                    <li> This section shows employers your commitment to learning and growth, especially if you’re applying for your first job. </li>
                                    <li> Even without work experience, showcasing your education can highlight your readiness for new challenges. </li>
                                </ul>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> Why It Matters </h2>
                                <p className="src_desc"> For teenagers seeking their first job, your education demonstrates dedication and a willingness to grow. Employers value individuals who take learning seriously, as it indicates you’re ready to invest in yourself and succeed in a job. </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Education;
