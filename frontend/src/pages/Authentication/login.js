import React, { useState, useEffect, useRef } from 'react';
import './auth.css';
import { Container } from 'react-bootstrap';
import GetStrated from "./GetStrated";
import VerifiedCode from "./VerifiedCode";
import UserType from "./UserType";
import EmployerType from "./EmployerType";
import UserInfo from "./UserInfo";
import YourChild from './yourChild';
import BusinessInfo from "./BusinessInfo";
import VerifiedBusiness from "./VerifiedBusiness";
import VerifiedAccount from "./VerifiedAccount";
import siteLogoImg from '../../assets/images/logo.png';
import MetaBanner from '../../assets/images/metabanner.jpg';
import { Wizard } from "react-use-wizard";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import socket from '../../socket';
import { useProfile } from '../../ProfileContext';


import $ from 'jquery';


function Login() {

    const {theme, siteLogo, setSiteLogo} = useProfile();
    const {key:pId} = useParams();

    const params = new URL(window.location.href).searchParams;
    const refCode = params.get("ref");


    const history = useNavigate();
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const [formData, setFormData] = useState({});
    const [privacyPolicy, setPrivacyPolicy] = useState('');

    const [showVerifiedBusiness, setShowVerifiedBusiness] = useState(false);
    const [shouldSubmit, setShouldSubmit] = useState(false);

    const SiteConfig = JSON.parse(localStorage.getItem('ConfigData'));

    const loginType = (formData?.otpOption?formData.otpOption:'');
    const submitBtn = useRef(null)

    useEffect(() => {
        if (shouldSubmit) {
            handleSubmit();
            setShouldSubmit(false);
        }
    }, [shouldSubmit, formData]);

    useEffect(() => {
        setSiteLogo(SiteConfig?.app_logo);
    },[!SiteConfig?.app_logo]);

    useEffect(() => {
        const myHeaders = new Headers();

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/privacy-policy`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPrivacyPolicy(result.data.content);
            }
        })
        .catch((error) => console.error(error.message));
    },[])


    const handleCloseModal = () => {
        setShowPrivacyModal(false);
    };

    const handleOpenPrivacyModal = () => {
        setShowPrivacyModal(true);
    }


    const handleSubmit = async () => {

        let submit_btn = $(submitBtn.current);

        submit_btn.attr('disabled', 'disabled');
        submit_btn.find('.spinner-border').show();

        try{

            const formDataObject = new FormData();
            formDataObject.append('first_name', (formData.first_name||formData.connect_data.given_name));
            formDataObject.append('last_name', (formData.last_name||formData.connect_data.family_name));
            formDataObject.append('preferred_name', (formData.preferred_name||''));
            formDataObject.append('user_type', (pId?'teenager':formData.user_type));
            formDataObject.append('signup_type', formData.signup_type);
            formDataObject.append('social_media_id', (formData?.connect_data?.sub||''));
            formDataObject.append('email', (formData.email||''));
            formDataObject.append('phone_number', (formData.phone_number||''));
            formDataObject.append('business_type', (formData.business_type || ""));
            formDataObject.append('location', (formData.location || ""));
            formDataObject.append('street_address', (formData.street_address || ""));
            formDataObject.append('city', (formData.city || ""));
            formDataObject.append('state', (formData.state || ""));
            formDataObject.append('zip_code', (formData.zip_code || ""));
            formDataObject.append('business_ein_number', (formData.business_ein_number|| ""));
            formDataObject.append('employer_type', (formData.employer_type||''));
            formDataObject.append('number_of_employees', (formData.number_of_employees||''));
            formDataObject.append('hear_about', (formData.hear_about||''));
            formDataObject.append('hear_about_other', (formData.hear_about_other||''));
            formDataObject.append('google_connect', formData.signup_type === 'google' ? true : false);
            formDataObject.append('linkedin_connect', formData.signup_type === 'linkedin' ? true : false);
            formDataObject.append('google_connect_data', formData.signup_type === 'google' ? JSON.stringify(formData.connect_data) : []);
            formDataObject.append('linkedin_connect_data', formData.signup_type === 'linkedin' ? JSON.stringify(formData.connect_data) : []);
            formDataObject.append('password', (formData.password||'Password1234'));
            formDataObject.append('reference_code', (formData?.reference_code||''));
            formDataObject.append('date_of_birth', (formData?.date_of_birth||''));

            if (formData?.files?.length > 0) {
                formData.files.forEach(file => {
                    formDataObject.append('business_document', file);
                });
            }

            if(pId && formData.user_type==='teenager'){
                formDataObject.append('parents_id',pId);
            }

            if (formDataObject) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/app/register`, {
                    method: 'POST',
                    body: formDataObject,
                }).then(response => response.json());

                if (response.status === 'S') {
                    //setShowVerifiedBusiness(true);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userData', JSON.stringify(response.data));
                    localStorage.setItem('isLoggedUser', true);

                    if (formData.connect_data) {
                        const profileImage = { profile_image: formData.connect_data.picture };

                        const RND = window.randomInt(999,9999);
                        localStorage.setItem('RND',RND);
                        socket.emit('user_online', `${response.data._id}:${RND}`);

                        //upload profile image api
                        const responseImage = await fetch(`${process.env.REACT_APP_API_URL}/app/update-profile-image/${response.data._id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + response.token
                            },
                            body: JSON.stringify(profileImage)
                        }).then(response => response.json());

                        await handleResumeImage(response.token, formData.connect_data.picture, response.data._id);

                        response.data.profile_image = responseImage.image;
                        localStorage.setItem('userData', JSON.stringify(response.data));

                        if(formData.user_type==='teenager'){
                            history('/personal-detail');
                        }else if(formData.user_type==='manager'){
                            history('/company-profile');
                        }else{
                            history('/dashboard');
                        }

                    }else{
                        if(formData.user_type==='teenager'){
                            history('/personal-detail');
                        }else if(formData.user_type==='manager'){
                            history('/company-profile');
                        }else{
                            history('/dashboard');
                        }
                    }
                } else {
                    window.showToast(response.message, 'error');

                    submit_btn.removeAttr('disabled');
                    submit_btn.find('.spinner-border').hide();
                }
            }
        } catch (error) {
            window.showToast(error.message, 'error');

            submit_btn.removeAttr('disabled');
            submit_btn.find('.spinner-border').hide();
        }
    };

    const handleResumeImage = async (token, file, userId) => {
        if (file) {

            const Image = {
                image: file
            };
            try{

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(Image)
                };

                fetch(`${process.env.REACT_APP_API_URL}/app/upload-resume-image/${userId}`, requestOptions)
                .then((response) => response.json())
                .then(function(response){})
                .catch((error) => window.showToast(error.message, 'error'));

            } catch(error) {
                window.showToast('Error uploading file:'+error.message, 'error')
            }

        }
    };

    return (
        <>

            <Helmet>
                {refCode && <title>Login / Sign Up | Use Your Referral Code | My First Job</title>}
                {!refCode && <title>Login / Sign Up | My First Job</title>}

                {/* Open Graph (for Facebook, LinkedIn, etc.) */}
                <meta property="og:title" content="Login / Sign Up | Use Your Referral Code | My First Job" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={process.env.REACT_APP_URL+MetaBanner} />
                <meta property="og:description" content="Your Referral Code" />
                <meta property="og:image:width" content="1200"/>
                <meta property="og:image:height" content="630"/>

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content="Login / Sign Up | Use Your Referral Code | My First Job"/>
                <meta name="twitter:description" content="Your Referral Code"/>
                <meta name="twitter:image" content={process.env.REACT_APP_URL+MetaBanner}/>
                <meta name="twitter:image:width" content="1200"/>
                <meta name="twitter:image:height" content="630"/>
            </Helmet>

            <div className="auth-page  login-page">
                <div className="siteLogo"> <Link to="/"> <img className='logo' src={siteLogo} alt='logo' /> </Link> </div>
                <Container className='m-auto'>
                    {!showVerifiedBusiness ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <Wizard>
                                <GetStrated data={formData} onUpdate={setFormData} pId={pId} />

                                {(formData?.signup_type !== "google" && formData?.signup_type !== "linkedin") &&
                                    <VerifiedCode data={formData} onUpdate={setFormData} />
                                }

                                <UserType data={formData} onUpdate={setFormData} pId={pId} />

                                {formData.user_type === 'manager' &&
                                    <EmployerType data={formData} onUpdate={setFormData} />
                                }

                                <UserInfo data={formData} onUpdate={setFormData} handleSubmitForm={() => setShouldSubmit(true)} refCode={refCode} />

                                {formData.user_type === 'manager' &&
                                    <BusinessInfo data={formData} onUpdate={setFormData} />
                                }

                                {formData.user_type === 'manager' &&
                                    <VerifiedBusiness data={formData} onUpdate={setFormData} handleSubmitForm={() => setShouldSubmit(true)} submitBtn={submitBtn} />
                                }
                            </Wizard>
                        </form>
                    ) : <VerifiedAccount loginType={loginType} />}
                </Container>
                <p className='privacy_link'> <span onClick={()=>{handleOpenPrivacyModal()}}> Privacy Policy </span> </p>
            </div>
            {/* privacy modal */}

            <Modal className={`privacy_modal ${theme}`} show={showPrivacyModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h3 className='modal_title'> Privacy policy </h3>
                </Modal.Header>
                <Modal.Body>
                    <div className='privacy_content'  dangerouslySetInnerHTML={{ __html: privacyPolicy}}>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default Login;
