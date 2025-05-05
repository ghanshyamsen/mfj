import React, { useState } from 'react';
import { useWizard } from "react-use-wizard";
import backArrow from '../../assets/images/fi_arrow-left.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Autocomplete from "react-google-autocomplete";

import PhoneInput from 'react-phone-number-input/input'
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js

function BusinessInfo({ data, onUpdate }) {

    const { previousStep, nextStep } = useWizard();


    const [businessInfo, setBusinessInfo] = useState({
        businessName: (data.business_type || ''),
        EINNumber: (data.business_ein_number || ''),
        location: (data.location || ''),
        street_address: (data?.street_address || ''),
        city: (data.city || ''),
        state: (data.state || ''),
        zip_code: (data.zip_code || ''),
        number_of_employees:(data.number_of_employees || ''),
        hear_about: (data.hear_about || ''),
        hear_about_other: (data.hear_about_other || ''),
        phone_number:(data.phone_number || ''),
        email:(data.email || ''),
    });



    const [errors, setErrors] = useState({
        businessName: '',
        EINNumber: '',
        location: '',
        city: "",
        state: "",
        zip_code: "",
        number_of_employees: "",
        hear_about: '',
        hear_about_other: "",
        phone_number:"",
        email:""
    });

    const handleChange = (e) => {

        let { name, value } = e.target;

        if (name === 'EINNumber') {
            // Check if the value is more than 2 characters and doesn't already contain a dash
            if (value.length > 2 && !value.includes('-')) {
                // Insert a dash after the first two digits
                value = value.slice(0, 2) + '-' + value.slice(2);
            }
        }

        // Update state with the formatted value
        setBusinessInfo(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleBusinessInfo = () => {
        const isValid = validateForm();
        if (isValid) {
            onUpdate({
                ...data,
                business_type: businessInfo.businessName,
                business_ein_number: businessInfo.EINNumber,
                location: businessInfo.location,
                street_address: businessInfo.street_address,
                city: businessInfo.city,
                state: businessInfo.state,
                zip_code: businessInfo.zip_code,
                number_of_employees: businessInfo.number_of_employees,
                hear_about: businessInfo.hear_about,
                hear_about_other: businessInfo.hear_about_other,
                email: businessInfo.email,
                phone_number: businessInfo.phone_number
            })
            nextStep();
        }
    };

    const handlePlaceSelected = (place) => {

        const location = place.formatted_address || place.description || ''; // Use the correct property that holds the address

        const addressComponents = place.address_components || [];

        let street = '';
        let city = '';
        let state = '';
        let zipcode = '';

        addressComponents.forEach(component => {
            const types = component.types;

            if (types.includes('street_number')) {
                street += component.long_name + ' ';
            }

            if (types.includes('route')) {
                street += component.long_name;
            }

            if (types.includes('locality')) {
                city = component.long_name;
            }

            if (types.includes('administrative_area_level_1')) {
                state = component.short_name; // Use short_name for state abbreviations like 'NY'
            }

            if (types.includes('postal_code')) {
                zipcode = component.long_name;
            }
        });

        setBusinessInfo(prev => ({
            ...prev,
            location: location,
            street_address: street,
            city: city,
            state: state,
            zip_code: zipcode
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!businessInfo.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
            isValid = false;
        }

        if (!businessInfo.location.trim()) {
            newErrors.location = 'Please select an address from the dropdown';
            isValid = false;
        }

        if (!businessInfo.EINNumber.trim()) {
            newErrors.EINNumber = 'EIN Number is required';
            isValid = false;
        }else{
            const regex = /^\d{2}-\d{7}$/;
            if(!regex.test(businessInfo.EINNumber)){
                newErrors.EINNumber = 'Invalid EIN Number or format, Please enter valid EIN Number (XX-XXXXXXX).';
                isValid = false;
            }
        }

        if (!businessInfo.street_address.trim()) {
            newErrors.street_address = 'Street address is required';
            isValid = false;
        }

        if (!businessInfo.city.trim()) {
            newErrors.city = 'City is required';
            isValid = false;
        }

        if (!businessInfo.state.trim()) {
            newErrors.state = 'State is required';
            isValid = false;
        }

        if (!businessInfo.zip_code.trim()) {
            newErrors.zip_code = 'Zip Code is required';
            isValid = false;
        }

        if (!businessInfo.number_of_employees.trim()) {
            newErrors.number_of_employees = 'Please select a number of employees from the dropdown';
            isValid = false;
        }

        if (!businessInfo.hear_about.trim()) {
            newErrors.hear_about = 'This field is required';
            isValid = false;
        }

        if (businessInfo.hear_about==='Other' && !businessInfo.hear_about_other.trim()) {
            newErrors.hear_about_other = 'This field is required';
            isValid = false;
        }

        if (!businessInfo.phone_number) {
            newErrors.phone_number = 'Please enter a phone number';
        } else {
            const parsedPhoneNumber = parsePhoneNumberFromString(businessInfo.phone_number, 'US');
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                newErrors.phone_number =  'Please enter a valid phone number';
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(businessInfo.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <div className='auth_form_block'>
            <button type='button' className='back_btn' onClick={previousStep}>
                <img src={backArrow} alt="" />
            </button>
            <h1 className='heading'>Business info</h1>
            <p className='login_text'>Please enter your business information exactly as it appears on your official government documents.</p>

            <div className='form-group mb-3'>
                <FloatingLabel
                    controlId="floatingBusinessName"
                    label={<span> Business Name <span className='required'>*</span> </span>}
                >
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="businessName"
                        value={businessInfo.businessName}
                        onChange={handleChange}
                        maxLength="100"
                    />
                    {errors.businessName && <div className="error-message text-danger">{errors.businessName}</div>}
                </FloatingLabel>
            </div>

            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingStreet"
                    label={<span> Location <span className='required'>*</span> </span>}
                >
                     <Autocomplete
                        className="form-control"
                        placeholder=""
                        defaultValue={businessInfo.location}
                        apiKey={process.env.REACT_APP_LOCATION_API_KEY}
                        onPlaceSelected={handlePlaceSelected}
                        options={{
                            types: ['geocode'], // or 'address' if you need full address
                            componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                            fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                            disableAutoPan: true
                        }}
                    />
                </FloatingLabel>
                {errors.location && <div className="error-message text-danger">{errors.location}</div>}
                {/* <p className="phone_Text"> Eg.: 2972 Westheimer Rd. Santa Ana, Illinois 85486  </p> */}
            </div>

            {/*  */}
            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingStreetAddress" 
                    label={<span> Street Address <span className='required'>*</span> </span>}
                    >
                    <Form.Control
                        type="text"
                        placeholder=""
                        name='street_address'
                        value={businessInfo.street_address}
                        onChange={handleChange}
                        maxLength="50"
                    />
                </FloatingLabel>
                {errors.street_address && <div className="error-message text-danger">{errors.street_address}</div>}
            </div>
            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingCity"
                    label={<span> City <span className='required'>*</span> </span>}
                    >
                    <Form.Control
                        type="text"
                        placeholder=""
                        name='city'
                        value={businessInfo.city}
                        onChange={handleChange}
                        maxLength="50"
                    />
                </FloatingLabel>
                {errors.city && <div className="error-message text-danger">{errors.city}</div>}
            </div>
            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingState" 
                    label={<span> State <span className='required'>*</span> </span>}
                    >
                    <Form.Control
                        type="text"
                        placeholder=""
                        name='state'
                        value={businessInfo.state}
                        onChange={handleChange}
                        maxLength="30"
                    />
                </FloatingLabel>
                {errors.state && <div className="error-message text-danger">{errors.state}</div>}
            </div>
            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingZipCode" 
                    label={<span> Zip Code <span className='required'>*</span> </span>}
                    >
                    <Form.Control
                        type="text"
                        placeholder=""
                        name='zip_code'
                        value={businessInfo.zip_code}
                        onChange={handleChange}
                        maxLength="15"
                    />
                </FloatingLabel>
                {errors.zip_code && <div className="error-message text-danger">{errors.zip_code}</div>}
            </div>

            {/*  */}

            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingEINNumber" 
                    label={<span> Employer Identification Number (EIN) <span className='required'>*</span> </span>}
                    >
                    <Form.Control
                        type="text"
                        placeholder=""
                        name='EINNumber'
                        value={businessInfo.EINNumber}
                        onChange={handleChange}
                        maxLength="10"
                    />
                    {errors.EINNumber && <div className="error-message text-danger">{errors.EINNumber}</div>}
                    <p className="phone_Text"> The United States IRS uses your EIN (XX-XXXXXXX) to identify your business for tax purposes </p>
                </FloatingLabel>
            </div>

            {/*  */}

            {
                data.signup_type === 'email' &&
                <div className='mb-3'>
                    <div className='form-group'>
                        <PhoneInput
                            defaultCountry="US"
                            country="US"
                            international
                            withCountryCallingCode
                            placeholder="Phone number"
                            className="form-control"
                            value={businessInfo.phone_number||''}
                            onChange={(value) => setBusinessInfo(prev => ({ ...prev, ['phone_number']: value })) }
                            name="phone_number"
                        />
                        {errors.phone_number && <div className="error-message text-danger">{errors.phone_number}</div>}
                    </div>
                </div>
            }

            {
                data.signup_type === 'mobile' &&
                <div className='mb-3'>
                    <div className='form-group'>
                        <Form.Control
                            type="email"
                            name="email"
                            value={businessInfo.email || ''}
                            onChange={handleChange}
                            placeholder="Email address"
                        />
                        {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                    </div>
                </div>
            }

            {/*  */}

            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingEmployees" 
                    label={<span> Number of Employees <span className='required'>*</span> </span>}
                     className='noe_select'>
                     <Form.Select aria-label="Floating Default select example" name='number_of_employees' value={businessInfo.number_of_employees} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="1-49 employees">1-49 employees</option>
                        <option value="50-149 employees">50-149 employees</option>
                        <option value="150-249 employees">150-249 employees</option>
                        <option value="250-499 employees">250-499 employees</option>
                        <option value="500-749 employees">500-749 employees</option>
                        <option value="750-999 employees">750-999 employees</option>
                        <option value="1,000+ employees">1,000+ employees </option>
                    </Form.Select>
                </FloatingLabel>
                {errors.number_of_employees && <div className="error-message text-danger">{errors.number_of_employees}</div>}
            </div>

            <div className='form-group mb-3'>
                <FloatingLabel controlId="floatingHearAbout" 
                    label={<span> How Did You Hear About Us? <span className='required'>*</span> </span>}
                     className='noe_select'>
                     <Form.Select aria-label="Floating Default select example" name='hear_about' value={businessInfo.hear_about} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Radio">Radio</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Online Video">Online Video</option>
                        <option value="TV">TV</option>
                        <option value="Word-of-Mouth">Word-of-Mouth</option>
                        <option value="Newspaper">Newspaper</option>
                        <option value="Podcast">Podcast </option>
                        <option value="Streaming Audio (e.g., Spotify, Pandora)">Streaming Audio (e.g., Spotify, Pandora) </option>
                        <option value="Mail">Mail </option>
                        <option value="Billboard">Billboard </option>
                        <option value="Search Engine (e.g., Google, Bing, Yahoo)">Search Engine (e.g., Google, Bing, Yahoo) </option>
                        <option value="Other">Other </option>
                    </Form.Select>
                </FloatingLabel>
                {errors.hear_about && <div className="error-message text-danger">{errors.hear_about}</div>}
            </div>

            {businessInfo.hear_about === "Other" &&
                <div className='form-group mb-3'>
                    <FloatingLabel controlId="floatingOther" 
                    label={<span> Other <span className='required'>*</span> </span>}
                    >
                        <Form.Control
                            type="text"
                            placeholder=""
                            name='hear_about_other'
                            value={businessInfo.hear_about_other}
                            onChange={handleChange}
                            maxLength="100"
                        />
                        {errors.hear_about_other && <div className="error-message text-danger">{errors.hear_about_other}</div>}
                    </FloatingLabel>
                </div>
            }



            <button type='button' className='btn submit_btn' onClick={handleBusinessInfo}> Continue </button>

        </div>
    );
}

export default BusinessInfo;
