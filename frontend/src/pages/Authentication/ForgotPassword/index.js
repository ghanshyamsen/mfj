import React, {useState, useEffect}  from 'react';
import siteLogo from '../../../assets/images/logo.png';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { Wizard } from "react-use-wizard";
import GetStart from "./getStart";
import VerifiedCode from "./VerifiedCode";
import ResetPassword from "./resetPassword";
import loginBG from '../../../assets/images/howimg4.png'

function ForgotPassword() {

    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [userId, setUserId] = useState('');
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        password:"",
        confirm_password:""
    });
    const [toCode, setToCode] = useState('');
    const [toType, setToType] = useState('');
    const history = useNavigate();
    const TOKEN = localStorage.getItem('token');

    useEffect(() => {
        if (shouldSubmit) {
            handleSubmit();
            setShouldSubmit(false);
        }
    }, [shouldSubmit]);

    const handleSubmit = async () => {

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

        fetch(`${process.env.REACT_APP_API_URL}/app/reset-password/${userId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'success') {
                history('/login');
                window.showToast(result.message,"success");
            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error.message));
    }

    return(
        <>

            <div className="auth-page fortgot-page">
                <div className="siteLogo mb-3"> <Link to="/"> <img className='logo' src={siteLogo} alt='logo' /> </Link> </div>
                <Container>
                    <div className="tab_form_block">

                        <div className='login_bg'> <img src={loginBG} alt="" /> </div>
                        <div className='tab_menu'>
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <Wizard>
                                    <GetStart setUserId={setUserId} setOtp={setOtp} setToCode={setToCode} setToType={setToType} />
                                    <VerifiedCode otp={otp} toCode={toCode} toType={toType} setOtp={setOtp} />
                                    <ResetPassword formData={formData} setFormData={setFormData} handleSubmitForm={() => setShouldSubmit(true)} />
                                </Wizard>
                            </form>
                        </div>

                    </div>
                </Container>
            </div>

        </>
    );
}

export default ForgotPassword;


