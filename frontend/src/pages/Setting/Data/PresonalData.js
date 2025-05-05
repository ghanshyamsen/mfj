import React, {useState} from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left-gray.svg';
import Lamp from '../../../assets/images/Lamp.png';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function PresonalData({onBackClick }) {

    const [isVisible, setIsVisible] = useState(true);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const TOKEN = localStorage.getItem('token');

    const handleFormData = () => {
        if(validateEmail(email)){

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "email": email
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/mail-personal-data`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setIsVisible(!isVisible);
                    //window.showToast(result.message,"success");
                }else{
                    window.showToast(result.message,"error");
                }
            })
            .catch((error) => console.error(error));

        }
    }

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
    };

    const validateEmail = (email) => {
        // Basic email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };


    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}><img src={BackArrow} alt="" /></button>
                <h1 className="heading"> Personal Data </h1>
            </div>

            {isVisible && (
                <div className='setting_common_block personal_data_block'>
                    <h1 className='scb_heading'> Personal Data Request </h1>
                    <p className='scb_description'> Please enter your email address below to proceed with your personal data request.  </p>

                    <FloatingLabel controlId="floatingEmail" label={<span> Email <span className='required'>*</span> </span>} className="mb-3" >
                        <Form.Control type="email" name="email" onChange={handleEmailChange} placeholder=""/>
                        {emailError && <p className="text-danger">{emailError}</p>}
                    </FloatingLabel>


                    <button type='button' className='btn submit_btn' onClick={handleFormData}> Send </button>
                </div>
            )}

            {!isVisible && (
                <div className='email_sent_block'>
                    <div className=''> <img src={Lamp} alt="" /> </div>
                    <h1 className=''>Email Sent</h1>
                    <p>Check your email for a copy of your personal data</p>
                </div>
            )}

        </>
    );
}

export default PresonalData;

