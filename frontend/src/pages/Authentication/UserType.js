import React, { useState, useEffect } from 'react';
import { useWizard } from "react-use-wizard";
import backArrow from '../../assets/images/fi_arrow-left.svg';

function UserType({ data, onUpdate, pId }) {

    const { previousStep, nextStep, goToStep } = useWizard();

    const [selectedOption, setSelectedOption] = useState((data?.user_type||(pId?'teenager':'')));
    const [error, setError] = useState('');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setError("");
    };

    const handleUser = () => {

        if (!selectedOption) {
            setError('Please select a user type.');
        }else {
            onUpdate({
                ...data,
                user_type: selectedOption
            });
            nextStep();
        }
    }

    const options = pId?[{ id: 'teenager', label: 'Student' }]:[
        { id: 'teenager', label: 'Student' },
        { id: 'manager', label: 'Employer' },
        { id: 'parents', label: 'Parent' }
    ];

    return(

        <div className='auth_form_block'>
           {/*  <button type='button' className='back_btn' onClick={()=>{goToStep(0)}}>
                <img src={backArrow} alt="" />
            </button> */}
            <h1 className='heading'>Choose User Type</h1>
            {/* <p className='login_text'> Please select your user type from the list below to get started. </p> */}

            <div className="custom-radio-buttons">
                {options.map(option => (
                    <label key={option.id} className={`radio-button ${selectedOption === option.id ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => handleOptionChange(option.id)}
                    />
                    <span className="radio-button-label">{option.label}</span>
                    </label>
                ))}

            </div>
            {error && <p className="error-message text-danger">{error}</p>}

            <button type='button' className='btn submit_btn' onClick={handleUser}> Continue </button>

        </div>

    );
}

export default UserType;

