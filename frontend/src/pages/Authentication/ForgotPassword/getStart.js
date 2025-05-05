import React, {useState}  from 'react';
import { useWizard } from "react-use-wizard";
import { Form } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import { Link } from "react-router-dom";
import phone from '../../../assets/images/u_phone.svg';
import emailicon from '../../../assets/images/fi_mail.svg';
import { decrypt } from '../../../cryptoUtils';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js

function GetStart({setUserId, setOtp, setToCode, setToType}) {

    const { nextStep } = useWizard();

    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('US'); // Define default country code, e.g., 'US'
    const [showDiv, setShowDiv] = useState(false);
    const TOKEN = localStorage.getItem('token');
    const [error, setError] = useState('');

    const handleFormData = () => {

        if(!email && !phoneNumber){
            setError('This field is required.');
            return
        }

        if(email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)){
            setError('Invalid email address, please enter a valid email address.');
            return
        }

        if(phoneNumber){
            const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                setError('Please enter a valid phone number');
                return
            }
        }

        setError('');
        setToCode(email||phoneNumber);
        setToType((email?'email':'mobile'));

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "email": email,
            "phone_number": phoneNumber,
            "type": true
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/forgot-password`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                setUserId(result.data.id);
                setOtp(decrypt(result.data.otp));
                nextStep();
                window.showToast(result.message,'success');
            }else{
                window.showToast(result.message,'error');
            }
        })
        .catch((error) => console.error(error));
    }

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
    };

    const handleNumberChange = (value) => {
        setPhoneNumber(value);
    };

    const toggleDiv = () => {
        setShowDiv(!showDiv);
        setPhoneNumber('');
        setEmail('');
    };

    return(
        <>
            <div className='auth_form_block'>
                <h1 className="heading mb-4"> Forgot Password </h1>
                {!showDiv ? (
                    <div className='mb-3'>
                        <div className='form-group'>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Email address"
                            />
                            {error && <small className="error" style={{color:"red"}}>{error}</small>}
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
                                onChange={handleNumberChange}
                            />
                            {error && <small className="error" style={{color:"red"}}>{error}</small>}
                        </div>
                        <p className='phone_Text'> We’ll call or text to confirm your number. Standard message and data rates apply. </p>
                    </div>
                )}

                    <div className='forgot_text justify-content-end'> <p className='mb-0'> Back to <Link to="/login"> Log in </Link> </p> </div>

                    <button type='button' className='btn submit_btn' onClick={handleFormData}> Continue </button>

                    <h2><span>or</span></h2>

                    <div className='other_button_block'>
                        <button className='btn' type='button' onClick={toggleDiv}>
                            {!showDiv ? (
                                <><img src={phone} alt="" /><span>Continue with phone</span></>
                            ) : (
                                <><img src={emailicon} alt="" /><span>Continue with email</span></>
                            )}
                        </button>
                    </div>
            </div>

        </>
    )
}

export default GetStart;