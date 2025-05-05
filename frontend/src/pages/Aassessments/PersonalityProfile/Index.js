import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import QuestionTwo from './QuestionTwo';
import QuestionThree from './QuestionThree';
import QuestionFour from './QuestionFour';
import QuestionFive from './QuestionFive';
import QuestionSix from './QuestionSix';
import QuestionSeven from './QuestionSeven';
import QuestionEight from './QuestionEight';
import QuestionNine from './QuestionNine';
import QuestionTen from './QuestionTen';
import QuestionEleven from './QuestionEleven';
import QuestionTwelve from './QuestionTwelve';
import QuestionThirteen from './QuestionThirteen';
import QuestionFourteen from './QuestionFourteen';
import QuestionFifteen from './QuestionFifteen';
import Review from './Review';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

function PersonalityProfile() {

    const [currentStep, setCurrentStep] = useState(1);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('token');
    const [data, setData] = useState([]);
    const [assessment, setAssessment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jobCount, setJobCount] = useState(0);

    const userData = JSON.parse(localStorage.getItem('userData'));


    const goDashboardPage = () => {
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

        if(!userData.guidance_counselor){
            window.showToast("You can't access this module without buying.",'error');
            navigate('/guidance-counselor');
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/personality-profile/get`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setData(result.data);
            }
        })
        .catch((error) => console.error(error.message));

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === "S"){
                if(result.data?.personality_profile_complete_status){
                    setAssessment(result.data.personality_profile);
                    setIndex(15);
                    setCurrentStep(16);
                }
            }
            setLoading(true);
        })
        .catch((error) => console.error(error.messge));

    },[])


    return (
        <div className="objectives-and-summary-page resume_infomation_moduals">
            <Container>
                <div className='dcb_block'>
                    <div className='heading_row'>
                        {currentStep === 16 ? (
                            <h1 className='rim_heading'>Recommended Jobs ({jobCount}) </h1>
                        ) : (
                            <span className='mcount'>{currentStep}/15</span>
                        )}
                        <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                    </div>
                    {loading && <Wizard startIndex={index} >
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
                        <QuestionSix
                            GoBackStep={() => setCurrentStep(5)}
                            GoNextStep={() => setCurrentStep(7)}
                            data={data?.[5]}
                            assessment={assessment?.[5]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionSeven
                            GoBackStep={() => setCurrentStep(6)}
                            GoNextStep={() => setCurrentStep(8)}
                            data={data?.[6]}
                            assessment={assessment?.[6]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionEight
                            GoBackStep={() => setCurrentStep(7)}
                            GoNextStep={() => setCurrentStep(9)}
                            data={data?.[7]}
                            assessment={assessment?.[7]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionNine
                            GoBackStep={() => setCurrentStep(8)}
                            GoNextStep={() => setCurrentStep(10)}
                            data={data?.[8]}
                            assessment={assessment?.[8]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionTen
                            GoBackStep={() => setCurrentStep(9)}
                            GoNextStep={() => setCurrentStep(11)}
                            data={data?.[9]}
                            assessment={assessment?.[9]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionEleven
                            GoBackStep={() => setCurrentStep(10)}
                            GoNextStep={() => setCurrentStep(12)}
                            data={data?.[10]}
                            assessment={assessment?.[10]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionTwelve
                            GoBackStep={() => setCurrentStep(11)}
                            GoNextStep={() => setCurrentStep(13)}
                            data={data?.[11]}
                            assessment={assessment?.[11]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionThirteen
                            GoBackStep={() => setCurrentStep(12)}
                            GoNextStep={() => setCurrentStep(14)}
                            data={data?.[12]}
                            assessment={assessment?.[12]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionFourteen
                            GoBackStep={() => setCurrentStep(13)}
                            GoNextStep={() => setCurrentStep(15)}
                            data={data?.[13]}
                            assessment={assessment?.[13]}
                            setAssessment={updateOrAddObjectAtIndex}
                        />
                        <QuestionFifteen
                            GoBackStep={() => setCurrentStep(14)}
                            GoNextStep={() => setCurrentStep(16)}
                            data={data?.[14]}
                            assessment={assessment?.[14]}
                            setAssessment={updateOrAddObjectAtIndex}
                            allassessment={assessment}
                        />

                        <Review
                            GoBackStep={() => setCurrentStep(15)}
                            goDashboardPage={goDashboardPage}
                            setStep={(key) => setCurrentStep(key)}
                            setJobCount={setJobCount}
                        />
                    </Wizard>}
                </div>
            </Container>
        </div>
    );
}

export default PersonalityProfile;
