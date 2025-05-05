import React, { useState, useEffect } from 'react';
import { Container, Dropdown, Form, FloatingLabel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../ProfileContext';
import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';

import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import SweetAlert from 'react-bootstrap-sweetalert';
import IncomingEnvelope from '../../../assets/images/IncomingEnvelope.svg';


function References() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('token');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [reference, setReference] = useState([]);
    const [errors, setErrors] = useState({});
    const [editIndex, setEditIndex] = useState('');
    const [ismove, setIsMove] = useState(false);
    const [countryCode, setCountryCode] = useState('US'); // Define default country code, e.g., 'US'
    const [showAlert, setShowAlert] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        first_name:'',
        last_name:'',
        relation:'',
        organization:'',
        phone_number:'',
        email:''
    });

    useEffect(() => {
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
            if(result.status === 'S'){
                if(result.data.references_status){
                    setReference(result.data.references);
                }
            }
        })
        .catch((error) => console.error(error));
    },[])

    useEffect(() => {
        if(ismove){
            updateResume()
        }
    },[reference]);

    const updateOrdering = (index, newObject) => {
        setReference((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;

            return newArray;
        });
    };

    const moveHigher = (key) =>{

        let currentKey = key;
        let upperKey = (key-1);
        let currentArray = reference[key];
        let upperArray = reference[(key-1)];

        updateOrdering(upperKey,currentArray);
        updateOrdering(currentKey,upperArray);
        setIsMove(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCloseModal = () => {
        setErrors({});
        setShowModal(false);
        setIsEdit(false);
        setFormData({
            first_name:'',
            last_name:'',
            relation:'',
            organization:'',
            phone_number:'',
            email:''
        })
    };

    const createWorkModal = () => {
        if(reference.length >= 3){
            window.showToast("You have reached the maximum limit of references.","info");
        }else{
            setShowModal(true);
            setIsEdit(false);
        }
    };

    const editModal = (index, value) => {
        setEditIndex(index);
        setFormData(value);
        setShowModal(true);
        setIsEdit(true);
    }

    const goDashboardPage = () => {
        if(reference.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'References');
        }
        navigate(EditUrl||'/dashboard');
    };

    const validation = (data) => {
        const errors = {};

        if(!data.first_name.trim()){
            errors.first_name = "First name is required.";
        }

        if(!data.last_name.trim()){
            errors.last_name = "Last name is required.";
        }

        if(!data?.relation?.trim()){
            errors.relation = "Relationship is required.";
        }



        /* if(!data.organization.trim()){
            errors.organization = "Organization is required.";
        } */

        /* if(!data.phone_number.trim()){
            errors.phone_number = "Phone number is required.";
        } */

            if (!data.phone_number) {
                errors.phone_number = 'Please enter a phone number';
           } else {
               // Parse the phone number using libphonenumber-js
               const parsedPhoneNumber = parsePhoneNumberFromString(data.phone_number, countryCode);

               // Check if the parsed phone number is valid
               if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                   errors.phone_number = 'Please enter a valid phone number';
               }
           }

        if(!data.email.trim()){
            errors.email = "Email is required.";
        }else{
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(data.email)){
                errors.email = "Please enter a valid email address.";
            }
        }

        return errors;
    }

    const handleSubmit = (event) => {
        // Add form submission logic here
        const validated = validation(formData);
        if(Object.keys(validated).length > 0){
            setErrors(validated);
            return
        }

        setErrors({});

        // Clear the array each time the function is called
        let referencesArray = [];
        referencesArray = [...reference];
        if(isEdit){
            referencesArray[editIndex] = formData;
        }else{
            referencesArray.push(formData);
        }



        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            references_status:true,
            references: referencesArray
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
            if(result.status === "S"){
                setReference(result.data.references);
                handleCloseModal();
            }
        })
        .catch((error) => console.error(error.message));

    };

    const updateResume = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            references:reference
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
                    // if(reference.length > 0){
                    //     sessionStorage.setItem('showCompleteModal', 'true');
                    //     sessionStorage.setItem('step_title', 'References');
                    // }
                    // navigate('/dashboard');
                }
            }
        })
        .catch((error) => console.error(error.message));

    }

    const handleDelete = (Index=false) => {
        setReference(prevList => {
            const newList = [...prevList];
            newList.splice((Index||editIndex), 1);
            return newList;
        });

        setIsMove(true);
        setShowModal(false);
        setShowAlert(false);
    }


    return (
        <>
            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={handleDelete}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                The record will get deleted.
            </SweetAlert>

            <div className="resume_infomation_moduals">
                <Container>
                    <div className='dcb_block'>
                        <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>
                        <div className='heading_row'>
                            <h1 className='rim_heading'>References</h1>
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>

                        <div className='add_more_content_block'>
                            <button className='add_education' type='button' onClick={createWorkModal}>
                                <img src={Plus} alt="" />
                                <span>Add reference (up to 3)</span>
                            </button>

                            {
                                reference.map((value, index) => (
                                    <div className='education_info' key={index}>
                                        <div className='info_title'>
                                            <h2>{value.first_name} {value.last_name}</h2>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                                    <img src={Dots} alt="" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {index > 0 && <Dropdown.Item onClick={()=>{moveHigher(index)}}>Move higher</Dropdown.Item>}
                                                    <Dropdown.Item onClick={()=>{editModal(index,value)}}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={()=>{
                                                        setEditIndex(index)
                                                        setShowAlert(true)
                                                    }}>Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <p className='it-text'>{value.relation}</p>
                                        <p className='it-text'>{value.organization}</p>
                                        <p className='id-text'>{value.phone_number}</p>
                                        <p className='id-text'><a href={'mailto:'+value.email} target='_blank'>{value.email}</a></p>
                                    </div>
                                ))
                            }

                        </div>

                        <div className='btn_block'>
                            <button type="submit" className='btn submit_btn mb-2' onClick={goDashboardPage}>Save and Exit</button>
                        </div>
                    </div>
                </Container>
            </div>

            <Modal className={`work_experience_modal ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit?'Edit':'Add'} reference</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='experience_form modal_forms'>
                        <form>
                            <FloatingLabel controlId="floatingFirstName" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    placeholder=""
                                    value={formData.first_name||''}
                                    onChange={handleChange}
                                />
                                {errors.first_name && <small style={{color:"red"}}>{errors.first_name}</small>}
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingLastName" label={<span> Last Name <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    placeholder=""
                                    value={formData.last_name||''}
                                    onChange={handleChange}
                                />
                                {errors.last_name && <small style={{color:"red"}}>{errors.last_name}</small>}
                            </FloatingLabel>


                            <FloatingLabel controlId="floatingLastName" label={<span>Relationship <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="relation"
                                    placeholder=""
                                    value={formData.relation||''}
                                    onChange={handleChange}
                                />
                                {errors.relation && <small style={{color:"red"}}>{errors.relation}</small>}
                                <p className="phone_Text">e.g., teacher, coach, supervisor</p>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingOrganization" label="Organization" className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="organization"
                                    placeholder=""
                                    value={formData.organization||''}
                                    onChange={handleChange}
                                />
                                <p className='phone_Text'>Optional</p>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPhoneNumber" label={<span>Phone number <span className='required'>*</span> </span>} className="mb-3">
                                <PhoneInput
                                    placeholder=""
                                    defaultCountry="US"
                                    country="US"
                                    international
                                    withCountryCallingCode
                                    className="form-control"
                                    value={formData.phone_number||''}
                                    onChange={value => handleChange({ target: { name: 'phone_number', value } })}
                                />
                                {errors.phone_number && <small style={{color:"red"}}>{errors.phone_number}</small>}
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingEmail" label={<span>Email address <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder=""
                                    value={formData.email||''}
                                    onChange={handleChange}
                                />
                                {errors.email && <small style={{color:"red"}}>{errors.email}</small>}
                            </FloatingLabel>
                            <div className='btn_block'>
                                {isEdit && <button type='button' className='btn submit_btn back-button mb-0' onClick={()=>{setShowAlert(true)}} >Delete</button>}
                                <button type='button' className='btn submit_btn mb-0' onClick={handleSubmit}>Save</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    {/* <Modal.Title>References</Modal.Title> */}
                    <div className='icons'>
                            <img src={IncomingEnvelope} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <div className="make_resume_content_block">
                            <div className="make_resume_content">
                                <h2 className="mrc_heading"> Welcome to the References Section </h2>
                                <p className="src_desc"> References are individuals who can vouch for your character, skills, and experience. They provide potential employers with an external perspective on your abilities and can confirm the information on your resume. </p>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> How It Works </h2>
                                <ul className="">
                                    <li> List individuals who can speak to your skills, work ethic, or character, such as teachers, coaches, or past supervisors. </li>
                                    <li> Make sure to ask their permission before listing them as a reference. </li>
                                    <li> Including strong references shows that you have a network of support and people who believe in your qualifications. Your goal should be to build this network over time.  </li>
                                </ul>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> Why It Matters </h2>
                                <p className="src_desc"> References help employers validate your skills and experience. Having a reliable reference shows employers that others trust you, support you, and can attest to the great work you do. It also provides additional credibility to everything you've included in your resume. </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default References;
