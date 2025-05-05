import React, {useState}  from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useWizard } from "react-use-wizard";
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import InputGroup from 'react-bootstrap/InputGroup';
import eyehide from '../../../assets/images/eyehide.png';
import eyeview from '../../../assets/images/eyeview.png';

function ResetPassword({formData, setFormData, handleSubmitForm}) {

    const { previousStep } = useWizard();
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm_password: false
    });

    // One function to toggle visibility for any field
    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
        ...prevState,
        [field]: !prevState[field]  // Toggle the specific field
        }));
    };

    const handleSubmit = () => {

        const validate = validateForm(formData);
        if(Object.keys(validate).length > 0){
            setErrors(validate);
            return
        }
        setErrors({})

        handleSubmitForm();
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }

    const validateForm = (data) => {
        const errors = {};

        if(!data.password.trim()){
            errors.password = "New Password is required";
        }else{
            if (!(/^(?=.*\d)(?=.)(?=.*[a-zA-Z]).{8,30}$/).test(data.password)) {
                errors.password = "Password must contain at least 8 and max 30 characters including one letter and one number.";
            }
        }

        if(!data.confirm_password.trim()){
            errors.confirm_password = "Confirm password is required";
        }else{
            if(data.password!==data.confirm_password){
                errors.confirm_password = "New Password and confirm password must be the same.";
            }
        }

        return errors;
    }


    return(
        <>
            <div className='auth_form_block'>
                <button type='button' className='back_btn' onClick={previousStep}>
                    <img src={backArrow} alt="" />
                </button>
                <h1 className="heading mb-4"> Reset Password </h1>

                <div className=''>
                    <div className='mb-3 form-group password_element'> {/* controlId="floatingNewPassword" */}
                        <Form.Control type={showPassword.password ? 'text' : 'password'} name="password" placeholder="New Password" onChange={handleChange} value={formData.password||''} />
                        <InputGroup.Text id="basic-addon1" onClick={() => togglePasswordVisibility('password')} style={{ cursor: 'pointer' }}>
                            <img src={showPassword.password ? eyehide : eyeview} alt="toggle visibility" />
                        </InputGroup.Text>
                        {errors.password && <small className="error">{errors.password}</small>}
                    </div>

                    <div className='mb-3 form-group password_element' controlId="floatingConfrimPassword"> 
                        <Form.Control type={showPassword.confirm_password ? 'text' : 'password'} name="confirm_password" placeholder="Confirm Password" onChange={handleChange} value={formData.confirm_password||''} />
                        <InputGroup.Text id="basic-addon1" onClick={() => togglePasswordVisibility('confirm_password')} style={{ cursor: 'pointer' }}>
                            <img src={showPassword.confirm_password ? eyehide : eyeview} alt="toggle visibility" />
                        </InputGroup.Text>
                        {errors.confirm_password && <small className="error">{errors.confirm_password}</small>}
                    </div>

                    <button type="button" className="btn submit_btn" onClick={handleSubmit}> Submit </button>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;