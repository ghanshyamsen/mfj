import React, { useState, useEffect, useRef } from 'react';
import { useWizard } from "react-use-wizard";
import { Form } from 'react-bootstrap';
import backArrow from '../../assets/images/fi_arrow-left.svg';
import { decrypt } from '../../cryptoUtils';
import { useNavigate } from 'react-router-dom';

function VerifiedCode({data, onUpdate}) {
    const { previousStep, nextStep } = useWizard();
    const navigate = useNavigate();
    const phoneNumber = data.phone_number;
    const emailAdress = data.email;
    let Resotp = data.otp;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [expectedOtp, setExpectedOtp] = useState(Resotp);
    const [verificationResult, setVerificationResult] = useState('');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(60);
    const inputRefs = useRef([]);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

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

    const resendOTP = async () => {
        setMinutes(1);
        setSeconds(0);
        setEmail(emailAdress);
        setPhone(phoneNumber)

        const otpOption = phoneNumber ? 'mobile' : 'email';

        try {

            const payload = {
                "name" : "",
                "email": emailAdress,
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
            }).then(async function(resp){
                if(resp.status == 'S'){
                    setExpectedOtp(resp.data.otp);
                    window.showToast("Resend OTP Successfully!", 'success');
                }else{
                    window.showToast(resp.message, 'error');
                }
            });

        } catch (error) {
            window.showToast(error, 'error');
        }

    };

    const handleSubmit = async () => {
        const mergedOtp = otp.join('');
        const decrypted = decrypt(expectedOtp);
        if (mergedOtp === decrypted) {
            if (seconds === 0) {
                setVerificationResult('Code expired. Please request a new code.');
            } else {
                try {
                    const payload = {
                        "email": emailAdress,
                        "phone_number": phoneNumber,
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
                                nextStep();
                            }else{
                                if(resp.token){
                                    localStorage.setItem('token', resp.token);
                                    localStorage.setItem('userData', JSON.stringify(resp.data));
                                    localStorage.setItem('isLoggedUser', true);
                                    navigate('/dashboard');
                                    window.showToast("Login Successfully!", 'success');
                                }
                            }
                        }else{
                            window.showToast(resp.message, 'error');
                        }
                    });

                } catch (error) {
                    window.showToast(error, 'error');
                }
            }
        } else {
            setVerificationResult('The code you entered is incorrect. Please double-check and try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        }
    };

    return (
        <>
            <div className='auth_form_block'>
                <button type='button' className='back_btn' onClick={previousStep}>
                    <img src={backArrow} alt="" />
                </button>
                <h1 className='heading'>6-digit code</h1>
                <p className='login_text'> Code sent to
                    {phoneNumber ?  (
                            <span> {phoneNumber}</span>
                        ) : (
                        <span> {emailAdress}</span>
                        )
                    }
                    <br/>
                    {/* <span>Code : {decrypt(expectedOtp)}</span> */}
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
                    {<p style={{ color: 'red', fontSize: '12px', margin: '5px 0px 0px 5px' }}>{verificationResult}</p>}
                </div>

                {seconds ? (
                <p className="otp-timer">
                    Resend code in {minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                </p>
                ) : (
                    <button type='button' className='sendotp_btn btn' onClick={resendOTP}>Resend</button>
                )}

                {message}

                <button type='button' className='btn submit_btn' onClick={handleSubmit}> Continue </button>

            </div>
        </>
    );
}

export default VerifiedCode;
