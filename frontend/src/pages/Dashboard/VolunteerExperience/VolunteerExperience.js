import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import GeneralInfo from './GeneralInfo';
import Supervisor from './Supervisor';
import VolunteerWork from './VolunteerWork';
import Accomplishments from './Accomplishments';
import RewardingAspect from './RewardingAspect';
import Review from './Review';

import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';
import Handshake from '../../../assets/images/Handshake.svg';

import Dropdown from 'react-bootstrap/Dropdown';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';

import { Modal } from 'react-bootstrap';
import { useProfile } from '../../../ProfileContext';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import SweetAlert from 'react-bootstrap-sweetalert';

import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'

function VolunteerExperience() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();

    const [currentStep, setCurrentStep] = useState(1);
    const [vexperience, setVExperience] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ismove, setIsMove] = useState(false);
    const [showListing, setSetListing] = useState(true);
    const [vexperienceList, setVExperienceList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState('');
    const [editvexperience, setEditVExperience] = useState({});

    const [showAlert, setShowAlert] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('token');


    const handleSubmit = () => {
        if(vexperience){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Volunteer Experience');
        }

        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {

        if(vexperienceList.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Volunteer Experience');
        }

        navigate(EditUrl||'/dashboard');
    };

    // Function to update or add an object at a specific index
    const updateOrAddObjectAtIndex = (index, newObject) => {
        setVExperience((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;
            return newArray;
        });
    };

    const updateOrdering = (index, newObject) => {
        setVExperienceList((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;

            return newArray;
        });
    };

    useEffect(()=>{
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if(result.status === "S"){
                if(result.data.volunteer_complete_status){
                    setVExperienceList(result.data.volunteer_experience);
                }else{
                    setSetListing(false);
                }

                setLoading(true);
            }else{
                window.showToast("Please complete your personal details first.","error");
                navigate(EditUrl||'/dashboard');
            }
          })
          .catch((error) => console.error(error));
    },[])

    useEffect(() => {
        if(ismove){
            updateResume()
        }
    },[vexperienceList]);

    const updateResume = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            volunteer_experience:vexperienceList
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status=='S'){
                if(!ismove){
                    //goDashboardPage();
                }
            }
        })
        .catch((error) => console.error(error));
    }

    const moveHigher = (key) =>{

        let currentKey = key;
        let upperKey = (key-1);
        let currentArray = vexperienceList[key];
        let upperArray = vexperienceList[(key-1)];

        updateOrdering(upperKey,currentArray);
        updateOrdering(currentKey,upperArray);
        setIsMove(true);
    }

    const extractInfoByQuestionTag = (data) => {
        return data.map(section => {
            return section.map(item => {
                const infoObject = {};
                item.info.forEach(infoItem => {
                    infoObject[infoItem.question_tag] = infoItem.answer;
                });
                return infoObject;
            });
        });
    };

    const combinedArray = extractInfoByQuestionTag(vexperienceList).map(group => {
        return group.reduce((acc, obj) => {
          return { ...acc, ...obj };
        }, {});
    });

    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const errors = {};

        // You can add more validation logic here
        if(!data.organizationname.trim()){
            errors.organizationname = "Organization name is required.";
        }

        if(!data.startdate){
            errors.startdate = "Start date is required.";
        }

        // if(!data.enddate){
        //     errors.enddate = "End date is required.";
        // }

        if(data.startdate && data.enddate && ((new Date(window.parseDateString(data.startdate)) > new Date(window.parseDateString(data.enddate))) || !window.isStartBeforeEnd(window.parseDateString(data.startdate), window.parseDateString(data.enddate)))){
            errors.enddate = "End date must be greater than start date.";
        }

        if(data.enddate && !data.totalhours.trim()){
            errors.totalhours = "Total hours is required.";
        }else{
            if(data.enddate && (data.totalhours > 1000 || data.totalhours < 1)){
                errors.totalhours = "Total hours must be between min 1 to max 1000.";
            }
        }

        if(!data.firstname.trim()){
            errors.firstname = "First name is required.";
        }

        if(!data.lastname.trim()){
            errors.lastname = "Last name is required.";
        }

        if(!data.phonenumber.trim()){
            errors.phonenumber = "Phone number is required.";
        }else{
            // Parse the phone number using libphonenumber-js
            const parsedPhoneNumber = parsePhoneNumberFromString(data.phonenumber, 'US');

            // Check if the parsed phone number is valid
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                errors.phonenumber = 'Please enter a valid phone number';
            }
        }

        if(!data.email.trim()){
            errors.email = "Email address is required.";
        }

        if(!data.rewardingaspect.trim()){
            errors.rewardingaspect = "Rewarding Aspect is required.";
        }

        if(!data.responsibilities.trim()){
            errors.responsibilities = "Responsibilities is required.";
        }

        if(!data.accomplishments.trim()){
            errors.accomplishments = "Accomplishments is required.";
        }

        return errors;
    }

    const handleChange = (e) => {
        if(e.target.name === 'startdate' || e.target.name === 'enddate'){
            e.target.value = e.target.value?window.formatmdyDate(e.target.value):'';
        }

        if(e.target.name ==='totalhours'){
            e.target.value = e.target.value?window.formatToTwoDecimalPlaces(e.target.value):'';
        }
        setEditVExperience({...editvexperience, [e.target.name]: e.target.value});
    };

    const editVolunteerForm = (index, volunteer) => {
        setEditIndex(index);
        setEditVExperience(volunteer);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const saveVolunteer = () => {
        const validate = validateForm(editvexperience);
        if(Object.keys(validate).length > 0){
            setErrors(validate);
            return;
        }

        const updateValue = updateArray(vexperienceList, editvexperience, editIndex);

        setVExperienceList(updateValue);
        setIsMove(true);
        handleCloseModal();
    }

    const updateArray = (array, obj, arrayIndex) => {
        return array.map((subArray, index) => {
            if (index === arrayIndex) {
                return subArray.map(section => {
                    return {
                        ...section,
                        info: section.info.map(item => {
                            if (obj.hasOwnProperty(item.question_tag)) {
                                return {
                                    ...item,
                                    answer: obj[item.question_tag],
                                    [item.question_tag]: obj[item.question_tag]
                                };
                            }
                            return item;
                        })
                    };
                });
            }
            return subArray;
        });
    };

    const deleteVolunteer = () => {
        setVExperienceList(prevList => {
            return prevList.filter((_, index) => index !== editIndex);
        });

        setIsMove(true);
        handleCloseModal();
        setShowAlert(false);
    }

    return (
        <>
            <div className="objectives-and-summary-page resume_infomation_moduals">
                <Container>

                    {loading && showListing && <div className='dcb_block'>
                        <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>

                        <div className='heading_row'>
                            <h1 className='rim_heading'> Volunteer Experience</h1>
                        </div>
                        <div className='add_more_content_block'>
                            <button className='add_education' onClick={()=> setSetListing(false)}> <img src={Plus} alt="" /> <span> Add Volunteer Experience </span> </button>
                            {
                                combinedArray.map((value, index) => (
                                    <div className='education_info' key={index}>
                                        <div className='info_title' >
                                            <h2> {value.organizationname}</h2>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                                    <img src={Dots} alt="" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {index > 0 && <Dropdown.Item onClick={() => { moveHigher(index) }}>Move higher</Dropdown.Item>}
                                                    <Dropdown.Item onClick={()=>{editVolunteerForm(index, value)}}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={()=>{
                                                        setEditIndex(index)
                                                        setShowAlert(true)
                                                    }}>Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <p className='it-text'>{value.responsibilities}</p>
                                        <p className='id-text'>{window.formatDate(value.startdate)} {value.enddate?'-'+window.formatDate(value.enddate):''} {value.totalhours?'• '+value.totalhours+' Hours':''}</p>
                                        <p className='it-text'>{value.accomplishments}</p>
                                        <p className='it-text'>{value.rewardingaspect}</p>
                                        <p className='it-text'>Supervisor: {value.firstname} {value.lastname}</p>
                                        <p className='id-text'>{value.phonenumber} / {value.email}</p>
                                    </div>
                                ))
                            }
                        </div>

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn mb-2' onClick={goDashboardPage}>Save and exit</button>
                        </div>
                    </div>}

                    {loading && !showListing &&  <div className='dcb_block'>
                        <div className='heading_row'>
                            {currentStep === 6 ? (
                                <h1 className='rim_heading'>Review</h1>
                            ) : (
                                <span className='mcount'>{currentStep}/5</span>
                            )}
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>
                        {/* <form onSubmit={handleSubmit}> */}
                            {loading && <Wizard startIndex={index}>
                                <GeneralInfo
                                    GoNextStep={() => setCurrentStep(2)}
                                    goDashboardPage={goDashboardPage}
                                    vexperience={vexperience[0]}
                                    setVExperience={updateOrAddObjectAtIndex}
                                />
                                <Supervisor
                                    GoBackStep={() => setCurrentStep(1)}
                                    GoNextStep={() => setCurrentStep(3)}
                                    vexperience={vexperience[1]}
                                    setVExperience={updateOrAddObjectAtIndex}
                                />
                                <VolunteerWork
                                    GoBackStep={() => setCurrentStep(2)}
                                    GoNextStep={() => setCurrentStep(4)}
                                    vexperience={vexperience[2]}
                                    setVExperience={updateOrAddObjectAtIndex}
                                />
                                <Accomplishments
                                    GoBackStep={() => setCurrentStep(3)}
                                    GoNextStep={() => setCurrentStep(5)}
                                    vexperience={vexperience[3]}
                                    setVExperience={updateOrAddObjectAtIndex}
                                />
                                <RewardingAspect
                                    GoBackStep={() => setCurrentStep(4)}
                                    GoNextStep={() => setCurrentStep(6)}
                                    vexperience={vexperience[4]}
                                    setVExperience={updateOrAddObjectAtIndex}
                                />
                                <Review
                                    GoBackStep={() => setCurrentStep(5)}
                                    setStep={(key) => setCurrentStep(key)}
                                    vexperience={vexperience}
                                    handleSubmit={handleSubmit}
                                />
                            </Wizard>}
                        {/* </form> */}
                    </div>}
                </Container>
            </div>

            {/*  */}

            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={deleteVolunteer}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                The record will get deleted.
            </SweetAlert>

            <Modal className={`edit_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'>Edit volunteer experience</h1>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <form>
                            <div className='field_form'>
                                <h3 className='field_title'> General info </h3>
                                <FloatingLabel controlId="floatingorganization" label={<span> Name of the organization <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="organizationname"
                                        value={editvexperience.organizationname}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    {errors.organizationname && <div className="error-message text-danger">{errors.organizationname}</div>}
                                </FloatingLabel>
                                <FloatLabel className="mb-3">
                                    <Calendar
                                        name="startdate"
                                        value={editvexperience.startdate?new Date(window.parseDateString(editvexperience.startdate)):''}
                                        onChange={handleChange}
                                        dateFormat="mm/yy"
                                        placeholder=''
                                        maxDate={new Date()}
                                        view="month"
                                    />
                                    <label htmlFor="startdate">Start Date <span className='required'>*</span></label>
                                </FloatLabel>
                                {errors.startdate && <div className="error-message text-danger">{errors.startdate}</div>}

                                <FloatLabel className="mb-3">
                                    <Calendar
                                        name="enddate"
                                        value={editvexperience.enddate?new Date(window.parseDateString(editvexperience.enddate)):''}
                                        onChange={handleChange}
                                        dateFormat="mm/yy"
                                        placeholder=''
                                        view="month"
                                    />
                                    <label htmlFor="enddate">End Date <span className='required'>*</span></label>
                                    <p className="phone_Text"> Skip if you’re currently working in this role </p>
                                </FloatLabel>
                                {errors.enddate && <div className="error-message text-danger">{errors.enddate}</div>}


                                <FloatingLabel controlId="floatingtotalhours" label={<span>
                                    Total hours {editvexperience.enddate && <span className='required'>*</span>}
                                    </span>} className="mb-3">
                                    <Form.Control
                                        type="number"
                                        name="totalhours"
                                        value={editvexperience.totalhours}
                                        onChange={handleChange}
                                        placeholder=""
                                        min="1"
                                        max="1000"
                                    />
                                    {errors.totalhours && <div className="error-message text-danger">{errors.totalhours}</div>}
                                </FloatingLabel>
                            </div>

                            <div className='field_form'>
                                <h3 className='field_title'> Supervisor </h3>
                                <FloatingLabel controlId="floatingfname" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="firstname"
                                        value={editvexperience.firstname}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    {errors.firstname && <div className="error-message text-danger">{errors.firstname}</div>}
                                </FloatingLabel>
                                <FloatingLabel controlId="floatinglname" label={<span> Last Name <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="lastname"
                                        value={editvexperience.lastname}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    {errors.lastname && <div className="error-message text-danger">{errors.lastname}</div>}
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingphonenumber" label={<span> Phone Number <span className='required'>*</span> </span>} className="mb-3">
                                    <PhoneInput
                                        placeholder=""
                                        defaultCountry="US"
                                        country="US"
                                        international
                                        withCountryCallingCode
                                        className="form-control"
                                        value={editvexperience.phonenumber||""}
                                        onChange={value => handleChange({ target: { name: 'phonenumber', value } })}
                                    />
                                    {errors.phonenumber && <div className="error-message text-danger">{errors.phonenumber}</div>}
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingemail" label={<span> Email address <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editvexperience.email}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                                </FloatingLabel>
                            </div>

                            <div className='field_form'>
                                <h3 className='field_title'> Questions </h3>
                                <FloatingLabel controlId="floatingdesc"
                                    label={<span> What were your main responsibilities during your volunteer work? <span className='required'>*</span> </span>} className="mb-3"
                                >
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="responsibilities"
                                        value={editvexperience.responsibilities}
                                        onChange={handleChange}
                                        placeholder=""
                                        maxLength="300"
                                    />
                                    <p className="phone_Text"> {editvexperience.responsibilities?.length||0}/300 </p>
                                    {errors.responsibilities && <div className="error-message text-danger">{errors.responsibilities}</div>}
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingdesc" label={<span> Describe your accomplishments <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="accomplishments"
                                        value={editvexperience.accomplishments}
                                        onChange={handleChange}
                                        placeholder=""
                                        maxLength="300"
                                    />
                                    <p className="phone_Text"> {editvexperience.accomplishments?.length||0}/300 </p>
                                     {errors.accomplishments && <div className="error-message text-danger">{errors.accomplishments}</div>}
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingdesc" label={<span> Describe the most rewarding aspect <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="rewardingaspect"
                                        value={editvexperience.rewardingaspect}
                                        onChange={handleChange}
                                        placeholder=""
                                        maxLength="300"
                                    />
                                    <p className="phone_Text"> {editvexperience.rewardingaspect?.length||0}/300 </p>
                                    {errors.rewardingaspect && <div className="error-message text-danger">{errors.rewardingaspect}</div>}
                                </FloatingLabel>
                            </div>

                            <div className='btn_block mt-5'>
                                <button type="button" className='btn submit_btn back-button' onClick={()=>{setShowAlert(true)}}> Delete </button>
                                <button type="button" className='btn submit_btn' onClick={saveVolunteer}> Save </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    {/* <Modal.Title>Volunteer Experience</Modal.Title> */}
                    <div className='icons'>
                            <img src={Handshake} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                <div className='modal_content'>
                    <div className="make_resume_content_block">
                        <div className="make_resume_content">
                            <h2 className="mrc_heading"> Welcome to the Volunteer Experience Section </h2>
                            <p className="src_desc"> Including volunteer work on your resume demonstrates your commitment to helping others and giving back to your community. It’s a powerful way to show employers the skills and values you’ve gained outside of a traditional job setting. </p>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> How It Works </h2>
                            <ul className="">
                                <li> List any volunteer work you’ve participated in, whether it’s a one-time event or an ongoing commitment. </li>
                                <li> Volunteering shows your character, work ethic, and passion for making a difference. </li>
                                <li> Even small acts of service, like helping at a school event or community project, can showcase your initiative and dedication. </li>
                            </ul>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> Why It Matters </h2>
                            <p className="src_desc"> Volunteer experience highlights your willingness to go above and beyond, proving that you care about more than just a paycheck. It’s a great way to demonstrate important qualities like teamwork, leadership, and empathy—traits that employers highly value. </p>
                        </div>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default VolunteerExperience;
