import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionFour({GoBackStep, GoNextStep, award, setAward}) {
    const [description, setDescription] = useState("");
    const { nextStep, previousStep } = useWizard();


    useEffect(()=>{
        if(award){
            setDescription(award.answer)
        }
    },[award])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        setAward(3,{
            "label": "Description",
            "question": "Enter the Brief Description",
            "subtext" : "Can you provide a brief description of the criteria for this award or why you received it? (e.g., top performer, outstanding service, exceptional leadership)",
            "answer": description,
            "brief_description": description,
            "question_tag": "brief_description"
        });

        GoNextStep();
        nextStep();
    }


    const handleChange = (event) => {
        setDescription(event.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter a Brief Description</h1>
                    <p>Can you provide a brief description of the criteria for this award or why you received it? (e.g., top performer, outstanding service, exceptional leadership)</p>
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
                        <div className="d-flex">
                            <p className="phone_Text"> {description.length}/300 </p>
                            <p className="phone_Text"> Optional </p>
                        </div>
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

export default QuestionFour;