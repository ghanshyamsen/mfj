import React, {useState} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


function CompanyValues({GoBackStep, GoNextStep, formData, setFormData}){

    const { nextStep, previousStep } = useWizard();
    const [companyValues, setCompanyValues] = useState((formData.company_values||''));
    const [error, setError] = useState(false);

    const changeCompanyValues = (event) => {
        setCompanyValues(event.target.value);

        setFormData({...formData, ['company_values']: event.target.value});
    }

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!companyValues.trim()){
            setError("Company values is required.");
            return
        }

        GoNextStep();
        nextStep();
    }

    return (
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">What are the values of your company?</h1>
                </div>
                <div className='form-group mb-3 mt-3'>
                    <FloatingLabel controlId="companyValues" label={<span> Company Values <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="companyValues"
                            value={companyValues}
                            onChange={changeCompanyValues}
                            maxLength="300"
                            placeholder=""
                        />
                    </FloatingLabel>
                    <p className="phone_Text mb-0"> {companyValues ? companyValues.length : 0}/300 </p>
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

export default CompanyValues;