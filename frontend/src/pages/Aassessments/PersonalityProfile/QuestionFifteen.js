import React, {useState} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionFifteen({GoNextStep, GoBackStep, data, assessment, setAssessment, allassessment}) {

    const [selectedOption, setSelectedOption] = useState(assessment?.answer);
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();
    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        previousStep();
        GoBackStep();
    }

    const handleClickNext = () => {
        if(!selectedOption){
            setError("Please select an option.");
            return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            personality_profile_complete_status: true,
            personality_profile: allassessment
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
            if(result.status === 'S'){
                GoNextStep();
                nextStep();
            }
        })
        .catch((error) => console.error(error.message));
    }

    const handleOptionChange = (index, option) => {
        setError(false);
        setSelectedOption(option);

        setAssessment(14,{
            question: data?.question,
            answer: option,
            type: data?.type[index]
        });
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">{data?.question}</h1>
                </div>

                <div className="custom-radio-buttons">
                    <div className='crb_inside'>
                        {data?.options.map((value, index) => (
                            <label key={index} className={`radio-button ${selectedOption === value ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    value={value}
                                    checked={selectedOption == value}
                                    onChange={() => handleOptionChange(index, value)}
                                />
                                <span className="radio-button-label">{value}</span>
                            </label>
                        ))}
                    </div>
                    {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionFifteen;