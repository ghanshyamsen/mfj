import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'

function Supervisor({GoBackStep, GoNextStep, vexperience, setVExperience}) {

    const { nextStep, previousStep } = useWizard();

    const [formdata, setFromData] = useState({
        firstname:"",
        lastname:"",
        phonenumber:"",
        email:""
    });

    const [errors, setErrors] = useState({});

    const handleClickNext = () => {
        let FormDataObj = formdata;
        // Validate the form data
        const validationErrors = validateForm(formdata);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        setVExperience(1,{
            title:"Supervisor",
            info:[
                {
                    question:"First name",
                    answer: formdata.firstname,
                    firstname: formdata.firstname,
                    question_tag: "firstname"
                },
                {
                    question:"Last name",
                    answer: formdata.lastname,
                    lastname: formdata.lastname,
                    question_tag: "lastname"
                },
                {
                    question:"Phone number",
                    answer: formdata.phonenumber,
                    phonenumber: formdata.phonenumber,
                    question_tag: "phonenumber"
                },
                {
                    question:"Email address",
                    answer: formdata.email,
                    email: formdata.email,
                    question_tag: "email"
                }
            ]
        });

        GoNextStep();
        nextStep();
    }

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{8,14}$/;

    const validateForm = (data) => {
        const errors = {};

        // You can add more validation logic here
        if(!data.firstname.trim()){
            errors.firstname = "First name is required.";
        }

        if(!data.lastname.trim()){
            errors.lastname = "Last name is required.";
        }

        if(!phoneRegex.test(data.phonenumber)){
            errors.phonenumber = "Phone number is required.";
        }else{
            // Parse the phone number using libphonenumber-js
            const parsedPhoneNumber = parsePhoneNumberFromString(data.phonenumber, 'US');

            // Check if the parsed phone number is valid
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                errors.phonenumber = 'Please enter a valid phone number';
            }
        }

        if (!emailRegex.test(data.email)) {
            errors.email ='Please enter a valid email address';
        }

        return errors;
    }

    const handleChange = (e) => {
        setFromData({...formdata,[e.target.name]: e.target.value});
    }

    useEffect(() => {
        if (vexperience) {
            const data = vexperience;
            const info = {};

            data.info.forEach((value) => {
                info[value.question_tag] = value.answer;
            });

            setFromData(info);
        }
    }, [vexperience]);


    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Supervisor</h1>
                </div>
                <div className=''>
                    <FloatingLabel controlId="floatingorganization" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={formdata.firstname||""}
                            onChange={handleChange}
                            maxLength="25"
                            placeholder=""
                        />
                        {errors.firstname && <div className="error-message text-danger">{errors.firstname}</div>}
                    </FloatingLabel>
                </div>
                <div className=''>
                    <FloatingLabel controlId="floatingorganization" label={<span> Last Name <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={formdata.lastname||""}
                            onChange={handleChange}
                            maxLength="25"
                            placeholder=""
                        />
                        {errors.lastname && <div className="error-message text-danger">{errors.lastname}</div>}
                    </FloatingLabel>
                </div>
                <div className=''>
                    <FloatingLabel controlId="floatingorganization" label={<span> Phone Number <span className='required'>*</span> </span>} className="mb-3">
                        <PhoneInput
                            placeholder=""
                            defaultCountry="US"
                            country="US"
                            international
                            withCountryCallingCode
                            className="form-control"
                            value={formdata.phonenumber||""}
                            onChange={value => handleChange({ target: { name: 'phonenumber', value } })}
                        />
                        {errors.phonenumber && <div className="error-message text-danger">{errors.phonenumber}</div>}
                    </FloatingLabel>
                </div>
                <div className=''>
                    <FloatingLabel controlId="floatingorganization" label={<span> Email address <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            value={formdata.email||""}
                            onChange={handleChange}
                            maxLength="255"
                            placeholder=""
                        />
                        {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                    </FloatingLabel>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default Supervisor;