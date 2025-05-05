import React, { useState, useEffect } from 'react';
import { useWizard } from "react-use-wizard";
import backArrow from '../../assets/images/fi_arrow-left.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function YourChild({ data, onUpdate, handleSubmitForm, prevStepData }) {

    const { previousStep, nextStep } = useWizard();
    const userType = prevStepData.userTypeData;

    const [childInfo, setChildInfo] = useState({
        firstName: '',
        lastName: '',
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
    });

    // Effect to update state when data changes
    /* useEffect(() => {
        setChildInfo({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
        });
    }, [data]); */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChildInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear any previous errors when the user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // Check if first name is empty
        if (!childInfo.firstName.trim()) {
            errors.firstName = 'First name is required';
            isValid = false;
        }

        // Check if last name is empty
        if (!childInfo.lastName.trim()) {
            errors.lastName = 'Last name is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleUserInfo = () => {
        const isValid = validateForm();
        if (isValid) {
            if(userType === "teenager"){
                handleSubmitForm();
                onUpdate(childInfo);
            }else {
                onUpdate(childInfo);
                nextStep();
            }
        }
    }

    return(

        <div className='auth_form_block'>
           {/*  <button type='button' className='back_btn' onClick={previousStep}>
                <img src={backArrow} alt="" />
            </button> */}
            <h1 className='heading'>Add your child</h1>
            <p className='login_text'> You can do it later </p>

            <FloatingLabel controlId="floatingFirstName" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                <Form.Control type="text" name="firstName" placeholder="" value={childInfo.firstName} onChange={handleChange}/>
                {errors.firstName && <div className="error-message text-danger">{errors.firstName}</div>}
            </FloatingLabel>
            <FloatingLabel controlId="floatingLastName" label={<span>Last Name <span className='required'>*</span> </span>}>
                <Form.Control type="text" placeholder="" name="lastName" value={childInfo.lastName} onChange={handleChange}/>
                {errors.lastName && <div className="error-message text-danger">{errors.lastName}</div>}
            </FloatingLabel>

            <button type='button' className='btn submit_btn' onClick={handleUserInfo}> Continue </button>

        </div>

    );
}

export default YourChild;
