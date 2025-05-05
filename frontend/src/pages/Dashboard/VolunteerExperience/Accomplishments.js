import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function Accomplishments({GoBackStep, GoNextStep, vexperience, setVExperience}) {
    const { nextStep, previousStep } = useWizard();

    const handleClickNext = () => {
        let FormDataObj = formdata;
        // Validate the form data
        const validationErrors = validateForm(formdata);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        setVExperience(3,{
            title:"Questions",
            info:[{
                question: "Describe your accomplishments",
                answer: formdata.accomplishments,
                accomplishments: formdata.accomplishments,
                question_tag: "accomplishments"
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
        accomplishments:""
    });

    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const errors = {};

        // You can add more validation logic here
        if(!data.accomplishments.trim()){
            errors.accomplishments = "Accomplishments is required.";
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
                    <h1 className="rim_heading"> Share Your Volunteer Accomplishments</h1>
                    <p className='rim_text'> Did you accomplish anything specific or leave a lasting impact during your volunteer work? </p>
                </div>

                <div className='mb-3'>
                    <FloatingLabel controlId="accomplishments" label={<span> Describe your accomplishments <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="accomplishments"
                            value={formdata.accomplishments||''}
                            onChange={handleChange}
                            maxLength="300"
                            placeholder=""
                        />
                        {errors.accomplishments && <div className="error-message text-danger">{errors.accomplishments}</div>}
                    </FloatingLabel>
                    <p className="phone_Text"> {formdata.accomplishments ? formdata.accomplishments.length : 0}/300 </p>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default Accomplishments;