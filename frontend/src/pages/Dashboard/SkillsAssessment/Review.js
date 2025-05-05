import React from 'react';
import { useWizard } from "react-use-wizard";
import uEditAlt from '../../../assets/images/u_edit-alt.svg';

function Review({GoBackStep, handleSubmit, skillsAssessment, setStep}) {

    const { previousStep, goToStep } = useWizard();
    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleSkillsAssessment = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const raw = JSON.stringify({
            skills_complete_status: true,
            skills_assessment: skillsAssessment
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
            if(result.status == 'S'){
                handleSubmit();
            }
        })
        .catch((error) => console.error(error.message));

    }

    return(
        <>
            <div className=''>
                <div className='review_data'>

                    {
                        skillsAssessment.map((assessment,index)=> (
                            <div className='review_box' key={index}>
                                <div className='review_content'>
                                    <p className='que'>{assessment.question}</p>
                                    <p className='ans'>{assessment.option} </p>
                                </div>
                                <button className='edit_btn' type='button' onClick={()=>{
                                    goToStep((index+0))
                                    setStep((index+1))
                                }}> <img src={uEditAlt} alt="" /> </button>
                            </div>
                        ))
                    }

                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}>Back</button>
                    <button type="submit" className='btn submit_btn' onClick={handleSkillsAssessment}>Save and Continue</button>
                </div>
            </div>
        </>
    )
}

export default Review;