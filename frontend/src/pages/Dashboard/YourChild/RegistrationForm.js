import React, { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import BackArrow from '../../../assets/images/fi_arrow-left.svg';
import PhoneInput from 'react-phone-number-input/input'
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import 'react-phone-number-input/style.css'
import emailicon from '../../../assets/images/fi_mail.svg';
import GoogleLogo from '../../../assets/images/Googlelogo.svg';
import linkedin from '../../../assets/images/linkedin.svg';
import phone from '../../../assets/images/u_phone.svg';
import InputGroup from 'react-bootstrap/InputGroup';
import eyehide from '../../../assets/images/eyehide.png';
import eyeview from '../../../assets/images/eyeview.png';

import userDataHook from "../../../userDataHook";
import { decrypt } from '../../../cryptoUtils';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useLinkedIn  } from 'react-linkedin-login-oauth2';

const RegistrationForm = ({closeModal, successRegistered, fetchMember}) => {
    const [showEmailDiv, setShowEmailDiv] = useState(true);
    const [showDiv, setShowDiv] = useState(true);

    const [showOtpDiv, setShowOtpDiv] = useState(false);
    const [showChildNameDiv, setShowChildNameDiv] = useState(false);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [password, setPassword] = useState('');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [expectedotp, setExpectedOtp] = useState('');

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(60);

    const [isLoginDisabled, setIsLoginDisabled] = useState(false);
    const [error, setError] = useState('');
    const [perror, setPError] = useState('');
    const [errors, setErrors] = useState({});

    const [verificationResult, setVerificationResult] = useState('');
    const inputRefs = useRef([]);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleNumberChange = (value) => setPhoneNumber(value);
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleContinueClick = () => {


        if (showEmailDiv) {

            let isValid = true;

            if(showDiv){
                if(email.trim()==''){
                    setError('Email is required.');
                    isValid = false;
                }else{
                    if(!validateEmail(email.trim())){
                        setError('Please enter valid email.');
                        isValid = false;
                    }
                }
            }else{
                if(phoneNumber.trim() ==''){
                    setError('Phone number is required.');
                    isValid = false;
                }else{
                    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US');
                    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                        setError('Please enter a valid phone number');
                        isValid = false;
                    }
                }
            }

            if(!password.trim()){
                setPError("Password is required");
                isValid = false;
            }else{
                if (!(/^(?=.*\d)(?=.)(?=.*[a-zA-Z]).{8,30}$/).test(password)) {
                    setPError("Password must contain at least 8 and max 30 characters including one letter and one number.");
                    isValid = false;
                }
            }

            if(!isValid){
                return isValid;
            }

            setError('');
            setPError('');
            resetOtp();

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "email": email,
                "phone_number": phoneNumber,
                "type": (email?'email':'phone')
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };


            fetch(`${process.env.REACT_APP_API_URL}/app/check-teenger`, requestOptions)
            .then((response) => response.json())
            .then((result) => {

                if(result.status === "success" && result.isUser) {
                    window.showToast("This account already exists in the system. To add this child to your account, please select the 'Add Existing Account' option.",'error');
                }else{

                    fetch(`${process.env.REACT_APP_API_URL}/app/send-otp`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        if(result.status === "S"){
                            setMinutes(1);
                            setSeconds(0);
                            let code = decrypt(result.data.otp);
                            setExpectedOtp(code);
                            setShowEmailDiv(false);
                            setShowOtpDiv(true);
                            setError('');
                        }else{
                            window.showToast(result.message,'error');
                        }
                    })
                    .catch((error) => console.error(error));
                }

            })
            .catch((error) => console.error(error));
        }else if(showOtpDiv){

            let code = otp.join('');

            if(code.trim() == ''){
                setError('Please enter code.');
                return;
            }

            if(code !== expectedotp){
                setError('Please enter valid code.');
                return;
            }else{
                setError('');
                setShowEmailDiv(false);
                setShowOtpDiv(false);
                setShowChildNameDiv(true);
            }
        }

    };

    const resetOtp = () => {
        setOtp(['', '', '', '', '', '']);
    }

    const TOKEN = localStorage.getItem('token');
    const userData = userDataHook();

    const REDIRECT_URI = window.location.href;

    const [socialProvider, setSocialProvider] = useState('');
    const [connectData, setConnectData] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else {
                if (minutes > 0) {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                } else {
                    clearInterval(interval);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds, minutes]);

    const onConnectSuccess = async (provider, data) => {
        if (showEmailDiv) {
            try {

                const signup_type = provider;
                const connect_data = data;

                if(connect_data.email){

                    setSocialProvider(signup_type);
                    setConnectData(connect_data);

                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

                    const raw = JSON.stringify({
                        "email": connect_data.email,
                        "phone_number": "",
                        "type": 'email'
                    });

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };


                    fetch(`${process.env.REACT_APP_API_URL}/app/check-teenger`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        if(result.status === "success" && result.isUser) {
                            window.showToast("This child already exist, please choose existing account.",'error');
                        }else{
                            setShowEmailDiv(false);
                            setShowOtpDiv(false);
                            setShowChildNameDiv(true);

                            setFirstName(connect_data.given_name)
                            setLastName(connect_data.family_name)

                            //handleSubmit();
                        }
                    })
                    .catch((error) => console.error(error));
                }
            } catch (error) {
                window.showToast(error.message, 'error');
            }
        }
    };

    const handleBackClick = () => {
        setError('');
        if (showOtpDiv) {
            setShowOtpDiv(false);
            setShowEmailDiv(true);
        } else if (showChildNameDiv) {
            setShowChildNameDiv(false);
            setShowOtpDiv(true);
        }
    };

    const handleOtpChange = (e, index) => {
        const { value } = e.target;

        if(!isNaN(value)){
            setVerificationResult('');
            setOtp(prevOtp => {
                const newOtp = [...prevOtp];
                newOtp[index] = value;

                if (value.length === 1 && index < 5) {
                    inputRefs.current[index + 1].focus();
                }
                return newOtp;
            });
        }
    };

    const handleBackspace = (e, index) => {
        if (e.keyCode === 8 && index > 0 && !otp[index]) {
            inputRefs.current[index - 1].focus();
            setOtp(prevOtp => {
                const newOtp = [...prevOtp];
                newOtp[index - 1] = '';
                return newOtp;
            });
        }
    };

    const handlePaste = (e, index) => {
        const pastedData = e.clipboardData.getData('text');
        const pastedOtp = pastedData.split('').slice(0, 6); // Limit to 6 characters
        setOtp(prevOtp => {
            const newOtp = [...prevOtp];
            pastedOtp.forEach((digit, i) => {
                if(!isNaN(digit)){
                    if (index + i < 6) {
                        newOtp[index + i] = digit;
                    }
                }
            });
            return newOtp;
        });
    };

    const handleSubmit = async () => {

        const errors = {};
        if(!firstName){
            errors.first_name = "First name is required";
        }

        if(!lastName){
            errors.last_name = "Last name is required";
        }

        if(Object.keys(errors).length > 0){
            setErrors(errors);
            return
        }

        setErrors({});


        const Email = (socialProvider === 'google'||socialProvider === 'linkedin'? connectData.email : email);
        const UType = (socialProvider?socialProvider:(phoneNumber?'mobile':'email'));

        const payload = {
            google_connect: (socialProvider === 'google'? true : false),
            linkedin_connect: (socialProvider === 'linkedin'? true : false),
            google_connect_data: (socialProvider === 'google'? JSON.stringify(connectData) : {}),
            linkedin_connect_data: (socialProvider === 'linkedin'? JSON.stringify(connectData) : {}),
            first_name: firstName,
            last_name: lastName,
            email:(UType!=='mobile'?Email:''),
            phone_number:(UType==='mobile'?phoneNumber:''),
            parents_id: userData._id,
            user_type:"teenager",
            signup_type:UType,
            social_media_id: (connectData?connectData.sub:''),
            profile_image:"",
            password: (password||'Password1234')
        }

        const formData = new FormData();

        for (const key in payload) {
            if (payload.hasOwnProperty(key)) {
                formData.append(key, payload[key]);
            }
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/app/register`, {
            method: 'POST',
            body: formData,
        }).then(response => response.json());

        if (response.status === 'S') {

            if (connectData) {
                const profileImage = { profile_image: connectData.picture };

                /* upload profile image api */
                const responseImage = await fetch(`${process.env.REACT_APP_API_URL}/app/update-profile-image/${response.data._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + TOKEN
                    },
                    body: JSON.stringify(profileImage)
                }).then(response => response.json());
            }

            window.showToast("Your child or member added successfully.", 'success');
            closeModal();
            successRegistered();
            fetchMember();
        } else {
            window.showToast(response.message, 'error');
        }
    }

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
                onConnectSuccess('linkedin', result.data);
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error));
    }


    const resendOTP = async () => {
        setMinutes(1);
        setSeconds(0);

        const UType = (socialProvider?socialProvider:(phoneNumber?'mobile':'email'));

        try {

            const payload = {
                "name" : "",
                "email": (UType==='email'?email:''),
                "phone_number": (UType==='mobile'?phoneNumber:''),
                "type": UType
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/app/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function(response){
                return response.json();
            }).then(async function(resp){
                if(resp.status == 'S'){
                    let code = decrypt(resp.data.otp);
                    setExpectedOtp(code);
                    window.showToast("Resend OTP Successfully!", 'success');
                }else{
                    window.showToast(resp.message, 'error');
                }
            });

        } catch (error) {
            window.showToast(error, 'error');
        }

    };

    const toggleDiv = () => setShowDiv(!showDiv);

    return (
        <>
            <div className='auth_form_block' style={{ display: showEmailDiv ? 'block' : 'none' }}>
               {/*  <button type='button' className='back_btn' onClick={handleBackClick}>
                    <img src={BackArrow} alt="" />
                </button> */}
                <h1 className="heading"> Register your child </h1>
                <p className='login_text'> They can also do it themselves </p>
                {showDiv ? (
                    <div className='mb-3'>
                        <div className='form-group'>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Email address"
                            />
                        </div>
                        {error && <small className="error" style={{ color: "red" }}>{error}</small>}
                    </div>
                ) : (
                    <div className='mb-3'>
                        <div className='form-group'>
                            <PhoneInput
                                defaultCountry="US"
                                country="US"
                                international
                                withCountryCallingCode
                                className="form-control"
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                        {error && <small className="error" style={{ color: "red" }}>{error}</small>}
                        <p className='phone_Text'> We’ll call or text to confirm your number. Standard message and data rates apply. </p>
                    </div>
                )}

                <FloatingLabel controlId="floatingPassword" label={<span> Password <span className='required'>*</span> </span>}  className='mb-3 password_element'>
                    <Form.Control type={showPassword ? 'text' : 'password'} name="password" placeholder="" onChange={handleChangePassword} value={password||''} />
                    <InputGroup.Text id="basic-addon1"  onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                        <img src={showPassword ? eyehide : eyeview} alt="toggle visibility" />
                    </InputGroup.Text>
                    {perror && <small className="error">{perror}</small>}
                </FloatingLabel>

                <button type='button' className='btn submit_btn' onClick={handleContinueClick} disabled={isLoginDisabled}> Continue </button>
                <h2><span>or</span></h2>
                <div className='other_button_block'>
                    <button className='btn' type='button' onClick={toggleDiv}>
                        {showDiv ? (
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
                            onConnectSuccess(provider, data);
                        }}
                        onReject={err => {
                            console.error(err.message);
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

            <div className='auth_form_block otp_block' style={{ display: showOtpDiv ? 'block' : 'none' }}>
                <button type='button' className='back_btn' onClick={handleBackClick}>
                    <img src={BackArrow} alt="" />
                </button>
                <h1 className='heading'>6-digit code</h1>
                <p className='login_text'>
                    Code sent to {email?email:phoneNumber}
                    <br/>
                    {/* <span>Code : {expectedotp}</span> */}
                </p>

                <div className="otp_verify_block">
                    <div className='otp_input'>
                        {[0,1,2,3,4,5].map((index) => (
                            <Form.Control
                                key={index}
                                type="text"
                                maxLength="1"
                                inputMode="numeric"
                                pattern="[0-9]"
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(e, index)}
                                ref={el => (inputRefs.current[index] = el)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                                className={verificationResult ? 'error' : ''}
                                onPaste={(e) => handlePaste(e, index)}
                            />
                        ))}

                    </div>

                    {seconds ? (
                    <p className="otp-timer">
                        Resend code in {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                    ) : (
                        <button type='button' className='sendotp_btn btn' onClick={resendOTP}>Resend</button>
                    )}

                    {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                </div>
                <button type='button' className='btn submit_btn mb-0' onClick={handleContinueClick}> Continue </button>
            </div>

            <div className='auth_form_block child_name_block' style={{ display: showChildNameDiv ? 'block' : 'none' }}>
                {!socialProvider && <button type='button' className='back_btn' onClick={handleBackClick}>
                    <img src={BackArrow} alt="" />
                </button>}
                <h1 className='heading'>Full Name of your child as on ID</h1>
                <p className='login_text'> Name of your child as in their official documents </p>
                <FloatingLabel controlId="floatingFirstName" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                    <Form.Control
                        type="text"
                        name="firstName"
                        placeholder=""
                        value={firstName}
                        onChange={handleFirstNameChange}
                    />

                    {errors?.first_name && <div className="error" style={{ color: "red" }}>{errors?.first_name}</div>}
                </FloatingLabel>
                <FloatingLabel controlId="floatingLastName" label={<span> Last Name <span className='required'>*</span> </span>}>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="lastName"
                        value={lastName}
                        onChange={handleLastNameChange}
                    />
                    {errors?.last_name && <div className="error" style={{ color: "red" }}>{errors?.last_name}</div>}
                </FloatingLabel>
                <button type='button' className='btn submit_btn mb-0' onClick={handleSubmit}> Continue </button>
            </div>
        </>
    );
};

export default RegistrationForm;
