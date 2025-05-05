import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionOne({GoNextStep, goDashboardPage, education, setEducation}) {

    const [school, setSchool] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep } = useWizard();

    const closeInfomastion = () => {
        goDashboardPage();
    }

    useEffect(() => {
        if(education){
            setSchool(education.answer);
        }
    },[])

    const handleClickNext = () => {

        if(!school.trim()){
            setErrors("Please enter school name.");
            return
        }

        setEducation(0,{
            label: "School",
            question: "Enter the School or Institution Name",
            answer: school,
            school_name: school,
            question_tag: "school_name"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setSchool(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the School or Institution Name</h1>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label={<span> School <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="school"
                            value={school}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {errors && <small className='error' style={{color:"red"}}>{errors}</small>}
                    </FloatingLabel>
                </div>


                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={closeInfomastion}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionOne;