import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function RewardingAspect({GoBackStep, GoNextStep, vexperience, setVExperience}) {

    const { nextStep, previousStep } = useWizard();

    const handleClickNext = () => {
        let FormDataObj = formdata;
        // Validate the form data
        const validationErrors = validateForm(formdata);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        setVExperience(4,{
            title:"Questions",
            info:[{
                question: "Describe the most rewarding aspect",
                answer: formdata.rewardingaspect,
                rewardingaspect: formdata.rewardingaspect,
                question_tag: "rewardingaspect"
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
        rewardingaspect:""
    });

    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const errors = {};

        // You can add more validation logic here
        if(!data.rewardingaspect.trim()){
            errors.rewardingaspect = "Rewarding Aspect is required.";
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
                    <h1 className="rim_heading">What was the most rewarding aspect of your volunteer work?</h1>
                </div>

                <div className='mb-3'>
                    <FloatingLabel controlId="rewardingAspect" label={<span> Describe the most rewarding aspect <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="rewardingaspect"
                            value={formdata.rewardingaspect}
                            onChange={handleChange}
                            maxLength="300"
                            placeholder=""
                        />
                        {errors.rewardingaspect && <div className="error-message text-danger">{errors.rewardingaspect}</div>}
                    </FloatingLabel>
                    <p className="phone_Text"> {formdata.rewardingaspect ? formdata.rewardingaspect.length : 0}/300 </p>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default RewardingAspect;