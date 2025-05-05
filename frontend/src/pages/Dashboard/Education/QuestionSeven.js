import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionSeven({GoBackStep, GoNextStep, education, setEducation}) {
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    useEffect(() => {
        if(education){
            setDescription(education.answer);
        }
    },[])

    const handleClickNext = () => {

        setEducation(6,{
            label:"Description",
            question: "Provide Description of the Education",
            answer: description,
            education_description: description,
            question_tag: "education_description"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setDescription(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Provide Description of the Education</h1>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label="Description" className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows="6"
                            name="description"
                            value={description}
                            onChange={handleChange}
                            maxLength="300"
                            placeholder=""
                        />
                        {errors && <small className='error' style={{color:"red"}}>{errors}</small>}
                        <div className="d-flex">
                            <p className="phone_Text"> {description.length}/300</p>
                            <p className="phone_Text">Optional </p>
                        </div>
                        <p className="phone_Text"> Include your academic achievements, relevant coursework, projects, notable activities, and the skills or honors you gained from them.</p>

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