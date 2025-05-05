import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionTwo({GoBackStep, GoNextStep, award, setAward}) {
    const [organization, setOrganization] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();


    useEffect(()=>{
        if(award){
            setOrganization(award.answer)
        }
    },[award])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!organization.trim()){
            setError("Issuer or Organization is required");
            return
        }

        setAward(1,{
            "label": "Organization/issuer",
            "question": "Enter the Awarding Organization",
            "subtext" : "Who presented or recognized you with this award? (e.g., school, club, sports team, community organization)",
            "answer": organization,
            "awarding_organization": organization,
            "question_tag": "awarding_organization"
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
                    <h1 className="rim_heading">Enter the Awarding Organization</h1>
                    <p>Who presented or recognized you with this award? (e.g., school, club, sports team, community organization)</p>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatinawards" label={<span> Organization/issuer <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="organization"
                            value={organization}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {error && <small style={{color:"red"}}>{error}</small>}
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