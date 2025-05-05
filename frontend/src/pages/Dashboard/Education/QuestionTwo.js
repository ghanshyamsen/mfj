import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionTwo({GoBackStep, GoNextStep, education, setEducation}) {
    const [degree, setDegree] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    useEffect(() => {
        if(education){
            setDegree(education.answer);
        }
    },[])


    const handleClickNext = () => {

        setEducation(1,{
            label:"Degree",
            question: "Specify the Degree Earned",
            answer: degree,
            college_degree: degree,
            question_tag: "college_degree"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setDegree(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Specify the Degree Earned <br/> (if applicable)</h1>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label="Degree" className="mb-3">
                        <Form.Control
                            type="text"
                            name="degree"
                            value={degree}
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

export default QuestionTwo;