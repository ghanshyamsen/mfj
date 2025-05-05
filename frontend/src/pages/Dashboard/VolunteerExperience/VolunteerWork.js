import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function VolunteerWork({GoBackStep, GoNextStep, vexperience, setVExperience}) {

    const { nextStep, previousStep } = useWizard();

    const handleClickNext = () => {
        let FormDataObj = formdata;
        // Validate the form data
        const validationErrors = validateForm(formdata);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        setVExperience(2,{
            title:"Questions",
            info:[{
                question:"What were your main responsibilities during your volunteer work?",
                answer: formdata.responsibilities,
                responsibilities: formdata.responsibilities,
                question_tag: "responsibilities"
            }]
        });

        GoNextStep();
        nextStep();
    }

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const [formdata, setFromData] = useState({
        responsibilities:""
    });

    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const errors = {};

        // You can add more validation logic here
        if(!data.responsibilities.trim()){
            errors.responsibilities = "Responsibilities is required.";
        }

        return errors;
    }

    const handleChange = (e) => {
        setFromData({...formdata,[e.target.name]: e.target.value});
    }

    useEffect(() => {
        if (vexperience) {
            const data = vexperience;
            const info = {};

            data.info.forEach((value) => {
                info[value.question_tag] = value.answer;
            });

            setFromData(info);
        }
    }, [vexperience]);



    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">What were your main responsibilities during your volunteer work?</h1>
                    <p className='rim_text'> What tasks or duties did you handle during your volunteer experience? </p>
                </div>

                <div className='mb-3'>
                    <FloatingLabel controlId="floatingorganization" label={<span>Main responsibilities <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            type="text"
                            name="responsibilities"
                            value={formdata.responsibilities||""}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {errors.responsibilities && <div className="error-message text-danger">{errors.responsibilities}</div>}
                        <p className="phone_Text"> e.g., Assisting with event planning and execution </p>
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

export default VolunteerWork;