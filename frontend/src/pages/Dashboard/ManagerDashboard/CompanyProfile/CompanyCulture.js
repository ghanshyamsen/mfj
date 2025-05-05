import React, {useState} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


function CompanyCulture({GoBackStep, GoNextStep, formData, setFormData}){

    const { nextStep, previousStep } = useWizard();
    const [companyculture, setCompanyCulture] = useState((formData.company_culture||''));
    const [error, setError] = useState(false);

    const changeCompanyCulture = (event) => {
        setCompanyCulture(event.target.value);

        setFormData({...formData, ['company_culture']: event.target.value});
    }

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!companyculture.trim()){
            setError("Company culture is required.");
            return
        }

        GoNextStep();
        nextStep();
    }

    return (
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">What is the culture in your company?</h1>
                </div>
                <div className='form-group mb-3 mt-3'>
                    <FloatingLabel controlId="companyculture" label={<span> Company Culture <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="companyculture"
                            value={companyculture}
                            onChange={changeCompanyCulture}
                            maxLength="300"
                            placeholder=""
                        />
                    </FloatingLabel>
                    <p className="phone_Text mb-0"> {companyculture ? companyculture.length : 0}/300 </p>
                    {error && <div className="error" style={{ color: "red", fontSize: "12px" }}>{error}</div>}
                </div>
                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>

        </>
    );



}

export default CompanyCulture;