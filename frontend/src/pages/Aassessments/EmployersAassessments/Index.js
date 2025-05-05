import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import QuestionTwo from './QuestionTwo';
import QuestionThree from './QuestionThree';
import QuestionFour from './QuestionFour';
import QuestionFive from './QuestionFive';
import Review from './Review';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

function EmployersAassessments() {

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const [assessment, setAssessment] = useState([]);
    const [data, setData] = useState([]);
    const TOKEN = localStorage.getItem('token');
    const User = JSON.parse(localStorage.getItem('userData'));
    const [loading, setLoading] = useState(false);

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

        fetch(`${process.env.REACT_APP_API_URL}/app/employers-assessments/get`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setData(result.data)
            }
        })
        .catch((error) => console.error(error.messge));

        if(User?.personality_assessment_complete_status){
            setAssessment(User.personality_assessment);
            setIndex(5);
            setCurrentStep(6);
        }
        setLoading(true);
    },[])

    const handleSubmit = () => {
        sessionStorage.setItem('showCompleteModal', 'true');
        sessionStorage.setItem('step_title', 'Personality Assessment');
        navigate('/dashboard');
    };

    const goDashboardPage = () => {
        navigate('/dashboard');
    };

    return (
        <div className="objectives-and-summary-page resume_infomation_moduals">
            <Container>
                <div className='dcb_block'>
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
    );
}

export default EmployersAassessments;
