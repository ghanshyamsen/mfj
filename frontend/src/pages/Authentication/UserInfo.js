import React, { useState, useEffect } from 'react';
import { useWizard } from "react-use-wizard";
import backArrow from '../../assets/images/fi_arrow-left.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';

function UserInfo({ data, onUpdate, handleSubmitForm, refCode}) {

    const { previousStep, nextStep } = useWizard();

    const userType = data.user_type;
    const userSocialData = data.connect_data;

    const [userInfo, setUserInfo] = useState({
        firstName: (data.first_name||''),
        lastName: (data.last_name||''),
        preferred_name: (data.preferred_name||''),
        reference_code: (data.reference_code||refCode||''),
        date_of_birth: (data.date_of_birth||''),
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
    });

    // Effect to update state when data changes
    useEffect(() => {
        if(data?.connect_data){
            setUserInfo({
                firstName: userSocialData.given_name,
                lastName: userSocialData.family_name,
                preferred_name: "",
                reference_code: "",
                date_of_birth: ""
            });
        }else{
            setUserInfo({
                firstName: (data.first_name||''),
                lastName: (data.last_name||''),
                preferred_name: (data.preferred_name||""),
                reference_code: (data.reference_code||refCode||''),
                date_of_birth: (data.date_of_birth||''),
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
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
        if (!userInfo.firstName.trim()) {
            errors.firstName = 'First name is required';
            isValid = false;
        }else{
            if(userInfo.firstName.length < 3 || userInfo.firstName.length > 25 ){
                errors.firstName = 'First name must have at least min 3 characters and max 25 characters.';
                isValid = false;
            }
        }

        // Check if last name is empty
        if (!userInfo.lastName.trim()) {
            errors.lastName = 'Last name is required';
            isValid = false;
        }else{
            if(userInfo.lastName.length < 3 || userInfo.lastName.length > 25 ){
                errors.lastName = 'Last name must have at least min 3 characters and max 25 characters.';
                isValid = false;
            }
        }

        if(userType === "teenager"){
            if (!userInfo.date_of_birth) {
                errors.date_of_birth = 'Date of birth is required.';
                isValid = false;
            }else if(userInfo.date_of_birth && !window.isAge13OrOlder(userInfo.date_of_birth)){
                errors.date_of_birth = 'For legal and safety reasons, users of this platform must be 13 years of age or older.';
                isValid = false;
            }
        }


        setErrors(errors);
        return isValid;
    };

    const handleUserInfo = () => {
        const isValid = validateForm();
        if (isValid) {
            onUpdate({
                ...data,
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                preferred_name: userInfo.preferred_name,
                reference_code: userInfo.reference_code,
                date_of_birth: userInfo.date_of_birth,
            });

            if(userType === "manager"){
                nextStep();
            }else {
                handleSubmitForm();
            }
        }
    }

    return(

        <div className='auth_form_block'>
            <button type='button' className='back_btn' onClick={previousStep}>
                <img src={backArrow} alt="" />
            </button>
            <h1 className='heading'>Full Legal Name</h1>
            {data.user_type!=='parents' && <p className='login_text'> {data.user_type==='manager'?`This name will appear on your profile to potential candidates`:`This name will appear on your resume to potential employers`} </p>}
            <FloatingLabel controlId="floatingFirstName" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                <Form.Control type="text" name="firstName" placeholder="" value={userInfo.firstName} onChange={handleChange} maxLength="25" />
                {errors.firstName && <div className="error-message text-danger">{errors.firstName}</div>}
            </FloatingLabel>

            <FloatingLabel controlId="floatingLastName" label={<span> Last Name <span className='required'>*</span> </span>} className="mb-3" >
                <Form.Control type="text" placeholder="" name="lastName" value={userInfo.lastName} onChange={handleChange} maxLength="25"/>
                {errors.lastName && <div className="error-message text-danger">{errors.lastName}</div>}
            </FloatingLabel>

            <FloatingLabel controlId="floatingPreferredName" label="Preferred Name" className="mb-3"  >
                <Form.Control type="text" placeholder="" name="preferred_name" value={userInfo.preferred_name} onChange={handleChange}/>
            </FloatingLabel>

            {userType === 'teenager' &&
                <>
                    <FloatingLabel controlId="floatingReferenceCode" label="Reference Code" className="mb-3">
                        <Form.Control type="text" placeholder="" name="reference_code" value={userInfo.reference_code} onChange={handleChange} maxLength="100" readOnly={!!refCode}/>
                    </FloatingLabel>

                    <FloatLabel controlId="floatingdate" label="" className="mb-3">
                        <Calendar
                            name="date_of_birth"
                            value={userInfo.date_of_birth||''}
                            onChange={handleChange}
                            placeholder=""
                            maxDate={new Date()}
                        />
                        <label htmlFor="date_of_birth">Date of Birth <span className='required'>*</span></label>
                    </FloatLabel>
                    {errors.date_of_birth && <div className="error-message text-danger">{errors.date_of_birth}</div>}
                </>
            }



            <button type='button' className='btn submit_btn' onClick={handleUserInfo}> Continue </button>

        </div>
    );
}

export default UserInfo;
