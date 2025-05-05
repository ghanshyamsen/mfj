import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import AddYourPhoto from './AddYourPhoto'; // Renamed component for consistency
import PersonalInformation from './PersonalInformation'; // Renamed component for consistency
import Review from './Review';
import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

import resumeHook from "../../../userStatusHook";

function PersonalDetail() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        personalInformation: {},
        addYourPhoto: {}, // Changed key to camelCase for consistency
    });
    const resumeData = resumeHook().data;

    const updateFormData = (stepData, stepKey) => {
        setFormData(prev => ({ ...prev, [stepKey]: stepData }));
    };

    const handleSubmit = (event) => {
        sessionStorage.setItem('showCompleteModal', 'true');
        sessionStorage.setItem('step_title', 'Personal Details');
        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {

        if(!resumeData.personal_detail_complete_status){

        }else{
            navigate(EditUrl||'/dashboard');
        }
    };

    return (
        <div className="personalInfo-page resume_infomation_moduals">
            <Container>
                <div className='dcb_block'>
                    <div className='heading_row'>
                        {currentStep === 3 ? (
                            <h1 className='rim_heading'>Review</h1>
                        ) : (
                            <span className='mcount'>{currentStep}/2</span>
                        )}
                        {/* <button type="button" className="btn-close" onClick={goDashboardPage}></button> */}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Wizard>
                            <PersonalInformation
                                data={formData.personalInformation}
                                onUpdate={(data) => updateFormData(data, 'personalInformation')}
                                GoNextStep={() => setCurrentStep(2)}
                                goDashboardPage={goDashboardPage}
                            />
                            <AddYourPhoto
                                data={formData.addYourPhoto}
                                onUpdate={(data) => updateFormData(data, 'addYourPhoto')}
                                GoBackStep={() => setCurrentStep(1)}
                                GoNextStep={() => setCurrentStep(3)}
                            />
                            <Review
                                GoBackStep={() => setCurrentStep(2)}
                                prevStepData={formData}
                                onUpdate={(data) => updateFormData(data, 'reviewData')}
                                handleSubmit={handleSubmit}
                            />
                        </Wizard>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default PersonalDetail;
