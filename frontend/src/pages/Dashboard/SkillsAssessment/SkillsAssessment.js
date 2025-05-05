import React, { useState, useEffect } from 'react';
import { Container, Modal }    from 'react-bootstrap';
import SkillDash      from './SkillDash';
import QuestionOne      from './QuestionOne';
import QuestionTwo      from './QuestionTwo';
import QuestionThree    from './QuestionThree';
import QuestionFour     from './QuestionFour';
import QuestionFive     from './QuestionFive';
import QuestionSix      from './QuestionSix';
import QuestionSeven    from './QuestionSeven';
import QuestionEight    from './QuestionEight';
import QuestionNine     from './QuestionNine';
import QuestionTen      from './QuestionTen';
import QuestionEleven   from './QuestionEleven';
import QuestionTwelve   from './QuestionTwelve';
import QuestionThirteen from './QuestionThirteen';
import QuestionFourteen from './QuestionFourteen';
import QuestionFifteen  from './QuestionFifteen';
import Review from './Review';
import ManLiftingWeights from '../../../assets/images/ManLiftingWeights.svg';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';
import { useProfile } from '../../../ProfileContext';

function SkillsAssessment() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();
    const TOKEN = localStorage.getItem('token');
    const [currentStep, setCurrentStep] = useState(1);
    const [skillQuestion, setSkillQuestion] = useState(false);
    const [skillsAssessment, setSkillsAssessment] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        sessionStorage.setItem('showCompleteModal', 'true');
        sessionStorage.setItem('step_title', 'Skills');
        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {
        navigate(EditUrl||'/dashboard');
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

            if(result.status === 'F'){
                window.showToast("Please complete your personal details first.","error");
                navigate('/dashboard');
            }else{
                if(result.data.skills_complete_status){
                    setIndex(15);
                    setCurrentStep(16);
                    setSkillsAssessment(result.data.skills_assessment);
                }

                setLoading(true);
            }

        })
        .catch((error) => console.error(error.message));

        fetch(`${process.env.REACT_APP_API_URL}/app/get-skill-assessment`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status == 'S'){
                setSkillQuestion(result.data)
            }
        })
        .catch((error) => console.error(error.message));
    },[])

    // Function to update or add an object at a specific index
    const updateOrAddObjectAtIndex = (index, newObject) => {
        setSkillsAssessment((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;
            return newArray;
        });
    };

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
                        {currentStep === 16 ? (
                            <h1 className='rim_heading'>Review</h1>
                        ) : (
                            <span className='mcount'>{currentStep}/15</span>
                        )}
                        <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {loading && skillQuestion &&
                            <Wizard startIndex={index}>
                                {/* <SkillDash GoNextStep={() => setCurrentStep(2)} /> */}
                                <QuestionOne
                                    data={skillQuestion[0]}
                                    //GoBackStep={() => setCurrentStep(1)}
                                    GoNextStep={() => setCurrentStep(2)}
                                    goDashboardPage={goDashboardPage}
                                    skillsAssessment={skillsAssessment[0]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionTwo
                                    data={skillQuestion[1]}
                                    GoBackStep={() => setCurrentStep(1)}
                                    GoNextStep={() => setCurrentStep(3)}
                                    skillsAssessment={skillsAssessment[1]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionThree
                                    data={skillQuestion[2]}
                                    GoBackStep={() => setCurrentStep(2)}
                                    GoNextStep={() => setCurrentStep(4)}
                                    skillsAssessment={skillsAssessment[2]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionFour
                                    data={skillQuestion[3]}
                                    GoBackStep={() => setCurrentStep(3)}
                                    GoNextStep={() => setCurrentStep(5)}
                                    skillsAssessment={skillsAssessment[3]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionFive
                                    data={skillQuestion[4]}
                                    GoBackStep={() => setCurrentStep(4)}
                                    GoNextStep={() => setCurrentStep(6)}
                                    skillsAssessment={skillsAssessment[4]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionSix
                                    data={skillQuestion[5]}
                                    GoBackStep={() => setCurrentStep(5)}
                                    GoNextStep={() => setCurrentStep(7)}
                                    skillsAssessment={skillsAssessment[5]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionSeven
                                    data={skillQuestion[6]}
                                    GoBackStep={() => setCurrentStep(6)}
                                    GoNextStep={() => setCurrentStep(8)}
                                    skillsAssessment={skillsAssessment[6]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionEight
                                    data={skillQuestion[7]}
                                    GoBackStep={() => setCurrentStep(7)}
                                    GoNextStep={() => setCurrentStep(9)}
                                    skillsAssessment={skillsAssessment[7]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionNine
                                    data={skillQuestion[8]}
                                    GoBackStep={() => setCurrentStep(8)}
                                    GoNextStep={() => setCurrentStep(10)}
                                    skillsAssessment={skillsAssessment[8]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionTen
                                    data={skillQuestion[9]}
                                    GoBackStep={() => setCurrentStep(9)}
                                    GoNextStep={() => setCurrentStep(11)}
                                    skillsAssessment={skillsAssessment[9]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionEleven
                                    data={skillQuestion[10]}
                                    GoBackStep={() => setCurrentStep(10)}
                                    GoNextStep={() => setCurrentStep(12)}
                                    skillsAssessment={skillsAssessment[10]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionTwelve
                                    data={skillQuestion[11]}
                                    GoBackStep={() => setCurrentStep(11)}
                                    GoNextStep={() => setCurrentStep(13)}
                                    skillsAssessment={skillsAssessment[11]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionThirteen
                                    data={skillQuestion[12]}
                                    GoBackStep={() => setCurrentStep(12)}
                                    GoNextStep={() => setCurrentStep(14)}
                                    skillsAssessment={skillsAssessment[12]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionFourteen
                                    data={skillQuestion[13]}
                                    GoBackStep={() => setCurrentStep(13)}
                                    GoNextStep={() => setCurrentStep(15)}
                                    skillsAssessment={skillsAssessment[13]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <QuestionFifteen
                                    data={skillQuestion[14]}
                                    GoBackStep={() => setCurrentStep(14)}
                                    GoNextStep={() => setCurrentStep(16)}
                                    skillsAssessment={skillsAssessment[14]}
                                    setSkillsAssessment={updateOrAddObjectAtIndex}
                                />
                                <Review
                                    GoBackStep={() => setCurrentStep(15)}
                                    handleSubmit={handleSubmit}
                                    skillsAssessment={skillsAssessment}
                                    setStep={(key) => setCurrentStep(key)}
                                />
                            </Wizard>
                        }
                    </form>
                </div>
            </Container>
        </div>

        {/*  */}

        <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                {/* <Modal.Title> Skills </Modal.Title> */}
                <div className='icons'>
                    <img src={ManLiftingWeights} alt="" />
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className='modal_content'>
                    <div className="make_resume_content_block">
                        <div className="make_resume_content">
                            <h2 className="mrc_heading"> Welcome to the Soft Skills Assessment Test! </h2>
                            <p className="src_desc"> This short test is designed to help you discover your natural strengths in key soft skills. Soft skills are the abilities that help you communicate, work well with others, and adapt to new situations—skills that are important in your first job and beyond. </p>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> How It Works  </h2>
                            <ul className="">
                                <li> You’ll answer 15 questions based on everyday situations you might encounter in your life. </li>
                                <li> Each question has four options—just pick the one that best describes how you would respond. </li>
                                <li> There are no right or wrong answers. This test is all about understanding what comes naturally to you. </li>
                            </ul>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> Why It Matters  </h2>
                            <p className="src_desc"> By the end of the test, you’ll learn about the top 5 soft skills you already have. Knowing these strengths can help you make the most of them in school, work, and social settings.  </p>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default SkillsAssessment;
