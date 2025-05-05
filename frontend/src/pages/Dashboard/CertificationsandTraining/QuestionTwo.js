import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionTwo({GoBackStep, GoNextStep, certificate, setCertificate}) {
    const [organization, setOrganization] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();


    useEffect(() => {
        if(certificate){
            setOrganization(certificate.answer);
        }
    },[certificate])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!organization.trim()){
            setError("Organization/issuer is required.");
            return
        }

        setCertificate(1,{
            "question": "Enter the Issuing Organization",
            "subtext" : "Which organization or institution provided the certification or training?",
            "answer": organization,
            "institution": organization,
            "question_tag": "institution",
            "label": "Organization/issuer"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setOrganization(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Issuing Organization</h1>
                    <p>Which organization or institution provided the certification or training?</p>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label={<span> Organization/issuer <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="organization"
                            value={organization}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {error  && <small style={{color:"red"}}>{error}</small>}
                    </FloatingLabel>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionTwo;