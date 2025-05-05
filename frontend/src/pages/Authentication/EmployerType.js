import React, { useState, useEffect } from 'react';
import { useWizard } from "react-use-wizard";
import backArrow from '../../assets/images/fi_arrow-left.svg';

function EmployerType({ data, onUpdate }) {

    const { previousStep, nextStep } = useWizard();

    const [selectedEmployer, setSelectedEmployer] = useState((data?.employer_type||''));
    const [error, setError] = useState('');

    const handleOptionChange = (option) => {
        setSelectedEmployer(option);
        setError("");
    };

    const handleEmployer = () => {
        if (!selectedEmployer){
            setError("Please select a Employer.");
            return
        }else {
            onUpdate({...data, employer_type:selectedEmployer});
            nextStep();
        }
    }

    const options = [
        { id: 1, label: 'Single Location Owner' },
        { id: 2, label: 'Multi-Location Operator' },
        { id: 3, label: 'Franchise' },
        { id: 4, label: 'Non-Profit Organization' }, /* Non-Profit Organization (Same path as single unit) */
        { id: 5, label: 'Educational Institution' }
    ];


    return(

        <div className='auth_form_block'>
            <button type='button' className='back_btn' onClick={previousStep}>
                <img src={backArrow} alt="" />
            </button>
            <h1 className='heading'>What type of employer are you?</h1>
            {/* <p className='login_text'> What type of employer are you? </p> */}

            <div className="custom-radio-buttons">
                {options.map(option => (
                    <label key={option.id} className={`radio-button ${selectedEmployer === option.label ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        value={option.label}
                        checked={selectedEmployer === option.label}
                        onChange={() => handleOptionChange(option.label)}
                    />
                    <span className="radio-button-label">{option.label}</span>
                    </label>
                ))}
            </div>

            {error && <p className="error-message text-danger">{error}</p>}

            <button type='button' className='btn submit_btn' onClick={handleEmployer}> Continue </button>

        </div>

    );
}

export default EmployerType;

