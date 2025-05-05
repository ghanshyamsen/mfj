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
import { FloatLabel } from 'primereact/floatlabel';
import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';
import Dropdown from 'react-bootstrap/Dropdown';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

import { Modal } from 'react-bootstrap';
import { useProfile } from '../../../ProfileContext';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Calendar } from 'primereact/calendar'
import SweetAlert from 'react-bootstrap-sweetalert';
import GraduationCap from '../../../assets/images/GraduationCap.svg';

function Certifications() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('token');

    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showListing, setShowListing] = useState(true);
    const [certificate, setCertificate] = useState([]);
    const [certificateList, setCertificateList] = useState([]);
    const [editcertificate, setEditCertificate] = useState([]);
    const [editIndex, setEditIndex] = useState('');
    const [ismove, setIsMove] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(()=>{

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        /** -----  */
        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                if(result.data.certification_status){
                    setCertificateList(result.data.certification);
                    setShowListing(true);
                }else{
                    setShowListing(false);
                }
            }

            setLoading(true);
        })
        .catch((error) => console.error(error.message));

    },[])

    useEffect(() => {
        if(ismove){
            updateResume()
        }
    },[certificateList]);


    // Function to update or add an object at a specific index
    const updateOrAddObjectAtIndex = (index, newObject) => {
        setCertificate((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;
            return newArray;
        });
    };

    const updateOrdering = (index, newObject) => {
        setCertificateList((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;

            return newArray;
        });
    };

    const moveHigher = (key) =>{

        let currentKey = key;
        let upperKey = (key-1);
        let currentArray = certificateList[key];
        let upperArray = certificateList[(key-1)];

        updateOrdering(upperKey,currentArray);
        updateOrdering(currentKey,upperArray);
        setIsMove(true);
    }

    const updateResume = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            certification:certificateList
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
                    //goDashboardPage()
                }

            }
        })
        .catch((error) => console.error(error.message));
    }

    const handleSubmit = (event) => {
        if(certificate){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Certifications and Training');
        }
        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {
        if(certificateList.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Certifications and Training');
        }
        navigate(EditUrl||'/dashboard');
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleChange = (e) => {
        setEditCertificate(editcertificate.map(certificate => {
            if (certificate.question_tag === e.target.name) {

                if(e.target.name === 'credential_url'){
                    let value = e.target.value.replace('https://','');
                    if (value && !/^https?:\/\//i.test(value)) {
                        value = `https://${value}`;
                    }
                    e.target.value  = value;
                }

                return {
                    ...certificate,
                    answer: (e.target.value?e.target.value:''),
                    [certificate.question_tag]: (e.target.value?e.target.value:'')
                };
            }
            return certificate;
        }))
    }

    const editCertificationModal = (index, value) => {
        setEditCertificate(value);
        setEditIndex(index);
        setShowModal(true);
    }

    const deleteCertificate = () => {

        setCertificateList(prevList => {
            const newCertificateList = [...prevList];
            newCertificateList.splice(editIndex, 1);
            return newCertificateList;
        });

        setIsMove(true);
        handleCloseModal();
        setShowAlert(false);
    }

    const showPicker = (e) => {
        if(e.target.name === "issue_date" || e.target.name === "expiry_date"){
            // Your logic for showing the date picker
            return e.target.showPicker();
        }
    };

    const validation = (data) => {
        const errors = {};

        data.map((value, key) => {
            if(!value.answer){
                switch (value.question_tag) {
                    case "certification_name":
                        errors.certification_name = "Certification title is required.";
                    break;

                    case "issue_date":
                        errors.issue_date = "Issue date is required.";
                    break;

                    case "category_of_field":
                        errors.category_of_field = "Category of field is required.";
                    break;

                    case "institution":
                        errors.institution = "Organization or issuer is required.";
                    break;
                }
            }
        });


        if(data[2].answer && data[3].answer && (new Date(window.parseDateString(data[2].answer)) > new Date(window.parseDateString(data[3].answer)))){
            errors.expiry_date = "Expiration date must be greater than issue date";
        }

        return errors;
    }

    const editCertificate = () => {

        const validated = validation(editcertificate);

        if(Object.keys(validated).length > 0){
            setErrors(validated);
            return
        }

        setErrors({});

        setCertificateList(prevList => {
            const newCertificateList = [...prevList];
            newCertificateList[editIndex] = editcertificate;
            return newCertificateList;
        });

        setIsMove(true);
        handleCloseModal();
    }



    return (
        <>
            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={deleteCertificate}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                The record will get deleted.
            </SweetAlert>

            <div className="objectives-and-summary-page resume_infomation_moduals">
                <Container>
                    {loading && showListing && <div className="dcb_block">
                        <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>

                        <div className='add_more_content_block'>
                            <button className='add_education' onClick={()=>{setShowListing(false)}}> <img src={Plus} alt="" /> <span> Add certification or training </span> </button>
                            {
                                certificateList.map((value, index) =>(
                                    <div className='education_info' key={index}>
                                        <div className='info_title'>
                                            <h2 className=''> {value[0].answer} </h2>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                                    <img src={Dots} alt="" />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {index > 0 && <Dropdown.Item onClick={()=>{moveHigher(index)}}> Move higher </Dropdown.Item>}
                                                    <Dropdown.Item onClick={()=>{editCertificationModal(index, value)}}> Edit </Dropdown.Item>
                                                    <Dropdown.Item onClick={()=>{
                                                        setEditIndex(index)
                                                        setShowAlert(true)
                                                    }}> Delete </Dropdown.Item>

                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <p className='it-text'> {value[1].answer} • {window.formatDate(value[2].answer)} {value[3].answer && '- '+window.formatDate(value[3].answer)} </p>
                                        {value[4]?.answer && <p className='id-text'> {value[4]?.answer} </p>}
                                        {value[5].answer  && <p className='id-text'> Certificate Number {value[5].answer} </p>}
                                        {value[6]?.answer && <p className='id-text'> URL <a href={value[6].answer} target='_blank'>{value[6].answer}</a> </p>}
                                    </div>
                                ))
                            }
                        </div>

                        <div className='btn_block'>
                            <button type="submit" className='btn submit_btn mb-2' onClick={goDashboardPage}>Save and exit</button>
                        </div>
                    </div>}

                    {/* steps form */}
                    {loading && !showListing && <div className='dcb_block'>
                        <div className='heading_row'>
                            {currentStep === 8 ? (
                                <h1 className='rim_heading'>{/* Certifications and Training */} Review </h1>
                            ) : (
                                <span className='mcount'>{currentStep}/7</span>
                            )}
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <Wizard>
                                <QuestionOne
                                    GoNextStep={() => setCurrentStep(2)}
                                    goDashboardPage={goDashboardPage}
                                    certificate={certificate[0]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                />
                                <QuestionTwo
                                    GoBackStep={() => setCurrentStep(1)}
                                    GoNextStep={() => setCurrentStep(3)}
                                    certificate={certificate[1]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                />
                                <QuestionThree
                                    GoBackStep={() => setCurrentStep(2)}
                                    GoNextStep={() => setCurrentStep(4)}
                                    certificate={certificate[2]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                />
                                <QuestionFour
                                    GoBackStep={() => setCurrentStep(3)}
                                    GoNextStep={() => setCurrentStep(5)}
                                    certificate={certificate[3]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                    lastData={certificate[2]}
                                />
                                <QuestionFive
                                    GoBackStep={() => setCurrentStep(4)}
                                    GoNextStep={() => setCurrentStep(6)}
                                    certificate={certificate[4]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                />
                                <QuestionSix
                                    GoBackStep={() => setCurrentStep(5)}
                                    GoNextStep={() => setCurrentStep(7)}
                                    certificate={certificate[5]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                />
                                <QuestionSeven
                                    GoBackStep={() => setCurrentStep(6)}
                                    GoNextStep={() => setCurrentStep(8)}
                                    certificate={certificate[6]}
                                    setCertificate={updateOrAddObjectAtIndex}
                                />
                                <Review
                                    GoBackStep={() => setCurrentStep(7)}
                                    handleSubmit={handleSubmit}
                                    certificate={certificate}
                                    setStep={(key) => {setCurrentStep(key)}}
                                />
                            </Wizard>
                        </form>
                    </div>}
                </Container>
            </div>

            {/* modal */}
              <Modal className={`edit_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'> Edit certifications and training </h1>
                </Modal.Header>

                <Modal.Body>
                    <div className='modal_content'>
                        <form>
                            <div className='field_form'>

                                {
                                    editcertificate.map((value, index) =>{
                                        const error = errors[value.question_tag];
                                        return (
                                                <>
                                                    {
                                                        value.question_tag === "issue_date" || value.question_tag === "expiry_date" ? (
                                                            <>
                                                                <FloatLabel className="mb-3">
                                                                    <Calendar
                                                                        name={value.question_tag}
                                                                        value={value.answer?new Date(window.parseDateString(value.answer)):''}
                                                                        onChange={handleChange}
                                                                        onClick={showPicker}
                                                                        dateFormat="mm/yy"
                                                                        view="month"
                                                                        placeholder=""
                                                                    />
                                                                    <label htmlFor={value.question_tag}>{value.label} <span className='required'>*</span></label>
                                                                </FloatLabel>
                                                                {error && <div className="error-message" style={{ color: 'red'}}>{error}</div>}
                                                            </>
                                                        ) : (
                                                            <FloatingLabel key={index} controlId={value.label} label={(value.question_tag !== "issue_date" && value.question_tag !== "expiry_date"?<>{value.label} <span className="required">*</span></>:'')} className="mb-3">
                                                                <Form.Control
                                                                    type={"text"}
                                                                    name={value.question_tag}
                                                                    value={value.answer}
                                                                    onChange={handleChange}
                                                                    onClick={showPicker}
                                                                    placeholder=""
                                                                />
                                                                {error && <div className="error-message" style={{ color: 'red'}}>{error}</div>}
                                                            </FloatingLabel>
                                                        )
                                                    }
                                                </>


                                        )
                                    })
                                }
                            </div>

                            <div className='btn_block mt-5'>
                                <button type="button" className='btn submit_btn back-button' onClick={()=>{setShowAlert(true)}}> Delete </button>
                                <button type="button" className='btn submit_btn' onClick={editCertificate}> Save </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    {/* <Modal.Title>Certifications and Training</Modal.Title> */}
                    <div className='icons'>
                            <img src={GraduationCap} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <div className="make_resume_content_block">
                            <div className="make_resume_content">
                                <h2 className="mrc_heading"> Welcome to the Certifications and Training Section </h2>
                                <p className="src_desc"> Certifications and training courses can boost your skills and qualifications, making you stand out as a stronger candidate. Whether you’ve completed formal courses or learned valuable skills, this section is where you can highlight those accomplishments. </p>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> How It Works </h2>
                                <ul className="">
                                    <li> List any certifications or training programs you've completed, no matter how big or small. </li>
                                    <li> These credentials help show employers that you're committed to continuous learning and growth. </li>
                                    <li> Even if you don’t have formal certifications yet, you’re showing initiative just by exploring new opportunities to develop yourself. </li>
                                </ul>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> Why It Matters </h2>
                                <p className="src_desc"> Including certifications or training on your resume demonstrates your expertise in certain areas and your dedication to professional growth. Some job types may also require specific certifications for the position. These qualifications help set you apart and prove you can contribute to particular roles or industries. </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Certifications;
