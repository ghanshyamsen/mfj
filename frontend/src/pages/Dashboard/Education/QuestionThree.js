import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionThree({GoBackStep, GoNextStep, education, setEducation}) {
    const [study, setStudy] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }


    useEffect(() => {
        if(education){
            setStudy(education.answer);
        }
    },[])

    const handleClickNext = () => {

        setEducation(2,{
            label:"Field of Study",
            question: "Provide the Field of Study",
            answer: study,
            study_field: study,
            question_tag: "study_field"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setStudy(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Provide the Field of Study <br/> (if applicable)</h1>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label="Field of Study" className="mb-3">
                        <Form.Control
                            type="text"
                            name="study"
                            value={study}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {errors && <small className='error'  style={{color:"red"}}>{errors}</small>}
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

export default QuestionThree;