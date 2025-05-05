import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

import CompanyLogo from './CompanyLogo';
import CompanyPurpose from './CompanyPurpose';
import CompanyCulture from './CompanyCulture';
import CompanyValues from './CompanyValues';
import CompanyLife from './CompanyLife';
import Review from './Review';


function CompanyProfile() {

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem('userData'));

    const [formData, setFormData] = useState({
        company_logo:(userData.company_logo||''),
        company_purpose:(userData.company_purpose||''),
        company_culture:(userData.company_culture||''),
        company_values:(userData.company_values||''),
        company_life:(userData.company_life||''),
        image_company_upload:(userData.image_company_upload||'')
    });

    const handleSubmit = (event) => {
        sessionStorage.setItem('showCompleteModal', 'true');
        sessionStorage.setItem('step_title', 'Company Profile');
        sessionStorage.setItem('company_completed', (userData.company_completed?'completed':'notcompleted'));

        navigate('/dashboard');
    };

    const goDashboardPage = () => {
        navigate('/dashboard');
    };

    useEffect(()=>{
        if(!loading && userData){

            setFormData({
                company_logo:(userData.company_logo||''),
                company_purpose:(userData.company_purpose||''),
                company_culture:(userData.company_culture||''),
                company_values:(userData.company_values||''),
                company_life:(userData.company_life||''),
                image_company_upload:(userData.image_company_upload||'')
            });

            setLoading(true);
        }
    },[userData])

    return (
        <div className="resume_infomation_moduals">
            <Container>
                <div className='dcb_block'>
                    <div className='heading_row'>
                        {currentStep === 6 ? (
                            <h1 className='rim_heading'>Review</h1>
                        ) : (
                            <span className='mcount'>{currentStep}/5</span>
                        )}
                        {/* <button type="button" className="btn-close" onClick={goDashboardPage}></button> */}
                    </div>
                    {loading && <form onSubmit={handleSubmit}>
                        <Wizard>
                            <CompanyLogo
                                GoNextStep={() => setCurrentStep(2)}
                                goDashboardPage={goDashboardPage}
                                formData={formData}
                                setFormData={setFormData}

                            />
                            <CompanyPurpose
                                GoBackStep={() => setCurrentStep(1)}
                                GoNextStep={() => setCurrentStep(3)}
                                formData={formData}
                                setFormData={setFormData}
                            />
                            <CompanyCulture
                                GoBackStep={() => setCurrentStep(2)}
                                GoNextStep={() => setCurrentStep(4)}
                                formData={formData}
                                setFormData={setFormData}
                            />
                            <CompanyValues
                                GoBackStep={() => setCurrentStep(3)}
                                GoNextStep={() => setCurrentStep(5)}
                                formData={formData}
                                setFormData={setFormData}
                            />
                            <CompanyLife
                                GoBackStep={() => setCurrentStep(4)}
                                GoNextStep={() => setCurrentStep(6)}
                                formData={formData}
                                setFormData={setFormData}
                            />
                            <Review
                                GoBackStep={() => setCurrentStep(5)}
                                setStep={(key) => setCurrentStep(key)}
                                handleSubmit={handleSubmit}
                                formData={formData}
                            />
                        </Wizard>
                    </form>}
                </div>
            </Container>
        </div>
    );
}

export default CompanyProfile;
