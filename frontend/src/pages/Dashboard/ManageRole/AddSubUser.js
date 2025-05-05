import React,{useState, useEffect} from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";
import InputGroup from 'react-bootstrap/InputGroup';
import eyehide from '../../../assets/images/eyehide.png';
import eyeview from '../../../assets/images/eyeview.png';

function AddSubUser() {

    const {key:uId} = useParams();
    const navigate = useNavigate();

    const [options, setOptions] = useState([]);

    const TOKEN = localStorage.getItem('token');

    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        role: "",
        countryCode: 'US',
        company_completed:true
    });

    const [countryCode, setCountryCode] = useState('US');

    const [showPassword, setShowPassword] = useState(false); 
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
      };

    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        role: ""
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // Check if first name is empty
        if (!userInfo.first_name.trim()) {
            errors.first_name = 'First name is required';
            isValid = false;
        }

        if (!userInfo.last_name.trim()) {
            errors.last_name = 'Last name is required';
            isValid = false;
        }

        if (!emailRegex.test(userInfo.email) || !userInfo.email.trim()) {
            errors.email ='Please enter a valid email address';
            isValid = false;
        }

        if(!uId){
            if(!userInfo.password.trim()){
                errors.password = "Password is required";
                isValid = false;
            }else{
                if (!(/^(?=.*\d)(?=.)(?=.*[a-zA-Z]).{8,30}$/).test(userInfo.password)) {
                    errors.password = "Password must contain at least 8 and max 30 characters including one letter and one number.";
                    isValid = false;
                }
            }
        }else{
            if (userInfo.password.trim() && !(/^(?=.*\d)(?=.)(?=.*[a-zA-Z]).{8,30}$/).test(userInfo.password)) {
                errors.password = "Password must contain at least 8 and max 30 characters including one letter and one number.";
                isValid = false;
            }
        }

        if (!userInfo.phone_number) {
             errors.phone_number = 'Please enter a phone number';
             isValid = false;
        } else {
            // Parse the phone number using libphonenumber-js
            const parsedPhoneNumber = parsePhoneNumberFromString(userInfo.phone_number, countryCode);

            // Check if the parsed phone number is valid
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                errors.phone_number = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        if (!userInfo.role.trim()) {
            errors.role = 'Role is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleChange = (e) => {
        let name, value;

        if (e && e.target) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = 'phone_number';
            value = e;
        }

        setUserInfo(prev => ({
            ...prev,
            [name]: value,
            phone_number: name === 'phone_number' ? value : prev.phone_number,
        }));

        if (name === 'phone_number') {
            updateCountryCode(value);
        }

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const updateCountryCode = (phoneNumber) => {
        if (phoneNumber) {
          const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
          if (phoneNumberObj) {
            setUserInfo((prevState) => ({
              ...prevState,
              countryCode: phoneNumberObj.country,
            }));
          }
        }
    };

    useEffect(() => {
        if (userInfo.phone_number) {
            updateCountryCode(userInfo.phone_number);
        }
    }, [userInfo.phone_number]);

    useEffect(() => {
        fetchRoles();
        if(uId){
            fetchUser()
        }
    },[])

    const fetchUser = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization",  `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-sub-user/${uId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setUserInfo({
                    first_name: result.data.first_name,
                    last_name: result.data.last_name,
                    email: result.data.email,
                    password: "",
                    phone_number: result.data.phone_number,
                    role: result.data.role,
                    countryCode: 'US',
                    company_completed: true
                });
            }else{
                navigate('/manage-sub-user');
                window.showToast(result.message, 'error');
            }

        })
        .catch((error) => console.error(error));
    }

    const fetchRoles = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization",  `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-role`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.data.length > 0){
                setOptions(result.data);
            }
        })
        .catch((error) => console.error(error));
    }

    const handleSubmit = () => {
        const isValid = validateForm();

        if (isValid) {

            const payload = {
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                phone_number: userInfo.phone_number,
                role: userInfo.role,
                password:userInfo.password,
                company_completed: true
            };

            const URL = (uId)?`/app/update-sub-user/${uId}`:'/app/add-sub-user';
            const API_URL = process.env.REACT_APP_API_URL+URL;
            const METHOD = (uId)?'PATCH':'POST';

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify(payload);

            const requestOptions = {
                method: METHOD,
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(API_URL, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    window.showToast(result.message, 'success');
                    navigate('/manage-sub-user');
                }else{
                    window.showToast(result.message, 'error');
                }
            })
            .catch((error) => console.error(error.message));

        }
    };

    return(
        <>
            <div className='manage-role-page'>
                <div className='add_manage_role_form'>

                    <div className='d-flex align-items-center mb-3'>
                        <Link to="/manage-sub-user" className="btn arrow_back_btn"> <img src={backArrow} alt="" /> </Link>
                        <h1 className='page_title mb-0'>  {uId?'Edit':'Add'} Sub-User </h1>
                    </div>

                        <FloatingLabel controlId="floatingFirstName" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={userInfo.first_name}
                                onChange={handleChange}
                                maxLength="25"
                                placeholder=""
                            />
                            {errors.first_name && <div className="error-message text-danger">{errors.first_name}</div>}
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingLastName" label={<span> Last Name <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={userInfo.last_name}
                                onChange={handleChange}
                                maxLength="25"
                                placeholder=""
                            />
                            {errors.last_name && <div className="error-message text-danger">{errors.last_name}</div>}
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingLastName" label={<span> Email <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                maxLength="250"
                                placeholder=""
                            />
                            {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingNewPassword" label={<span> Password <span className='required'>*</span> </span>} className='mb-3 password_element'>
                            <Form.Control type={showPassword ? 'text' : 'password'} name="password" placeholder="" onChange={handleChange} value={userInfo.password||''} />
                            <InputGroup.Text id="basic-addon1"  onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <img src={showPassword ? eyehide : eyeview} alt="toggle visibility" />
                            </InputGroup.Text>
                            {errors.password && <small className="error">{errors.password}</small>}
                        </FloatingLabel>


                        <FloatingLabel controlId="floatingFirstName" label={<span> Phone Number <span className='required'>*</span> </span>} className="mb-3">

                            <PhoneInput
                                defaultCountry="US"
                                country="US"
                                international
                                withCountryCallingCode
                                placeholder=""
                                className="form-control"
                                value={userInfo.phone_number}
                                onChange={value => handleChange({ target: { name: 'phone_number', value } })}
                            />
                            {errors.phone_number && <div className="error-message text-danger">{errors.phone_number}</div>}
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingFirstName" label={<span> Role <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Select aria-label="Default select example" name="role"  value={userInfo.role} onChange={handleChange}>
                                <option value="">Select Role</option>
                                {
                                    options.map(role =>(
                                        <option value={role.id} key={role.s_no}>{role.role_name}</option>
                                    ))
                                }
                            </Form.Select>
                            {errors.role && <div className="error-message text-danger">{errors.role}</div>}
                        </FloatingLabel>
                        <p className="phone_Text"> You can manage roles <Link to="/manage-role" >here</Link>. </p>
                        <button type="button" className='btn submit_btn mb-0' onClick={handleSubmit}> Submit </button>

                </div>
            </div>
        </>
    );
}

export default AddSubUser;