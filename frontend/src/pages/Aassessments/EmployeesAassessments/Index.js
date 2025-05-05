import React, { useState, useEffect } from 'react';
import { Container, Modal } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import QuestionTwo from './QuestionTwo';
import QuestionThree from './QuestionThree';
import QuestionFour from './QuestionFour';
import QuestionFive from './QuestionFive';
import Review from './Review';
import Person from '../../../assets/images/Person.svg';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';
import { useProfile } from '../../../ProfileContext';
function EmployeesAassessments() {

      const {theme} = useProfile();
    

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const [assessment, setAssessment] = useState([]);
    const [data, setData] = useState([]);
    const TOKEN = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        sessionStorage.setItem('showCompleteModal', 'true');
        sessionStorage.setItem('step_title', 'Personality Assessment');
        navigate('/dashboard');
    };

    // Function to update or add an object at a specific index
    const updateOrAddObjectAtIndex = (index, newObject) => {
        setAssessment((prevArray) => {
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

        fetch(`${process.env.REACT_APP_API_URL}/app/employees-assessments/get`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setData(result.data)
            }
        })
        .catch((error) => console.error(error.messge));

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                if(result.data?.personality_assessment_complete_status){
                    setAssessment(result.data.personality_assessment);
                    setIndex(5);
                    setCurrentStep(6);
                }

                setLoading(true);
            }
        })
        .catch((error) => console.error(error.messge));

    },[])

    const goDashboardPage = () => {
        navigate('/dashboard');
    };

    return (
        <>
        <div className="objectives-and-summary-page resume_infomation_moduals">
            <Container>
                <div className='dcb_block'>
                    <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>

                    <div className='heading_row'>
                        {currentStep === 6 ? (
                            <h1 className='rim_heading'>Review</h1>
                        ) : (
                            <span className='mcount'>{currentStep}/5</span>
                        )}
                        <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                    </div>
                    {loading && <Wizard startIndex={index}>
                        <QuestionOne
                            GoNextStep={() => setCurrentStep(2)}
                            goDashboardPage={goDashboardPage}
                            data={data?.[0]}
                            assessment={assessment?.[0]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionTwo
                            GoBackStep={() => setCurrentStep(1)}
                            GoNextStep={() => setCurrentStep(3)}
                            data={data?.[1]}
                            assessment={assessment?.[1]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionThree
                            GoBackStep={() => setCurrentStep(2)}
                            GoNextStep={() => setCurrentStep(4)}
                            data={data?.[2]}
                            assessment={assessment?.[2]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionFour
                            GoBackStep={() => setCurrentStep(3)}
                            GoNextStep={() => setCurrentStep(5)}
                            data={data?.[3]}
                            assessment={assessment?.[3]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionFive
                            GoBackStep={() => setCurrentStep(4)}
                            GoNextStep={() => setCurrentStep(6)}
                            data={data?.[4]}
                            assessment={assessment?.[4]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <Review
                            GoBackStep={() => setCurrentStep(5)}
                            setStep={(key) => { setCurrentStep(key) }}
                            handleSubmit={handleSubmit}
                            assessment={assessment}
                        />
                    </Wizard>}
                </div>
            </Container>
        </div>
        {/*  */}

        <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                {/* <Modal.Title> Personality Assessment </Modal.Title> */}
                <div className='icons'>
                            <img src={Person} alt="" />
                        </div>
            </Modal.Header>
            <Modal.Body>
                <div className='modal_content'>
                    <div className="make_resume_content_block">
                        <div className="make_resume_content">
                            <h2 className="mrc_heading"> Welcome to the Personality Assessment Section </h2>
                            <p className="src_desc"> The Personality Assessment helps you uncover your unique traits, behaviors, and preferences. By understanding your natural strengths and areas for development, you’ll gain valuable insights into how you can grow both personally and professionally. </p>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> How It Works </h2>
                            <ul className="">
                                <li> You'll answer a series of questions designed to evaluate your personality and innate abilities.  </li>
                                <li> This assessment helps us match you with job roles and employers that align with your strengths and work-learning styles. </li>
                                <li> It’s not about right or wrong answers—it's about understanding what makes you, you. </li>
                            </ul>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> Why It Matters </h2>
                            <p className="src_desc"> Employers are looking for more than just skills—they want to know who you are as a person. This assessment helps ensure that you're matched with opportunities that suit your personality and allow you to thrive. By recognizing your traits, you can make informed decisions about your career path, leading to a more fulfilling work experience. </p>
                        </div>
                    </div>    
                </div>    
            </Modal.Body>
        </Modal>  
        </>
    );
}

export default EmployeesAassessments;
