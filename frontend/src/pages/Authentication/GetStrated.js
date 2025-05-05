import React, { useState, useEffect, useRef } from 'react';
import emailicon from '../../assets/images/fi_mail.svg';
import GoogleLogo from '../../assets/images/Googlelogo.svg';
import linkedin from '../../assets/images/linkedin.svg';
import phone from '../../assets/images/u_phone.svg';
import loginBG from '../../assets/images/howimg4.png'

import InputGroup from 'react-bootstrap/InputGroup';
import eyehide from '../../assets/images/eyehide.png';
import eyeview from '../../assets/images/eyeview.png';
import { useWizard } from "react-use-wizard";
import { Form } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import { LoginSocialGoogle } from 'reactjs-social-login';
import { Link } from "react-router-dom";

import { useLinkedIn  } from 'react-linkedin-login-oauth2';

import socket from '../../socket';

function GetStarted({ data, onUpdate, pId }) {

    const navigate = useNavigate();
    const { nextStep } = useWizard();
    const [showDiv, setShowDiv] = useState(false);

    const remeberMeUser = localStorage.getItem('remeberMe');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [errors, setErrors] = useState({});

    const [RememberMe, setRememberMe] = useState((remeberMeUser?true:false));


    const [countryCode, setCountryCode] = useState('US'); // Define default country code, e.g., 'US'
    const submitBtn = useRef(null)

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

    const REDIRECT_URI = window.location.href;

    const onLoginSuccess = async (provider, data) => {

        try {

            const signup_type = provider;
            const connect_data = data;
            const email = data.email;

            if(email){

                const payload = {
                    "email": email,
                    "connect_data": connect_data
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/app/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(function(response){
                    return response.json();
                }).then(async function(resp){

                    if(resp.status == 'success'){
                        if(!resp.isUser){
                            onUpdate({email, connect_data, signup_type});
                            nextStep();
                        }else {

                            localStorage.setItem('token', resp.token);
                            localStorage.setItem('userData', JSON.stringify(resp.data));
                            localStorage.setItem('isLoggedUser', true);

                            const RND = window.randomInt(999,9999);
                            localStorage.setItem('RND',RND);
                            socket.emit('user_online', `${resp.data._id}:${RND}`);

                            navigate('/dashboard');
                            window.showToast("Login Successfully!", 'success');

                        }
                    }else{
                        window.showToast(resp.message, 'error');
                    }
                });

            }

        } catch (error) {
            window.showToast(error, 'error');
        }
    };

    useEffect(() => {
        if (data) {
            setEmail(data.email || remeberMeUser || '');
            setPhoneNumber(data.phone_number || '');
        }
    }, [data]);

    const toggleDiv = () => {
        setShowDiv(!showDiv);
        setEmail('');
        setPhoneNumber('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) {
            setPhoneError('Please enter a phone number');
        } else {
            const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                setPhoneError('Please enter a valid phone number');
            } else {
                setPhoneError('');
            }
        }
    };

    const validatePassword = (password) => {
        if(!password.trim()){
            setPasswordError('Password is required.');
        }else{
            if(activeTab !== '/login'){
                if (!(/^(?=.*\d)(?=.)(?=.*[a-zA-Z]).{8,30}$/).test(password)) {
                    setPasswordError("Password must contain at least 8 and max 30 characters including one letter and one number.");
                } else {
                    setPasswordError('');
                }

                if(confirmPassword && confirmPassword!==password){
                    setConfirmPasswordError("Password and confirm password must be the same.");
                }else{
                    setPasswordError('');
                    setConfirmPasswordError('')
                }
            }else{
                setPasswordError('');
            }
        }
    };

    const validateConfirmPassword = (cpassword) => {
        if(!cpassword.trim()){
            setConfirmPasswordError('Confirm password is required.');
        }else{
            if (password!==cpassword) {
                setConfirmPasswordError("Password and confirm password must be the same.");
            } else {
                setConfirmPasswordError('');
            }
        }
    };

    const handleConfirmPassword = (event) => {
        const value = event.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(value);
    }

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        validateEmail(value);
    };

    const handleNumberChange = (value) => {
        setPhoneNumber(value);
        validatePhoneNumber(value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value)
        validatePassword(e.target.value)
    }

    const handleFormData = async  () => {

        const payload = {
            "email": email,
            "phone_number": phoneNumber,
            "password": password,
            "confirm_password": confirmPassword,
            'tab' : activeTab
        }

        const validation = vatidated(payload);

        if(Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        setIsSpinning(true);
        setTimeout(() => {
          setIsSpinning(false);
        }, 2000);

        if(activeTab ==='/login'){
            login();
            return;
        }

        try {

            await fetch(`${process.env.REACT_APP_API_URL}/app/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function(response){
                return response.json();
            }).then(async function(resp){
                if(resp.status == 'S'){
                    sendOtp();
                }else{
                    window.showToast(resp.message, 'error');
                    setIsSpinning(false);
                }
            });

        } catch (error) {
            window.showToast(error.message, 'error');
        }
    }

    const sendOtp = async () => {

        const otpOption = email ? 'email' : 'mobile';
        const formData = email ? { email } : { phoneNumber };
        try {
            const payload = {
                "name" : "",
                "email": email,
                "phone_number": phoneNumber,
                "type": otpOption
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/app/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function(response){
                return response.json();
            }).then(function(resp){

                if(resp.status == 'S'){
                    formData.otp = resp.data.otp;
                    onUpdate({
                        ...data,
                        email: email,
                        phone_number: phoneNumber,
                        signup_type: otpOption,
                        otp: resp.data.otp,
                        tab: activeTab,
                        password: password
                    });
                    nextStep();
                }else{
                    window.showToast(resp.message, 'error');
                }
            });

        } catch (error) {
            window.showToast(error, 'error');
        }
    }

    const login = async () => {

        try {

            const payload = {
                "email": email,
                "phone_number": phoneNumber,
                "password": password
            }

            await fetch(`${process.env.REACT_APP_API_URL}/app/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function(response){
                return response.json();
            }).then(async function(resp){
                if(resp.status == 'success'){
                    if(!resp.isUser){
                        window.showToast("Your login credentials are invalid, or you do not have a registered account.", 'error');
                    }else{
                        if(resp.token){
                            localStorage.setItem('token', resp.token);
                            localStorage.setItem('userData', JSON.stringify(resp.data));
                            localStorage.setItem('isLoggedUser', true);

                            const RND = window.randomInt(999,9999);
                            localStorage.setItem('RND',RND);
                            socket.emit('user_online', `${resp.data._id}:${RND}`);
                            if(RememberMe){
                                localStorage.setItem('remeberMe', (email||''));
                            }else{
                                localStorage.removeItem('remeberMe');
                            }
                            navigate('/dashboard');
                            //window.showToast("Login Successfully!", 'success');
                        }
                    }
                }else{
                    window.showToast(resp.message, 'error');
                }
            });

        } catch (error) {
            window.showToast(error.message, 'error');
        }
    }

    const vatidated = (data) => {
        const errors = {};
        if(!showDiv){
            if(!data.email?.trim()){
                errors.email = "Email is required.";
            }else{
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    errors.email = 'Please enter a valid email address';
                }
            }
        }else{
            if (!data.phone_number) {
                errors.phone_number = 'Please enter a phone number';
            } else {
                const parsedPhoneNumber = parsePhoneNumberFromString(data.phone_number, countryCode);
                if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                    errors.phone_number = 'Please enter a valid phone number';
                }
            }
        }

        if(!data.password.trim()){
            errors.password = 'Password is required.';
        }else{
            if(activeTab !== '/login'){

                if (!(/^(?=.*\d)(?=.)(?=.*[a-zA-Z]).{8,30}$/).test(data.password)) {
                    errors.password = "Password must contain at least 8 and max 30 characters including one letter and one number.";
                }

                if(data.confirm_password && data.confirm_password!==data.password){
                    errors.confirm_password = "Password and confirm password must be the same.";
                }
            }
        }

        if(activeTab !== '/login'){

            if(!data.confirm_password?.trim()){
                errors.confirm_password = 'Confirm password is required.';
            }else{
                if(data.confirm_password && data.confirm_password!==data.password){
                    errors.confirm_password = "Password and confirm password must be the same.";
                }
            }
        }

        return errors;
    }

    const [activeTab, setActiveTab] = useState((pId?'signup':'/login'));

    const handleSelect = (eventKey) => {
      setActiveTab(eventKey);
    };

    /*  */
    const [isSpinning, setIsSpinning] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Handle the Enter key press here
            submitBtn.current.click();
        }
    }
    /*  */

    const { linkedInLogin } = useLinkedIn({
        clientId: process.env.REACT_APP_LINKEDIN_APP_ID,
        redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
        scope:"openid profile email",
        onSuccess: (code) => {
            if(code){
                getLinkedInAccess(code);
            }
        },
        onError: (error) => {
          window.showToast(error.message,'error');
        },
    });

    const getLinkedInAccess = (code) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "code": code
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/linkedin`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                onLoginSuccess('linkedin', result.data);
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error));
    }

    return (

        <div className='auth_window_content'>

            <div className="tab_form_block">

                <div className='login_bg'> <img src={loginBG} alt="" /> </div>

                <div className='tab_menu'>
                    <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                        <Nav.Item>
                            <Nav.Link eventKey="/login">Log in</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="signup">Sign up</Nav.Link>
                        </Nav.Item>
                    </Nav>


                    <div className="tab-content">
                        <div className={activeTab === '/login'?'login_window':'signup_window'}>
                        
                            <div className='auth_form_block'>
                                <h1 className='heading text-center'>{activeTab === '/login'?'Welcome Back':`Let's Get Started`}</h1>
                                <p className='login_text'> {activeTab === '/login'?'Log in':'Sign Up'}  </p>

                                {!showDiv ? (
                                    <div className='mb-3'>
                                        <div className='form-group'>
                                            <Form.Control
                                                type="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                placeholder="Email address"
                                                onKeyDown={handleKeyDown}
                                            />
                                            {errors.email && <p className="text-danger">{errors.email}</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='mb-3'>
                                        <div className='form-group'>
                                            <PhoneInput
                                                defaultCountry="US"
                                                country="US"
                                                international
                                                withCountryCallingCode
                                                placeholder="Phone number"
                                                className="form-control"
                                                value={phoneNumber}
                                                onKeyDown={handleKeyDown}
                                                onChange={handleNumberChange}
                                            />

                                            {errors.phone_number && <p className="text-danger">{errors.phone_number}</p>}
                                        </div>
                                        <p className='phone_Text'> We’ll call or text to confirm your number. Standard message and data rates apply. </p>
                                    </div>
                                )}


                                <div className='form-group password_element'>
                                    <Form.Control
                                        type={showPassword.password ? 'text' : 'password'}
                                        value={password}
                                        onChange={handlePassword}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Password"
                                    />
                                    <InputGroup.Text id="basic-addon1" onClick={() => togglePasswordVisibility('password')} style={{ cursor: 'pointer' }}>
                                        <img src={showPassword.password ? eyehide : eyeview} alt="toggle visibility" />
                                    </InputGroup.Text>
                                    {errors.password && <p className="text-danger">{errors.password}</p>}
                                </div>

                                {activeTab !== '/login' &&
                                    <div className='mt-3'>
                                        <div className='form-group password_element'>
                                            <Form.Control
                                                type={showPassword.confirm_password ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={handleConfirmPassword}
                                                placeholder="Confirm password"
                                                onKeyDown={handleKeyDown}
                                            />
                                            <InputGroup.Text id="basic-addon1" onClick={() => togglePasswordVisibility('confirm_password')} style={{ cursor: 'pointer' }}>
                                                <img src={showPassword.confirm_password ? eyehide : eyeview} alt="toggle visibility" />
                                            </InputGroup.Text>
                                            {errors.confirm_password && <p className="text-danger">{errors.confirm_password}</p>}
                                        </div>
                                    </div>
                                }

                                {activeTab === '/login' && <div className='text-end forgot_text'>
                                    <label className="checkbox">
                                        <input type="checkbox" checked={RememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember me
                                        <span className="checkmark"></span>
                                    </label>
                                    <Link to="/forgot-password"> Forgot password </Link>
                                </div>}



                                <button type='button' ref={submitBtn} className={`btn submit_btn twoToneButton ${isSpinning ? 'spinning' : ''}`} onClick={handleFormData} > Continue </button>

                                <h2><span>or</span></h2>

                                <div className='other_button_block'>
                                    <button className='btn' type='button' onClick={toggleDiv}>
                                        {!showDiv ? (
                                            <><img src={phone} alt="" /><span>Continue with Phone</span></>
                                        ) : (
                                            <><img src={emailicon} alt="" /><span>Continue with Email</span></>
                                        )}
                                    </button>

                                    <LoginSocialGoogle
                                        client_id={process.env.REACT_APP_GG_APP_ID}
                                        redirect_uri={REDIRECT_URI}
                                        scope="openid profile email"
                                        onResolve={({ provider, data }) => {
                                            console.log(data);
                                            onLoginSuccess(provider, data);
                                        }}
                                        onReject={err => {
                                            console.log(err.message);
                                        }}
                                    >
                                        <button className='btn' type='button'>
                                            <img src={GoogleLogo} alt="Google Logo" /> <span>Continue with Google</span>
                                        </button>
                                    </LoginSocialGoogle>

                                    <button className='btn' type='button' onClick={linkedInLogin}>
                                        <img src={linkedin} alt="" /> <span>Continue with LinkedIn</span>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default GetStarted;
