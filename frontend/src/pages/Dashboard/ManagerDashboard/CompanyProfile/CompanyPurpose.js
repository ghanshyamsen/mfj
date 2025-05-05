import React, {useState} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


function CompanyPurpose({GoBackStep, GoNextStep, formData, setFormData}){
    const { nextStep, previousStep } = useWizard();
    const [companypurpose, setCompanyPurpose] = useState((formData.company_purpose||''));
    const [error, setError] = useState(false);

    const changeCompanyPurpose = (event) => {
        setCompanyPurpose(event.target.value);

        setFormData({...formData, ['company_purpose']: event.target.value});
    }

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!companypurpose.trim()){
            setError("Company purpose is required.");
            return
        }

        GoNextStep();
        nextStep();
    }

    return (
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">What is the company's purpose?</h1>
                </div>
                <div className='form-group mb-3 mt-3'>
                    <FloatingLabel controlId="companypurpose" label={<span> Company Purpose <span className='required'>*</span> </span>} className="">
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="companypurpose"
                            value={companypurpose}
                            onChange={changeCompanyPurpose}
                            maxLength="300"
                            placeholder=""
                        />
                    </FloatingLabel>
                    <p className="phone_Text mb-0"> {companypurpose ? companypurpose.length : 0}/300 </p>
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

export default CompanyPurpose;