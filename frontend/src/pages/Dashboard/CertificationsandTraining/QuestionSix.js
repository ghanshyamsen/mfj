import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionSix({GoBackStep, GoNextStep, certificate, setCertificate}) {
    const [credentialid, setCredentialId] = useState("");
    const { nextStep, previousStep } = useWizard();

    useEffect(() => {
        if(certificate){
            setCredentialId(certificate.answer);
        }
    },[certificate])


    const handleClickNext = () => {

        setCertificate(5, {
            "question": "Enter the Certificate Number (if applicable)",
            "subtext": "If your certification has a unique identifying number or code, please provide it here.",
            "answer": credentialid,
            "credential_id": credentialid,
            "question_tag": "credential_id",
            "label": "Certificate Number"
        });


        GoNextStep();
        nextStep();
    }


    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleChange = (event) => {
        setCredentialId(event.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Certificate Number (if applicable)</h1>
                </div>
                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label="Certificate Number" className="mb-3">
                        <Form.Control
                            type="text"
                            name="credentialid"
                            value={credentialid}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        <p className="phone_Text"> Optional </p>
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

export default QuestionSix;