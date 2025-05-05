import React, {useState } from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


function CompanyLife({GoBackStep, GoNextStep, formData, setFormData}){

    const { nextStep, previousStep } = useWizard();
    const [companyLife, setCompanyLife] = useState((formData.company_life||''));
    const [error, setError] = useState(false);

    const changeCompanyLife = (event) => {
        setCompanyLife(event.target.value);
        setFormData({...formData, ['company_life']: event.target.value});
    }


    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!companyLife.trim()){
            setError("Company life is required.");
            return
        }

        GoNextStep();
        nextStep();
    }

    return (
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">What is life like at the company?</h1>
                </div>
                <div className='form-group mb-3 mt-3'>
                    <FloatingLabel controlId="companyLife" label={<span> Company Life <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="companyLife"
                            value={companyLife}
                            onChange={changeCompanyLife}
                            maxLength="300"
                            placeholder=""
                        />
                    </FloatingLabel>
                    <p className="phone_Text mb-0"> {companyLife ? companyLife.length : 0}/300 </p>
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

export default CompanyLife;