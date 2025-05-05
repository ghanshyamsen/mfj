import React, {useState} from 'react';
import download from '../../../assets/images/download.svg';
import Resume from '../../../assets/images/resume.png';
import DefaultResume from '../../../assets/images/156.png';
import ClassicResume from '../../../assets/images/157.png';
import DarkResume from '../../../assets/images/158.png';
import { useProfile } from '../../../ProfileContext';
import { Modal } from 'react-bootstrap';
import Coin from '../../../assets/images/coin.png'
import BuyCreditModal from '../../../BuyCreditModal';

import Resume4 from '../../../assets/images/resume4.png';
import Resume5 from '../../../assets/images/resume5.png';
import Resume6 from '../../../assets/images/resume6.png';
import Resume7 from '../../../assets/images/resume7.png';
import Resume8 from '../../../assets/images/resume8.png';
import Resume9 from '../../../assets/images/resume9.png';
import Resume10 from '../../../assets/images/resume10.png';

import { Link, useParams } from 'react-router-dom';



function ResumeButtons({isBlackAndWhite, handleToggleMode, handleDownload, loading }) {

    const { key} = useParams();

    const user = JSON.parse(localStorage.getItem('userData'));
    const User = user;
    const {theme} = useProfile();
    const [showResumeModal, setShowResumeModal] = useState(false);
    const configData = JSON.parse(localStorage.getItem('ConfigData'));

    const handleCloseModal = () => {
        setShowResumeModal(false);
      };

    const OpenResumeModal = () => {
        setShowResumeModal(true);
    }

    const templates = {
        'default': {
          id: 1,
          key:'default',
          name: 'Default',
          url: '/resume/default',
          img: DefaultResume,
          price: 0,
          purchased:(User?.purchased_templates?.includes('default'))
        },
        'classic': {
          id: 2,
          key:'classic',
          name: 'Classic',
          url: '/resume/classic',
          img: ClassicResume,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('classic'))
        },
        'dark': {
          id: 3,
          key:'dark',
          name: 'Dark',
          url: '/resume/dark',
          img: DarkResume,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('dark'))
        },
        'modernedge': {
          id: 4,
          key:'modernedge',
          name: 'Edge',
          url: '/resume/modernedge',
          img: Resume4,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('modernedge'))
        },
        'vibrantflow': {
          id: 5,
          key:'vibrantflow',
          name: 'Vibrance',
          url: '/resume/vibrantflow',
          img: Resume5,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('vibrantflow'))
        },
        'boldcontrast': {
          id: 6,
          key:'boldcontrast',
          name: 'Contrast',
          url: '/resume/boldcontrast',
          img: Resume6,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('boldcontrast'))
        },
        'creativegrid': {
          id: 7,
          key:'creativegrid',
          name: 'Gridline',
          url: '/resume/creativegrid',
          img: Resume7,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('creativegrid'))
        },
        'professionalyellow': {
          id: 8,
          key:'professionalyellow',
          name: 'Sunrise',
          url: '/resume/professionalyellow',
          img: Resume8,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('professionalyellow'))
        },
        'elegantcurve': {
          id: 9,
          key:'elegantcurve',
          name: 'Curve',
          url: '/resume/elegantcurve',
          img: Resume9,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('elegantcurve'))
        },
        'friendlyprofile': {
          id: 10,
          key:'friendlyprofile',
          name: 'Persona',
          url: '/resume/friendlyprofile',
          img: Resume10,
          price: configData.resume_credit,
          purchased:(User?.purchased_templates?.includes('friendlyprofile'))
        }
    };

    const [selectedTemplate, setSelectedTemplate] = useState(
        Object.values(templates).find((template) => template.key === key)
    );// Default to the first template


    return(
        <>
            <div className='change_resume_print'>
                <div className='btn_block'>
                        <button
                            className={`btn ${!isBlackAndWhite ? 'active' : ''}`}
                            type='button'
                            onClick={() => handleToggleMode('colored')}
                        >
                            Colored
                        </button>
                        <button
                            className={`btn ${isBlackAndWhite ? 'active' : ''}`}
                            type='button'
                            onClick={() => handleToggleMode('blackAndWhite')}
                        >
                            Black & White
                        </button>
                    </div>
                    <button className='btn download_btn' type='button' onClick={handleDownload}>
                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <img src={download} alt="Download" />
                        )}
                    </button>
                    {user && user.user_type === 'teenager' && <button className='btn download_btn' type='button' onClick={OpenResumeModal}>
                        <img src={Resume} alt="temp" />
                    </button>}
                </div>

                {/* resume modal */}
                <Modal className={`dashboard_modals resume_modal ${theme}`} show={showResumeModal} onHide={handleCloseModal} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Choose Template</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal_content'>
                            <div className="resume_modal_contnet">
                            {Object.values(templates).map((template) => template.purchased && (
                                <div key={template.id} className="template-card">
                                <label>
                                    <input
                                    type="radio"
                                    name="template"
                                    value={template.url}
                                    checked={selectedTemplate.key === template.key}
                                    onChange={() => { setSelectedTemplate(template) }}
                                    />
                                    <img src={template.img} alt={template.name} />
                                    <div className="template_desc">
                                    <span className="template_name">{template.name}</span>

                                    {!template.purchased && template.price > 0 &&
                                        <>
                                        <span className="checkmark"></span>
                                        <span className="template_price">
                                            <img src={Coin} alt="coin" />
                                            {template.price}
                                        </span>
                                        </>
                                    }

                                    </div>
                                </label>
                                </div>
                            ))}
                                </div>
                            {/* Select Button */}
                            <div className="btnrow">
                                <Link className="btn continue_btn" to={selectedTemplate.url}> Select </Link>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>
        </>
    )
}

export default ResumeButtons;