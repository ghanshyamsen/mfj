import React from 'react';
import Lamp from '../../assets/images/Lamp.png';
import { useNavigate } from 'react-router-dom';

function VerifiedAccount({loginType}) {
    const navigate = useNavigate();

    const redirectToNextPage = () => {
        navigate("/dashboard");
        window.showToast("Account verification successfull!", 'success');
    };

    return (
        <div className='auth_form_block'>

            <div className='va_icon'>
                <img src={Lamp} alt="" />
            </div>
            <h1 className='va_title'> Account verification </h1>

            {loginType === 'email' ? (
                <p className='va_text'> After admin approval, you'll get full access to the platform. You'll receive an email once your profile is approved. </p>
            ) : (
                <p className='va_text'> After admin approval, you'll get full access to the platform. You'll receive an sms message once your profile is approved. </p>
            )}

            <button type='button' className='btn submit_btn' onClick={redirectToNextPage}> Continue </button>

        </div>
    );
}

export default VerifiedAccount;
