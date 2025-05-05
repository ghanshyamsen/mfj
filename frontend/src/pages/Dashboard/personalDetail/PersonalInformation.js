import React, {useState, useEffect} from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useWizard } from "react-use-wizard";
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import Autocomplete from "react-google-autocomplete";
import { Calendar } from 'primereact/calendar';
import resumeHook from "../../../userStatusHook";
import { FloatLabel } from 'primereact/floatlabel';

function PersonalInformation({GoNextStep, goDashboardPage, data, onUpdate}) {

    const userData = resumeHook().data;
    const User = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem('token');
    const { nextStep } = useWizard();
    const [countryCode, setCountryCode] = useState('US'); // Define default country code, e.g., 'US'
    const [addressChange, setAdressChange] = useState(''); // Define
    const [userInfo, setUserInfo] = useState({
        firstName: (User.first_name||''),
        lastName: (User.last_name||''),
        phoneNumber: (User.phone_number||''),
        email: (User.email||''),
        date_of_birth: (User.date_of_birth||''),
        location: "",
        street_address: '',
        city: '',
        state:'',
        zip_code: '',
        preferredPronouns: "",
        countryCode: 'US',
        location_miles:""
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: "",
        email: "",
        date_of_birth: "",
        location: "",
        street_address: '',
        city: '',
        state:'',
        zip_code: '',
        preferredPronouns: ""
    });



    // Effect to update state when data changes
    useEffect(() => {
        if(userData){
            setUserInfo({
                firstName: (User.first_name || User.first_name || ''),
                lastName: (User.last_name || User.last_name || ''),
                phoneNumber: (User.phone_number || User.phone_number || ''),
                email: (User.email || User.email || ''),
                location: (User.location || ''),
                street_address: User.street_address || '',
                city: (User.city || ''),
                state: (User.state || ''),
                zip_code: (User.zip_code || ''),
                preferredPronouns: (User.pronouns || ''),
                countryCode: 'US',
                location_miles: User.location_miles || '',
                date_of_birth: User.date_of_birth || '',
            });

            setAdressChange((userData.location || ''));
        }

    }, [userData]);

    const handleChange = (e) => {

        let name, value;

        if (e && e.target) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = 'phoneNumber';
            value = e;
        }

        setUserInfo(prev => ({
            ...prev,
            [name]: value,
            phoneNumber: name === 'phoneNumber' ? value : prev.phoneNumber,
        }));

        if (name === 'phoneNumber') {
            updateCountryCode(value);
        }

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handlePlaceSelect = (place) => {

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

        setAdressChange(location);

        setUserInfo(prev => ({
            ...prev,
            location,
            street_address:street,
            city: city,
            state: state,
            zip_code: zipcode,
        }));
        setErrors(prev => ({
            ...prev,
            location: '',
            street_address:'',
            city: '',
            state: '',
            zip_code: ''
        }));
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // Check if first name is empty
        if (!userInfo.firstName.trim()) {
            errors.firstName = 'First name is required';
            isValid = false;
        }

        // Check if last name is empty
        if (!userInfo.lastName.trim()) {
            errors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!emailRegex.test(userInfo.email) || !userInfo.email.trim()) {
            errors.email ='Please enter a valid email address';
            isValid = false;
        }

        if ((addressChange!==userInfo.location.trim()) || !userInfo.location.trim()) {
            errors.location = 'Please select an address from the dropdown';
            isValid = false;
        }

        if (!userInfo.street_address.trim()) {
            errors.street_address = 'Street address is required';
            isValid = false;
        }

        if (!userInfo.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required';
            isValid = false;
        }else if(userInfo.date_of_birth && !window.isAge13OrOlder(userInfo.date_of_birth)){
            errors.date_of_birth = 'For legal and safety reasons, users of this platform must be 13 years of age or older.';
            isValid = false;
        }

        if (!userInfo.city.trim()) {
            errors.city = 'City is required';
            isValid = false;
        }

        if (!userInfo.state.trim()) {
            errors.state = 'State is required';
            isValid = false;
        }

        if (!userInfo.zip_code.trim()) {
            errors.zip_code = 'Zip Code is required';
            isValid = false;
        }

        if (!userInfo.phoneNumber) {
             errors.phoneNumber = 'Please enter a phone number';
             isValid = false;
        } else {
            // Parse the phone number using libphonenumber-js
            const parsedPhoneNumber = parsePhoneNumberFromString(userInfo.phoneNumber, countryCode);

            // Check if the parsed phone number is valid
            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                errors.phoneNumber = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        setErrors(errors);
        return isValid;
    };

    const handleClickNext = () => {

        const isValid = validateForm();

        if (isValid) {

            try {

                const payload = {
                    signup_type: userInfo.signupType,
                    first_name: userInfo.firstName,
                    last_name: userInfo.lastName,
                    phone_number: userInfo.phoneNumber,
                    email: userInfo.email,
                    location: userInfo.location,
                    street_address: userInfo.street_address,
                    city: userInfo.city,
                    state: userInfo.state,
                    zip_code: userInfo.zip_code,
                    pronouns: userInfo.preferredPronouns,
                    location_miles: userInfo.location_miles,
                    date_of_birth: userInfo.date_of_birth
                };



                fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${User._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization':  `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }).then(function(response){
                    return response.json();
                }).then(async function(resp){
                    if (resp.status === 'success') {
                        await updateProfileData(payload);
                        localStorage.setItem('userData', JSON.stringify(resp.data));
                        onUpdate(userInfo);
                        GoNextStep();
                        nextStep();
                    } else {
                        window.showToast(resp.message, 'error');
                    }
                });
            } catch (error) {
                window.showToast(error.message, 'error');
            }


        }
    }

    const updateProfileData = async (payload) => {
        try {
            fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, {
                method: 'PATCH',
                headers: {
                    'Authorization':  `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }).then(function(response){
                return response.json();
            }).then(async function(resp){
                if (resp.status == 'S') {}
            });

        } catch (error) {
            window.showToast(error.message, 'error');
        }
    }

    const closeInfomastion = () => {
        goDashboardPage();
    }

    const updateCountryCode = (phoneNumber) => {
        if (phoneNumber) {
          const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
          if (phoneNumberObj) {
            setUserInfo((prevState) => ({
              ...prevState,
              countryCode: phoneNumberObj.country,
            }));
          }
        }
    };

    useEffect(() => {
        if (userInfo.phoneNumber) {
            updateCountryCode(userInfo.phoneNumber);
        }
    }, [userInfo.phoneNumber]);

    const handleAddr = (e) => {
        setUserInfo(prev => ({
            ...prev,
            ['location']:e.target.value
        }));


    }

    return(
        <>
            <div className='personalinformation_page'>
                <div className='rim_content'>
                    <h1 className='rim_heading'>Enter your personal information</h1>
                    <p className='rim_text'>This is the information that will be displayed on your resume. To update this info please access it through your Account Settings</p>
                </div>
                <div className='form-block'>
                    <FloatingLabel controlId="floatingFirstName" label={<span> First Name <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={userInfo.firstName}
                            onChange={handleChange}
                            maxLength="25"
                            placeholder=""
                        />
                        {errors.firstName && <div className="error-message text-danger">{errors.firstName}</div>}
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingLastName" label={<span> Last Name <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={userInfo.lastName}
                            onChange={handleChange}
                            maxLength="25"
                            placeholder=""
                        />
                        {errors.lastName && <div className="error-message text-danger">{errors.lastName}</div>}
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingphoneNumber" label={<span> Phone Number <span className='required'>*</span> </span>} className="mb-3">
                        <PhoneInput
                            defaultCountry="US"
                            country="US"
                            international
                            withCountryCallingCode
                            placeholder=""
                            className="form-control"
                            value={userInfo.phoneNumber}
                            onChange={value => handleChange({ target: { name: 'phoneNumber', value } })}
                        />
                        {errors.phoneNumber && <div className="error-message text-danger">{errors.phoneNumber}</div>}
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingEmail" label={<span>Email <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            placeholder=""
                        />
                        {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                    </FloatingLabel>

                    <FloatLabel controlId="floatingdate" label="" className="mb-3">
                        <Calendar
                            name="date_of_birth"
                            value={userInfo.date_of_birth?new Date(userInfo.date_of_birth):""}
                            onChange={handleChange}
                            placeholder=""
                            maxDate={new Date()}
                        />
                        <label htmlFor="date_of_birth">Date of Birth <span className='required'>*</span></label>
                    </FloatLabel>
                    {errors.date_of_birth && <div className="error-message text-danger">{errors.date_of_birth}</div>}

                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingLocation" label={<span>Location <span className='required'>*</span> </span>}>
                            <Autocomplete
                                className="form-control"
                                placeholder=""
                                defaultValue={userInfo.location}
                                apiKey={process.env.REACT_APP_LOCATION_API_KEY}
                                onPlaceSelected={handlePlaceSelect}
                                options={{
                                    types: ['geocode'], // or 'address' if you need full address
                                    componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                                    fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                                    disableAutoPan: true
                                }}
                                onChange={handleAddr}
                            />
                        </FloatingLabel>
                        {errors.location && <div className="error-message text-danger">{errors.location}</div>}
                        <p className="phone_Text"> Eg.: 2972 Westheimer Rd. Santa Ana, Illinois 85486 </p>
                    </div>

                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingCity" label={<span>Street Address <span className='required'>*</span> </span>}>
                            <Form.Control
                                type="text"
                                placeholder=""
                                name='street_address'
                                value={userInfo.street_address||''}
                                onChange={handleChange}
                                maxLength="50"
                            />
                        </FloatingLabel>
                        {errors.street_address && <div className="error-message text-danger">{errors.street_address}</div>}
                    </div>

                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingCity" label={<span>City <span className='required'>*</span> </span>}>
                            <Form.Control
                                type="text"
                                placeholder=""
                                name='city'
                                value={userInfo.city||''}
                                onChange={handleChange}
                                maxLength="50"
                            />
                        </FloatingLabel>
                        {errors.city && <div className="error-message text-danger">{errors.city}</div>}
                    </div>
                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingState" label={<span>State <span className='required'>*</span> </span>}>
                            <Form.Control
                                type="text"
                                placeholder=""
                                name='state'
                                value={userInfo.state||''}
                                onChange={handleChange}
                                maxLength="30"
                            />
                        </FloatingLabel>
                        {errors.state && <div className="error-message text-danger">{errors.state}</div>}
                    </div>
                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingZipCode" label={<span>Zip Code <span className='required'>*</span> </span>}>
                            <Form.Control
                                type="text"
                                placeholder=""
                                name='zip_code'
                                value={userInfo.zip_code||''}
                                onChange={handleChange}
                                maxLength="15"
                            />
                        </FloatingLabel>
                        {errors.zip_code && <div className="error-message text-danger">{errors.zip_code}</div>}
                    </div>

                    {/* <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingSelect" label="Location Radius">
                            <Form.Select aria-label="Floating label select example" name='location_miles' value={userInfo.location_miles||''} onChange={handleChange} >
                                <option value="">Anywhere from the location</option>
                                <option value="10">10 Miles</option>
                                <option value="20">20 Miles</option>
                                <option value="30">30 Miles</option>
                                <option value="40">40 Miles</option>
                                <option value="50">50 Miles</option>
                                <option value="60">60 Miles</option>
                                <option value="70">70 Miles</option>
                                <option value="80">80 Miles</option>
                                <option value="90">90 Miles</option>
                                <option value="100">100 Miles</option>
                            </Form.Select>
                        </FloatingLabel>
                        <p className="phone_Text"> e.g., Travel for work within 30 miles of the your's home </p>
                    </div> */}

                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingSelect" label="Preferred Pronouns">
                            <Form.Select aria-label="Floating label select example"   name='preferredPronouns' value={userInfo.preferredPronouns} onChange={handleChange} >
                            <option value="">Select</option>
                            <option value="He/Him/His">He/Him/His</option>
                            <option value="She/Her/Hers">She/Her/Hers</option>
                            <option value="Ze/Hir/Hirs">Ze/Hir/Hirs</option>
                            <option value="They/Them/Theirs">They/Them/Theirs</option>
                            <option value="Other/Prefer not to say"> Other/Prefer not to say </option>
                            </Form.Select>
                            {errors.preferredPronouns && <div className="error-message text-danger">{errors.preferredPronouns}</div>}
                        </FloatingLabel>
                        <p className="phone_Text"> Optional </p>
                    </div>

                    <div className='btn_block'>
                        {/* <button type="button" className='btn submit_btn back-button close_btn' onClick={closeInfomastion}> Close </button> */}
                        <button type="button" className='btn submit_btn m-0' onClick={handleClickNext}> Next </button>
                    </div>
                </div>
          </div>
        </>
    );
}

export default PersonalInformation;
