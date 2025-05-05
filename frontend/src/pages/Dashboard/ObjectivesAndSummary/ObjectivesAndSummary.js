import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import QuestionTwo from './QuestionTwo';
import QuestionThree from './QuestionThree';
import QuestionFour from './QuestionFour';
import QuestionFive from './QuestionFive';
import QuestionSix from './QuestionSix';
import Review from './Review';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

import Modal from 'react-bootstrap/Modal';
import Pencil from '../../../assets/images/pencil.png';
import { useProfile } from '../../../ProfileContext';

function ObjectivesAndSummary() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();
    const [currentStep, setCurrentStep] = useState(1);
    const [objective, setObjective] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const [moveLast, setMoveLast] = useState(false);

    const [formData, setFormData] = useState({
        personalInformation: {},
        addYourPhoto: {}, // Changed key to camelCase for consistency
    });

    const TOKEN = localStorage.getItem('token');

    const updateFormData = (stepData, stepKey) => {
        setFormData(prev => ({ ...prev, [stepKey]: stepData }));
    };

    const handleSubmit = (event) => {
        sessionStorage.setItem('showCompleteModal', 'true');
        sessionStorage.setItem('step_title', 'Personal Summary');
        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {
        navigate(EditUrl||'/dashboard');
    };

    useEffect(() => {

        /** -----  */
        fetchResume();


        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        /** -----  */
        fetch(`${process.env.REACT_APP_API_URL}/app/get-objective`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            setObjective(result.data);
        })
        .catch((error) => console.error(error.message));

    },[]);

    const fetchResume = () => {

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

            if(result.status === 'F'){
                setResume(true);
            }else{

                if(loading && result.data.objective_complete_status){
                    setIndex(6);
                    setCurrentStep(7);
                    setLoading(false);
                }
                setResume(result.data);
            }

        })
        .catch((error) => console.error(error.message));
    }

    /*  */

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="objectives-and-summary-page resume_infomation_moduals">
                <Container>
                    <div className='dcb_block'>
                        <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>
                        <div className='heading_row'>
                            {currentStep == 7 ? (
                                <h1 className='rim_heading'>Review</h1>
                            ) : (
                                <span className='mcount'>{currentStep}/6</span>
                            )}
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            { objective && resume && <Wizard startIndex={index}>
                                <QuestionOne
                                    data={formData.questionOne}
                                    onUpdate={(data) => updateFormData(data, 'questionOne')}
                                    GoNextStep={(key) => setCurrentStep(key||2)}
                                    goDashboardPage={goDashboardPage}
                                    objective={objective}
                                    resume={resume}
                                    fetchResume={fetchResume}
                                />
                                <QuestionTwo
                                    data={formData.questionTwo}
                                    onUpdate={(data) => updateFormData(data, 'questionTwo')}
                                    GoBackStep={(key) => setCurrentStep(key||1)}
                                    GoNextStep={(key) => setCurrentStep(key||3)}
                                    objective={objective}
                                    resume={resume}
                                    fetchResume={fetchResume}
                                />
                                <QuestionThree
                                    data={formData.questionThree}
                                    onUpdate={(data) => updateFormData(data, 'questionThree')}
                                    GoBackStep={(key) => setCurrentStep(key||2)}
                                    GoNextStep={(key) => setCurrentStep(key||4)}
                                    objective={objective}
                                    resume={resume}
                                    fetchResume={fetchResume}
                                />
                                <QuestionFour
                                    data={formData.questionFour}
                                    onUpdate={(data) => updateFormData(data, 'questionFour')}
                                    GoBackStep={(key) => setCurrentStep(key||3)}
                                    GoNextStep={(key) => setCurrentStep(key||5)}
                                    objective={objective}
                                    resume={resume}
                                    fetchResume={fetchResume}
                                />
                                <QuestionFive
                                    data={formData.questionFive}
                                    onUpdate={(data) => updateFormData(data, 'questionFive')}
                                    GoBackStep={(key) => setCurrentStep(key||4)}
                                    GoNextStep={(key) => setCurrentStep(key||6)}
                                    objective={objective}
                                    resume={resume}
                                    fetchResume={fetchResume}
                                    setMoveLast={setMoveLast}
                                />
                                <QuestionSix
                                    data={formData.questionSix}
                                    onUpdate={(data) => updateFormData(data, 'questionSix')}
                                    GoBackStep={(key) => setCurrentStep(key||5)}
                                    GoNextStep={(key) => setCurrentStep(key||7)}
                                    objective={objective}
                                    resume={resume}
                                    fetchResume={fetchResume}
                                    moveLast={moveLast}
                                />

                                <Review
                                    GoBackStep={(key) => setCurrentStep(key||6)}
                                    GoNextStep={(key) => setCurrentStep(key)}
                                    objective={objective}
                                    setMoveLast={setMoveLast}
                                    handleSubmit={handleSubmit}
                                />
                            </Wizard> }
                        </form>
                    </div>
                </Container>
            </div>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                        <div className='icons'>
                            <img src={Pencil} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        {/* <h1 className='heading mb-4'> Personal Summary </h1> */}
                        <div className="make_resume_content_block">
                            <div className="make_resume_content">
                                <h2 className="mrc_heading"> Welcome to the Personal Summary Section </h2>
                                <p className="src_desc"> This section will help you craft a strong personal summary for your resume. A well-written personal summary acts as an elevator pitch that highlights your goals and qualifications, helping you stand out to potential employers. </p>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> How It Works </h2>
                                <ul className="">
                                    <li> You’ll be guided through a simple process to create a concise and impactful personal summary. </li>
                                    <li> You’ll answer a few quick questions about your skills, experiences, and career goals. </li>
                                    <li> We’ll use your answers and some AI to help you create a personal summary that makes a great first impression. </li>
                                </ul>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> Why It Matters </h2>
                                <p className="src_desc"> By the end of this section, you’ll have a personal summary that grabs the attention of employers. This summary will show them that you understand the role you're applying for and how you can contribute to their company. </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default ObjectivesAndSummary;
