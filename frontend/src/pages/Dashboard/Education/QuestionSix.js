import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionSix({GoBackStep, GoNextStep, education, setEducation}) {
    const [grade, setGrade] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }


    useEffect(() => {
        if(education){
            setGrade(education.answer);
        }
    },[])


    const handleClickNext = () => {

        setEducation(5,{
            label:"Grade (GPA)",
            question: "Add the Grade or GPA",
            answer: grade,
            gpa: grade,
            question_tag: "gpa"
        });

        GoNextStep();
        nextStep();
    }



    const handleChange = (e) => {
        setGrade(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Add the Grade or GPA</h1>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label="Grade (GPA)" className="mb-3">
                        <Form.Control
                            type="text"
                            name="grade"
                            value={grade}
                            onChange={handleChange}
                            maxLength="25"
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

export default QuestionSix;