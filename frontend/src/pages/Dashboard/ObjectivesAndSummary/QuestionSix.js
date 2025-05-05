import React, { useState, useEffect, useRef } from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { ProgressSpinner } from 'primereact/progressspinner';
import Refresh from '../../../assets/images/refresh.png';

import userStatusHook from "../../../userStatusHook";

function QuestionSix({ GoBackStep, GoNextStep, moveLast }) {

    const { nextStep, previousStep } = useWizard();

    const [objectivesummary, setObjectiveSummary] = useState('');
    const resume = userStatusHook();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);

    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!objectivesummary){
            setError("Personal summary is required.");
            return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const raw = JSON.stringify({
            objective_summary: objectivesummary
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
                GoNextStep();
                nextStep();
            }else{
                window.showToast(result.message, "error");
            }
        })
        .catch((error) => console.error(error.message));
    }

    const changeObjectiveSummary = (event) => {
        setObjectiveSummary(event.target.value);
    }



    const fetchOpenAIResponse = async () => {
        if (!resume.loading) {
            setLoading(false);
            const prompt = `
                Improve below personal summary based on given description, please note that it will be used in the resume builder so make it friendly and interactive. The output should be updated summary only:
                ${resume.data.objective_summary}
            `;
            try {
                const response = await window.getOpenAIResponse(prompt);
                setObjectiveSummary(response); // Set the response to the state
                setLoading(true);
            } catch (error) {
                console.error('Failed to get OpenAI response:', error.message);
            }
        }
    };

    useEffect(() => {
        if (!resume.loading) {
            if(moveLast){
                fetchOpenAIResponse(); // Call the async function inside useEffect
            }else{
                setObjectiveSummary(resume?.data?.objective_summary); // Set the response to the state
                setLoading(true);
            }
        }
    }, [resume.loading]);


    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Share your personal summary</h1>
                </div>
                {loading && <div className='form-group mb-3 mt-3'>
                    <span className='regenerate_btn' type='button' onClick={fetchOpenAIResponse}> <img src={Refresh} alt="" /> Regenerate </span>
                    <FloatingLabel controlId="objectivesummary" label={<span> Personal summary <span className='required'>*</span> </span>}  className={isFocused ? 'floating-label-hidden' : ''}>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            name="objectivesummary"
                            value={objectivesummary}
                            onChange={changeObjectiveSummary}
                            maxLength="1000"
                            placeholder=""
                            ref={textareaRef}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </FloatingLabel>
                    <p className="phone_Text"> {objectivesummary ? objectivesummary.length : 0}/1000 | This summary was generated with the help of AI. </p>
                    {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                </div>}
                {!loading && <div className='form-group mb-3 mt-3 text-center'><ProgressSpinner /></div>}
                {loading && <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>}
            </div>
        </>
    )
}

export default QuestionSix;
