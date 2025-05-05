import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionOne({GoNextStep, goDashboardPage, certificate, setCertificate}) {

    const [certificationTitle, setCertificationTitle] = useState("");
    const [error, setError] = useState("");
    const { nextStep } = useWizard();

    useEffect(() => {
        if(certificate){
            setCertificationTitle(certificate.answer);
        }
    },[certificate])

    const handleClickNext = () => {

        if(!certificationTitle.trim()){
            setError("Certification title is required.");
            return
        }

        setCertificate(0,{
            "question": "Enter the Certification or Training Name",
            "subtext": "Please list the name of the certification or training course you have completed.",
            "answer": certificationTitle,
            "certification_name": certificationTitle,
            "question_tag": "certification_name",
            "label": "Certification title"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setCertificationTitle(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Certification or Training Name</h1>
                    <p>Please list the name of the certification or training course you have completed.</p>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatincertification" label={<span> Certification title <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="certificationtitle"
                            value={certificationTitle}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {error  && <small style={{color:"red"}}>{error}</small>}
                    </FloatingLabel>
                </div>


                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={goDashboardPage}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionOne;