import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionSeven({GoBackStep, GoNextStep, certificate, setCertificate}) {
    const [credentialURL, setCredentialURL] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();


    useEffect(() => {
        if(certificate){
            setCredentialURL(certificate.answer);
        }
    },[certificate])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(credentialURL){
            const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
            const isValidUrl = urlRegex.test(credentialURL);
            if(!isValidUrl){
                setError('Please enter a valid url.');
                return
            }
        }

        setCertificate(6, {
            "question": "Provide the URL or link to access the certificate details (if applicable)",
            "answer": credentialURL,
            "credential_url": credentialURL,
            "question_tag": "credential_url",
            "label": "Certificate URL"
        });

        GoNextStep();
        nextStep();
    }



    const handleChange = (event) => {
        let value = event.target.value.replace('https://','');
        if (value && !/^https?:\/\//i.test(value)) {
            value = `https://${value}`;
        }
        setCredentialURL(value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Provide the URL or link to access the certificate details (if applicable)</h1>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label="Certificate URL" className="mb-3">
                        <Form.Control
                            type="url"
                            name="credentialurl"
                            value={credentialURL}
                            onChange={handleChange}
                            maxLength="500"
                            placeholder=""
                        />
                        {error && <span className="error">{error}</span>}
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

export default QuestionSeven;