import React, {useState}  from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import eyehide from '../../assets/images/eyehide.png';
import eyeview from '../../assets/images/eyeview.png';



function ChangePassword(handleCloseModal) {

    const TOKEN = localStorage.getItem('token');
    const UserId = JSON.parse(localStorage.getItem('userData'))._id;

    const [formData, setFormData] = useState({
        current_password:"",
        password:"",
        confirm_password:""
    });
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState({
        current_password: false,
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

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }

    const validateForm = (data) => {
        const errors = {};

        if(!data.current_password.trim()){
            errors.current_password = "Current password is required";
        }

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

    const handleSubmit = () => {

        const validate = validateForm(formData);
        if(Object.keys(validate).length > 0){
            setErrors(validate);
            return
        }
        setErrors({})

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify(formData);

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-password/${UserId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'success'){
                setFormData({
                    current_password:"",
                    password:"",
                    confirm_password:""
                });
                window.showToast(result.message,"success");
            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error));

    }

    return(
        <>
            <div className="heading_block">
                <h1 className="heading"> Change Password </h1>
            </div>
            <div className='setting_common_block personal_info_block'>
                <form>
                    <FloatingLabel controlId="floatingPassword" label={<span> Current Password <span className='required'>*</span> </span>}  className='mb-3 password_element'>
                        <Form.Control type={showPassword.current_password ? 'text' : 'password'} name="current_password" placeholder="" onChange={handleChange} value={formData.current_password||''} />
                        <InputGroup.Text id="basic-addon1"  onClick={() => togglePasswordVisibility('current_password')} style={{ cursor: 'pointer' }}>
                            <img src={showPassword.current_password ? eyehide : eyeview} alt="toggle visibility" />
                        </InputGroup.Text>
                        {errors.current_password && <small className="error">{errors.current_password}</small>} 
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingNewPassword" label={<span> New Password <span className='required'>*</span> </span>}  className='mb-3 password_element'>
                        <Form.Control type={showPassword.password ? 'text' : 'password'} name="password" placeholder="" onChange={handleChange} value={formData.password||''} />
                        <InputGroup.Text id="basic-addon1" onClick={() => togglePasswordVisibility('password')} style={{ cursor: 'pointer' }}>
                            <img src={showPassword.password ? eyehide : eyeview} alt="toggle visibility" />
                        </InputGroup.Text>
                        {errors.password && <small className="error">{errors.password}</small>}
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingConfrimPassword" label={<span> Confirm Password <span className='required'>*</span> </span>} className='mb-3 password_element'>
                        <Form.Control type={showPassword.confirm_password ? 'text' : 'password'} name="confirm_password" placeholder="" onChange={handleChange} value={formData.confirm_password||''} />
                        <InputGroup.Text id="basic-addon1" onClick={() => togglePasswordVisibility('confirm_password')} style={{ cursor: 'pointer' }}>
                            <img src={showPassword.confirm_password ? eyehide : eyeview} alt="toggle visibility" />
                        </InputGroup.Text>
                        {errors.confirm_password && <small className="error">{errors.confirm_password}</small>}
                    </FloatingLabel>

                    <button type="button" className="btn submit_btn" onClick={handleSubmit}> Submit </button>

                </form>
            </div>
        </>
    );
}

export default ChangePassword;

