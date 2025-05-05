import React, { useState, useRef} from 'react';
import { Form } from 'react-bootstrap';
import BackArrow from '../../../assets/images/fi_arrow-left.svg';
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import emailicon from '../../../assets/images/fi_mail.svg';
import phone from '../../../assets/images/u_phone.svg';

import userDataHook from "../../../userDataHook";

import { decrypt } from '../../../cryptoUtils';

const RegistrationForm = ({closeModal, fetchMember}) => {
    const [showEmailDiv, setShowEmailDiv] = useState(true);
    const [showDiv, setShowDiv] = useState(true);

    const [showOtpDiv, setShowOtpDiv] = useState(false);
    const [showChildNameDiv, setShowChildNameDiv] = useState(false);

    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [expectedotp, setExpectedOtp] = useState('');

    const [verificationResult, setVerificationResult] = useState('');
    const inputRefs = useRef([]);

    const [isLoginDisabled, setIsLoginDisabled] = useState(false);
    const [error, setError] = useState('');
    const [teen, setTeen] = useState('');

    const TOKEN = localStorage.getItem('token');
    const userData = userDataHook();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePhoneNumberChange = (value) => setPhoneNumber(value);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleContinueClick = () => {

        if(showDiv){
            if(email.trim()==''){
                setError('Email is required.');
                return false;
            }else{
                if(!validateEmail(email.trim())){
                    return setError('Please enter valid email.');
                }
            }
        }else{
            if(phoneNumber.trim() ==''){
                setError('Phone number is required.');
                return false;
            }
        }

        setError('');

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "email": email,
            "phone_number": phoneNumber,
            "type": (email?'email':'phone'),
            "uid": (userData?userData._id:'')
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

                setTeen(result.id);

                fetch(`${process.env.REACT_APP_API_URL}/app/send-otp`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if(result.status === "S"){
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

            }else{
                if(result.message){
                    window.showToast(result.message,'error');
                }else{
                    window.showToast("Invalid request, no child record found!!",'error');
                }

            }
        })
        .catch((error) => console.error(error));

    };

    const handleBackClick = () => {
        setShowOtpDiv(false);
        setShowEmailDiv(true);
    };

    const handleSubmit = () => {
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

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                parents_id: (userData?userData._id:'')
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${teen}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status === "success"){
                    window.showToast("Child added successfully.",'success');
                    closeModal();
                    fetchMember();
                }else{
                    window.showToast(result.message,'error');
                }
            })
            .catch((error) => console.error(error));
        }
    }

    const handleOtpChange = (e, index) => {
        const { value } = e.target;
        setVerificationResult('');
        setOtp(prevOtp => {
            const newOtp = [...prevOtp];
            newOtp[index] = value;

            if (value.length === 1 && index < 5) {
                inputRefs.current[index + 1].focus();
            }
            return newOtp;
        });
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
                if (index + i < 6) {
                    newOtp[index + i] = digit;
                }
            });
            return newOtp;
        });
    };

    const toggleDiv = () => setShowDiv(!showDiv);

    return (
        <>
            <div className='auth_form_block' style={{ display: showEmailDiv ? 'block' : 'none' }}>
                {/* <button type='button' className='back_btn' onClick={handleBackClick}>
                    <img src={BackArrow} alt="" />
                </button> */}
                <h1 className="heading"> Add existing account </h1>
                {/* <p className='login_text'> They can also do it themselves </p> */}
                {showDiv ? (
                    <div className=''>
                        <div className='form-group'>
                            <Form.Control
                                type="email"
                                value={email || ''}
                                onChange={handleEmailChange}
                                placeholder="Email address"
                            />
                        </div>
                        {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                    </div>
                ) : (
                    <div className=''>
                        <div className='form-group'>
                            <PhoneInput
                                defaultCountry="US"
                                country="US"
                                international
                                withCountryCallingCode
                                placeholder="Phone number"
                                className="form-control"
                                value={phoneNumber || ''}
                                onChange={handlePhoneNumberChange}
                            />
                        </div>
                        {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                        <p className='phone_Text'> We’ll call or text to confirm your number. Standard message and data rates apply. </p>
                    </div>
                )}
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
                </div>
            </div>

            <div className='auth_form_block otp_block' style={{ display: showOtpDiv ? 'block' : 'none' }}>
                <button type='button' className='back_btn' onClick={handleBackClick}>
                    <img src={BackArrow} alt="" />
                </button>
                <h1 className='heading'>6-digit code</h1>
                <p className='login_text'>
                    <span>Code sent to: {(email?email:phoneNumber)}</span>
                    <br/>
                    {/* <span>Code : {expectedotp}</span> */}
                </p>
                <div className="otp_verify_block">
                    <div className='otp_input'>
                        {otp.map((digit, index) => (
                            <Form.Control
                                key={index}
                                type="text"
                                maxLength="1"
                                inputMode="numeric"
                                pattern="[0-9]"
                                value={digit}
                                onChange={(e) => handleOtpChange(e, index)}
                                ref={el => (inputRefs.current[index] = el)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                                className={verificationResult ? 'error' : ''}
                                onPaste={(e) => handlePaste(e, index)}
                            />
                        ))}
                    </div>
                    {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                </div>
                {/* <p className="otp-timer"> Resend code in </p> */}
                <button type='button' className='btn submit_btn mb-0' onClick={handleSubmit}> Continue </button>
            </div>
        </>
    );
};

export default RegistrationForm;
