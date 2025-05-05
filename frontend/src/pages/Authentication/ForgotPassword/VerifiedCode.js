import React, {useState,useEffect }  from 'react';
import { InputOtp } from 'primereact/inputotp';
import { useWizard } from "react-use-wizard";
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import { Button } from 'primereact/button'

function VerifiedCode({otp, toCode, toType, setOtp}) {

    const [token, setTokens] = useState('');
    const { previousStep, nextStep } = useWizard();
    const [error, setError] = useState('');

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(60);

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

    const resendOTP = async () => {
        setMinutes(1);
        setSeconds(0);

        try {

            const payload = {
                "name" : "",
                "email": (toType==='email'?toCode:''),
                "phone_number": (toType==='mobile'?toCode:''),
                "type": toType
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
                    setOtp(resp.data.otp);
                    window.showToast("Resend OTP Successfully!", 'success');
                }else{
                    window.showToast(resp.message, 'error');
                }
            });

        } catch (error) {
            window.showToast(error, 'error');
        }

    };

    const handleFormData = () => {
        if(!token){
            setError('Code is required, please enter a valid code');
            return
        }
        setError('');
        if(otp === token) {
            nextStep();
        }else{
            setError('The code you entered is incorrect. Please double-check and try again.');
        }
    }

    return(
        <>
            <div className='auth_form_block'>
                <button type='button' className='back_btn' onClick={previousStep}>
                    <img src={backArrow} alt="" />
                </button>
                <h1 className='heading'>6-digit code</h1>
                <p className='login_text'> Code sent to {toCode} </p>
                <div className="flex justify-content-center">
                    <InputOtp value={token} onChange={(e) => setTokens(e.value)} length={6} integerOnly/>
                    {error && <small className="error" style={{color:"red"}}>{error}</small>}
                    {/* <div className="flex justify-content-between mt-4 align-self-stretch">
                        <Button label="Resend Code" link className="p-0 resend_code"></Button>
                    </div> */}
                    {seconds ? (
                    <p className="otp-timer">
                        Resend code in {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                    ) : (
                        <button type='button' className='sendotp_btn btn' onClick={resendOTP}>Resend</button>
                    )}
                    <button type='button' className='btn submit_btn' onClick={handleFormData}> Continue </button>
                </div>
            </div>

        </>
    )
}

export default VerifiedCode;