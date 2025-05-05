import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function QuestionFive({GoBackStep, GoNextStep, certificate, setCertificate}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();

    useEffect(() => {
        if(certificate){
            setValue(certificate.answer);
        }
    },[certificate])


    const handleClickNext = () => {


        if(!value.trim()){
            setError("Category or field is required.");
            return
        }

        setCertificate(4, {
            "question": "Enter the Category or Field",
            "subtext": "In which category or field is this certification or training relevant? (e.g., first aid, computer programming, leadership, language proficiency)",
            "answer": value,
            "category_of_field": value,
            "question_tag": "category_of_field",
            "label": "Category or Field"
        });


        GoNextStep();
        nextStep();
    }


    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Category or Field</h1>
                    <p> In which category or field is this certification or training relevant? (e.g., first aid, computer programming, leadership, language proficiency)</p>
                </div>
                <div className='education_fields'>
                    <FloatingLabel controlId="floatineducation" label={<span> Category or Field <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="category_of_field"
                            value={value}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {error  && <small style={{color:"red"}}>{error}</small>}
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

export default QuestionFive;