import React, { useState, useEffect } from 'react';
import { Container, Dropdown, Form, FloatingLabel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';
import { useProfile } from '../../../ProfileContext';
import { Calendar } from 'primereact/calendar';
import SweetAlert from 'react-bootstrap-sweetalert';
import OfficeBuilding from '../../../assets/images/OfficeBuilding.svg';
import { FloatLabel } from 'primereact/floatlabel';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'

function WorkExperience() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const { theme } = useProfile();
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('token');
    const [isEdit, setIsEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [editIndex, setEditIndex] = useState('');
    const [ismove, setIsMove] = useState(false);
    const [workExperience, setWorkExperience] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        description: "",
        first_name: '',
        last_name: '',
        phone_number: '',
        email: ''
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
                if(result.data.work_experience_status){
                    setWorkExperience(result.data.work_experience);
                }
            }
        })
        .catch((error) => console.error(error));
    },[])

    useEffect(() => {
        if(ismove){
            updateResume()
        }
    },[workExperience]);

    const updateOrdering = (index, newObject) => {
        setWorkExperience((prevArray) => {
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
        let currentArray = workExperience[key];
        let upperArray = workExperience[(key-1)];

        updateOrdering(upperKey,currentArray);
        updateOrdering(currentKey,upperArray);
        //setIsMove(true);
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'start_date' || name === 'end_date'){
            setFormData(prevState => ({
                ...prevState,
                [name]: (value?window.formatmdyDate(value):'')
            }));
        }else{
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setFormData({
            title: "",
            company_name: "",
            start_date: "",
            end_date: "",
            description: "",
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
        })
    };

    const createWorkModal = () => {
        setErrors({});
        setShowModal(true);
        setIsEdit(false);
    };

    const editModal = (index, value) => {
        setErrors({});
        setEditIndex(index);
        setFormData(value);
        setShowModal(true);
        setIsEdit(true);
    }

    const goDashboardPage = () => {
        if(workExperience.length > 0 ){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Work Experience');
        }
        navigate(EditUrl||'/dashboard');
    };

    const validation = (data) => {
        const errors = {};

        if(!data.title.trim()){
            errors.title = "Title is required.";
        }

        if(!data.company_name.trim()){
            errors.company_name = "Company name is required.";
        }

        if(!data.start_date){
            errors.start_date = "Start date is required.";
        }

        if(data.start_date && data.end_date && (new Date(window.parseDateString(data.start_date)) > new Date(window.parseDateString(data.end_date)))){
            errors.end_date = "End date must be greater than start date.";
        }

        if(!data.first_name.trim()){
            errors.first_name = "First name is required.";
        }

        if(!data.last_name.trim()){
            errors.last_name = "Last name is required.";
        }

        if(!data.phone_number.trim()){
            errors.phone_number = "Phone number is required.";
        }else{
            // Parse the phone number using libphonenumber-js
            const parsedPhoneNumber = parsePhoneNumberFromString(data.phone_number, 'US');
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

    const updateResume = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            work_experience:workExperience
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
                // if(workExperience.length > 0 ){
                //     sessionStorage.setItem('showCompleteModal', 'true');
                //     sessionStorage.setItem('step_title', 'Work Experience');
                // }
                // navigate('/dashboard');
            }
        })
        .catch((error) => console.error(error.message));

    }

    const handleSubmit = (event) => {
        // Add form submission logic here
        const validated = validation(formData);
        if(Object.keys(validated).length > 0){
            setErrors(validated);
            return
        }

        // Clear the array each time the function is called
        let workexperienceArray = [];
        workexperienceArray = [...workExperience];
        if(isEdit){
            workexperienceArray[editIndex] = formData;
        }else{
            workexperienceArray.push(formData);
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            work_experience_status:true,
            work_experience: workexperienceArray
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
                setWorkExperience(result.data.work_experience);
                handleCloseModal();
            }
        })
        .catch((error) => console.error(error.message));

    };

    const handleDelete = (Index=false) => {
        setWorkExperience(prevList => {
            const newList = [...prevList];
            newList.splice((Index||editIndex), 1);
            return newList;
        });

        setIsMove(true);
        setShowModal(false);
        setShowAlert(false);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                            <h1 className='rim_heading'> Work Experience </h1>
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>
                        <div className='add_more_content_block'>
                            <button className='add_education' type='button' onClick={createWorkModal}>
                                <img src={Plus} alt="Add" /> <span> Add Work Experience </span>
                            </button>
                            {
                                workExperience.map((value, index) => (
                                    <div className='education_info' key={index}>
                                        <div className='info_title'>
                                            <h2>{value.title}</h2>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                                    <img src={Dots} alt="Menu" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {index > 0 && <Dropdown.Item onClick={()=>{moveHigher(index)}}> Move higher </Dropdown.Item>}
                                                    <Dropdown.Item onClick={()=>{editModal(index,value)}}> Edit </Dropdown.Item>
                                                    <Dropdown.Item onClick={()=>{
                                                        setEditIndex(index)
                                                        setShowAlert(true)
                                                    }}> Delete </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <p className='it-text'> {value.company_name} </p>
                                        <p className='id-text'> {window.formatDate(value.start_date)} - {value.end_date?window.formatDate(value.end_date):"Present"} </p>
                                        <p className='it-text'> {value.description} </p>
                                        <p className='it-text'> Supervisor: {value.first_name} {value.last_name} </p>
                                        <p className='id-text'> {value.phone_number} / {value.email} </p>
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
                    <Modal.Title>{isEdit?'Edit':'Add'} Work Experience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='experience_form modal_forms'>
                        <form onSubmit={handleSubmit}>
                            <div className='ef_fields'>
                                <h5 className='ef_title'> General </h5>
                                <FloatingLabel controlId="floatingTitle" label={<span> Title <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder=""
                                        value={formData.title||''}
                                        onChange={handleChange}
                                    />
                                    {errors.title && <small style={{color:"red"}}>{errors.title}</small>}
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingCompanyName" label={<span> Company Name <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="company_name"
                                        placeholder=""
                                        value={formData.company_name||''}
                                        onChange={handleChange}
                                    />
                                    {errors.company_name && <small style={{color:"red"}}>{errors.company_name}</small>}
                                </FloatingLabel>
                                <FloatLabel className="mb-3">
                                    <Calendar
                                        name="start_date"
                                        value={formData.start_date?new Date(window.parseDateString(formData.start_date)):''}
                                        onChange={handleChange}
                                        placeholder=''
                                        maxDate={new Date()}
                                        dateFormat="mm/yy"
                                        view="month"

                                    />
                                    <label htmlFor="date_of_birth">Start Date <span className='required'>*</span></label> {/*  */}
                                    {errors.start_date && <small style={{color:"red"}}>{errors.start_date}</small>}
                                </FloatLabel>


                                <FloatLabel className="mb-3">
                                    <Calendar
                                        name="end_date"
                                        value={formData.end_date?new Date(window.parseDateString(formData.end_date)):''}
                                        onChange={handleChange}
                                        placeholder=''
                                        dateFormat="mm/yy"
                                        view="month"
                                    />
                                    <label htmlFor="date_of_birth">End Date </label>{/* <span className='required'>*</span> */}
                                    <p className="phone_Text"> Skip if you’re currently working in this role </p>
                                    {errors.end_date && <small style={{color:"red"}}>{errors.end_date}</small>}
                                </FloatLabel>


                                <FloatingLabel controlId="floatingDescription" label="Description (optional)" className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        placeholder=""
                                        value={formData.description||''}
                                        onChange={handleChange}
                                        maxLength="300"
                                    />
                                    <p className="phone_Text"> {formData.description.length}/300 </p>
                                </FloatingLabel>
                            </div>
                            <div className='ef_fields'>
                                <h5 className='ef_title'> Supervisor </h5>
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
                                <FloatingLabel controlId="floatingPhoneNumber" label={<span> Phone Number <span className='required'>*</span> </span>} className="mb-3">
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
                                <FloatingLabel controlId="floatingEmail" label={<span> Email Address <span className='required'>*</span> </span>} className="mb-3">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder=""
                                        value={formData.email||''}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <small style={{color:"red"}}>{errors.email}</small>}
                                </FloatingLabel>
                            </div>
                            <div className='btn_block'>
                                {isEdit && <button type="button" className='btn submit_btn back-button' onClick={()=>{setShowAlert(true)}}> Delete </button>}
                                <button type="button" className='btn submit_btn' onClick={handleSubmit}> Save </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
            {/*  */}

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                        <div className='icons'>
                        <img src={OfficeBuilding} alt="" />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        {/* <h1 className='heading mb-4'> Work Experience </h1> */}
                        <div className="make_resume_content_block">
                            <div className="make_resume_content">
                                <h2 className="mrc_heading"> Welcome to the Work Experience Section </h2>
                                <p className="src_desc"> Even if you’ve never held a formal job, this section is still an essential part of your resume and can be adapted to showcase any informal work experience you may have had, such as babysitting, lawn mowing, or helping with a family business. </p>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> How It Works </h2>
                                <ul className="">
                                    <li> You can list any work experience, whether paid, unpaid, or informal. </li>
                                    <li> This section highlights your ability to manage tasks, collaborate with others, and show commitment. </li>
                                    <li> Employers value your willingness to take on responsibility and your eagerness to contribute. </li>
                                </ul>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> Why It Matters </h2>
                                <p className="src_desc"> Your work experience demonstrates valuable qualities like punctuality, teamwork, and problem-solving. Whether formal or informal, it shows employers that you have the skills and mindset to succeed in a job. </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default WorkExperience;
