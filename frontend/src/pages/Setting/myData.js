import React, { useState, useEffect, useRef } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import camera from '../../assets/images/camera.svg';
import deleteicon from '../../assets/images/delete.svg';
import GoogleLogo from '../../assets/images/Googlelogo.svg';
import linkedin from '../../assets/images/linkedin.svg';
import userDataHook from "../../userDataHook";
import { useNavigate } from 'react-router-dom';
import Autocomplete from "react-google-autocomplete";
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Importing from libphonenumber-js
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import { useProfile } from '../../ProfileContext';
import SweetAlert from 'react-bootstrap-sweetalert';
import File from '../../assets/images/file.svg';
import Downloads from '../../assets/images/downloads.png';
import { ProgressSpinner } from 'primereact/progressspinner';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { decrypt } from '../../cryptoUtils';

import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';

import { useLinkedIn  } from 'react-linkedin-login-oauth2';

import CropImage from '../CropImage/Index';


function MyData({handleCloseModal}) {

    const { profileImage, setProfileImage, setProfileName  } = useProfile();
    const [imageLoading, setImageLoading] = useState(true);
    const userData = userDataHook();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [countryCode] = useState('US'); // Define default country code, e.g., 'US'
    const fileInputRef = useRef(null);

    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: '',
        phoneNumber: "",
        businessName: "",
        location: "",
        street_address:"",
        email: "",
        date_of_birth: "",
        pronouns: "",
        location_miles:"",
        preferred_name:"",
        city: "",
        state: "",
        zip_code: "",
        number_of_employees: "",
        hear_about: "",
        hear_about_other: ""
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: "",
        businessName: "",
        location: "",
        street_address:"",
        einnumber: "",
        profileImage: "",
        pronouns:"",
        location_miles:"",
        city: "",
        state: "",
        zip_code: "",
        number_of_employees: "",
        hear_about: "",
        hear_about_other: "",
        date_of_birth: ""
    });

    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [croppingFile, setCroppingFile] = useState('');
    const [addressChange, setAdressChange] = useState(''); // Define
    const [otp, setOtp] = useState('');
    const [expectedOtp, setExpectedOtp] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    useEffect(() => {
        if (userData) {

            setUserInfo({
                firstName: userData.first_name || '',
                lastName: userData.last_name || '',
                preferred_name: userData.preferred_name || '',
                phoneNumber: userData.phone_number || '',
                businessName: userData.business_type || '',
                location: userData.location || '',
                einnumber: userData.business_ein_number || '',
                email: userData.email || '',
                pronouns: userData.pronouns || '',
                location_miles: userData.location_miles || '',
                street_address: userData.street_address || '',
                city: (userData.city || ''),
                state: (userData.state || ''),
                zip_code: (userData.zip_code || ''),
                number_of_employees:(userData.number_of_employees || ''),
                hear_about: (userData.hear_about || ''),
                hear_about_other: (userData.hear_about_other || ''),
                date_of_birth: (userData.date_of_birth || ''),
            });

            setProfileImage(userData.profile_image || '');
            setProfileName(userData.preferred_name?userData.preferred_name:`${userData.first_name} ${userData.last_name}`);
            setAdressChange((userData.location || ''));

            setCurrentEmail(userData.email);

            setTimeout(() => {
                setImageLoading(false);
            }, 200);
        }
    }, [userData, setProfileImage, setProfileName]);

    const handleSpanClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    const handleChange = (e) => {
        let name, value;


        if (e && e.target) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = 'phoneNumber';
            value = e;
        }

        if (name === 'einnumber') {
            // Check if the value is more than 2 characters and doesn't already contain a dash
            if (value.length > 2 && !value.includes('-')) {
                // Insert a dash after the first two digits
                value = value.slice(0, 2) + '-' + value.slice(2);
            }
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {

            const type = await window.detectMimeType(file);

            if (type !== 'image/png' && type !== 'image/jpeg' && type !== 'image/jpg') {
                window.showToast('Please select a valid file png, jpeg, jpg.','error');
                e.target.value = "";
                return false;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB limit
            if (file.size > maxSize) {
                window.showToast('File size exceeds 5MB', 'error');
                e.target.value = "";
                return
            }

            var reader = new FileReader();

            reader.onload = function(e) {
                setCroppingFile(e.target.result);
                setShowModal(true);
                e.target.value = "";
            }

            reader.readAsDataURL(file); // Read the file as a data URL
            return
        }
    };

    const uploadCropImage = (file) => {


        setImageLoading(true);

        const formdata = new FormData();
        // Append the file to the form data
        formdata.append('profile_image', file, 'cropped_image.png');

        try{
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/update-profile-image/${userData._id}`, requestOptions)
            .then((response) => response.json())
            .then(function(response){
                if(response.status === 'success'){
                    const profileImage = response.image;
                    setProfileImage(profileImage);
                    setImageLoading(false);
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    userData.profile_image = profileImage;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    handleResumeImage(file);
                }else{
                    window.showToast(response.message, 'error')
                }

            })
            .catch((error) => window.showToast(error, 'error'));

        } catch(error) {
            window.showToast('Error uploading file:', error, 'error')
        }
    }

    const handleResumeImage = async (file) => {
        if (file) {
             // Create a FormData instance
            const formdata = new FormData();
            // Append the file to the form data
            formdata.append('image', file, 'cropped_image.png');

            try{
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${token}`);

                const requestOptions = {
                  method: "POST",
                  headers: myHeaders,
                  body: formdata,
                  redirect: "follow"
                };

                fetch(`${process.env.REACT_APP_API_URL}/app/upload-resume-image`, requestOptions)
                .then((response) => response.json())
                .then(function(response){})
                .catch((error) => window.showToast(error.message, 'error'));

            } catch(error) {
                window.showToast('Error uploading file:'+error.message, 'error')
            }

        }
    };

     /* crop image */
        const handleCropComplete = (croppedImage) => {
            setProfileImage(croppedImage.croppedImageUrl)
            uploadCropImage(croppedImage.blob);
        };

        const handleModalClose = () => {
            setShowModal(false);
        };

        const handleModalOpen = () => {
            setShowModal(true);
        };

    /*  */

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

    const handleDelete = () => {

        const fileInput = document.getElementById('fileInput');
        if (fileInput) { fileInput.value = ''; }
        setImageLoading(true);

        try{

            handleDeleteResumeImage();

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: {},
                redirect: "follow"
              };

            fetch(`${process.env.REACT_APP_API_URL}/app/update-profile-image/delete`, requestOptions)
            .then((response) => response.json())
            .then(function(response){

                if(response.status !== 'F'){
                    const profileImage = response.image;
                    setProfileImage(profileImage);
                    setImageLoading(false);
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    userData.profile_image = profileImage;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    window.showToast(response.message, 'success');
                }
            })
            .catch((error) => window.showToast(error, 'error'))

        }catch(error){
            window.showToast(error.message, 'error');
        }
    }

    const handleDeleteResumeImage = () => {
        try{

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                body: {},
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/delete-resume-image`, requestOptions)
            .then((response) => response.json())
            .then(function(response){})
            .catch((error) => window.showToast(error.message, 'error'))

        }catch(error){
            window.showToast(error.message, 'error')
        }

    }

    const handleUpdate = async () => {


        const isValid = validateForm();

        if (isValid) {

            if(currentEmail!==userInfo.email){
                if(!otp || !expectedOtp){
                    window.showToast("Please verify your new email first.", 'error');
                    return
                }

                if(otp!==decrypt(expectedOtp)){
                    window.showToast("Invalid code, please enter the valid code.", 'error');
                    return
                }
            }

            try {
                const payload = {
                    first_name: userInfo.firstName,
                    last_name: userInfo.lastName,
                    phone_number: userInfo.phoneNumber,
                    business_type: userInfo.businessName,
                    location: userInfo.location,
                    business_ein_number: userInfo.einnumber,
                    email: userInfo.email,
                    pronouns: userInfo.pronouns,
                    location_miles: userInfo.location_miles,
                    preferred_name: userInfo.preferred_name,
                    street_address:userInfo.street_address,
                    city: userInfo.city,
                    state: userInfo.state,
                    zip_code: userInfo.zip_code,
                    number_of_employees: userInfo.number_of_employees,
                    hear_about: userInfo.hear_about,
                    hear_about_other: userInfo.hear_about_other,
                    date_of_birth: userInfo.date_of_birth
                };

                handleResumeInfo(payload);

                await fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${userData._id}`, {
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
                        localStorage.setItem('userData', JSON.stringify(resp.data));
                        window.showToast(resp.message, 'success');

                        handleNameChange(resp.data.preferred_name?resp.data.preferred_name:`${resp.data.first_name} ${resp.data.last_name}`);
                        setOtp('');
                        setExpectedOtp('');

                        setCurrentEmail(resp.data.email);
                    } else {
                        window.showToast(resp.message, 'error');
                    }
                });
            } catch (error) {
                window.showToast(error.message, 'error');
            }
        }

    };

    const handleNameChange = (newName) => {
        setProfileName(newName);
    };

    const handleResumeInfo = (payload) => {
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
            }).then(async function(resp){});
        } catch (error) {
            window.showToast(error.message, 'error');
        }
    }

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
            location: location,
            street_address:street,
            city: city,
            state: state,
            zip_code: zipcode
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

        if(userData.email){
            // Check if last name is empty
            if (!userInfo.email.trim()) {
                errors.email = 'Email is required';
                isValid = false;
            }else{
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(userInfo.email)) {
                    errors.email = 'Please enter a valid email address';
                    isValid = false;
                }
            }
        }

        if(userData.user_type === 'teenager' && !userInfo.date_of_birth){
            errors.date_of_birth = 'Date of birth is required';
            isValid = false;
        }else if(userData.user_type === 'teenager' && userInfo.date_of_birth && !window.isAge13OrOlder(userInfo.date_of_birth)){
            errors.date_of_birth = 'For legal and safety reasons, users of this platform must be 13 years of age or older.';
            isValid = false;
        }

        if(userData.user_type === 'manager' || userData.user_type === 'teenager' ){
            if ((addressChange!==userInfo.location.trim()) || !userInfo.location.trim()) {
                errors.location = 'Please select an address from the dropdown';
                isValid = false;
            }

            if (!userInfo.street_address.trim()) {
                errors.street_address = 'Street address is required';
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
        }

        if(userData.user_type === 'manager' ){

            if (!userInfo.businessName.trim()) {
                errors.businessName = 'Business name is required';
                isValid = false;
            }

            if (!userInfo.einnumber.trim()) {
                errors.einnumber = 'EIN number is required';
                isValid = false;
            }else{
                const regex = /^\d{2}-?\d{7}$/;
                if(!regex.test(userInfo.einnumber)){
                    errors.einnumber = 'Invalid EIN Number or format, Please enter valid EIN Number (XX-XXXXXXX).';
                    isValid = false;
                }
            }

            if (!userInfo.number_of_employees.trim()) {
                errors.number_of_employees = 'Please select a number of employees from the dropdown';
                isValid = false;
            }

            if (!userInfo.hear_about.trim()) {
                errors.hear_about = 'This field is required';
                isValid = false;
            }

            if (userInfo.hear_about==='Other' && !userInfo.hear_about_other.trim()) {
                errors.hear_about_other = 'This field is required';
                isValid = false;
            }
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


    const handleAddr = (e) => {
        setUserInfo(prev => ({
            ...prev,
            location:e.target.value
        }));

    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedUser');
        navigate('/login');
        window.showToast("Logout Successfull!", 'success');
    }

    const handleAccountDelete = () => {

        const token = localStorage.getItem('token');

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-account`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'success'){
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                localStorage.removeItem('isLoggedUser');
                window.showToast(result.message, 'success');
                navigate('/login');
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error.message));
    }

    const FileDownloadLink = ({ file }) => {

        const fileUrl = `${process.env.REACT_APP_MEDIA_URL}/documents/${file}`;

        const handleDownload = (e) => {
            e.preventDefault();
            fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = file;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => console.error('Download failed:', err));
        }

        return (
            <div className='ufn_right'>
                <a href={fileUrl}  onClick={handleDownload}>
                    <img src={Downloads} alt="Download" />
                </a>
            </div>
        );
    };


    const REDIRECT_URI = process.env.REACT_APP_URL+'/dashboard'; //window.location.href;

    const [gConnect, setGConnect] = useState(userData.google_connect);
    const [lConnect, setLConnect] = useState(userData.linkedin_connect);
    const [googleConnect, setGoogleConnect] = useState((userData.google_connect?JSON.parse(userData.google_connect_data):''));
    const [linkedinConnect, setLinkedinConnect] = useState((userData.linkedin_connect?JSON.parse(userData.linkedin_connect_data):''));

    const onConnectSuccess = async (provider, data) => {
        try {

            const signup_type = provider;
            const connect_data = data;

            if(signup_type === 'google'){
                setGoogleConnect(connect_data);
                setGConnect(true);
            }else{
                if(connect_data.sub){
                    setLinkedinConnect(connect_data);
                    setLConnect(true);
                }else{
                    window.showToast(connect_data.message);
                    return;
                }
            }

            const payload = signup_type === 'google'?{
                google_connect: (signup_type === 'google'? true : false),
                google_connect_data: (signup_type === 'google'? JSON.stringify(connect_data) : {}),
            }:{
                linkedin_connect: (signup_type === 'linkedin'? true : false),
                linkedin_connect_data: (signup_type === 'linkedin'? JSON.stringify(connect_data) : {})
            }

            await fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${userData._id}`, {
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
                    localStorage.setItem('userData', JSON.stringify(resp.data));
                } else {
                    window.showToast(resp.message, 'error');
                }
            });

        } catch (error) {
            window.showToast(error.message, 'error');
        }
    };

    const { linkedInLogin } = useLinkedIn({
        clientId: process.env.REACT_APP_LINKEDIN_APP_ID,
        redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
        scope:"openid profile email",
        onSuccess: (code) => {
            if(code){
                getLinkedInAccess(code);
            }
        },
        onError: (error) => {
          window.showToast(error.message,'error');
        },
    });

    const getLinkedInAccess = (code) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "code": code
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/linkedin`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                onConnectSuccess('linkedin', result.data);
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error));
    }

    const sendOtp = () => {

        const errors = {};
        // Check if last name is empty
        if (!userInfo.email.trim()) {
            errors.email = 'Email is required';
            setErrors(errors);
            return;
        }else{
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userInfo.email)) {
                errors.email = 'Please enter a valid email address';
                setErrors(errors);
                return;
            }
        }
        setErrors(errors);


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "email": userInfo.email,
            "phone_number": "",
            "type": "email"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/send-otp`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                setExpectedOtp(result.data.otp);
                window.showToast(result.message, 'success');
                setOtp('');
            }
        })
        .catch((error) => console.error(error));
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
                onConfirm={handleAccountDelete}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
                >
                You will not be able to recover your account!
            </SweetAlert>

            <div className="heading_block">
                <h1 className="heading"> My Data </h1>
            </div>
            <form >
                <div className='image_update_block'>
                    <div className='change_img icon_img'>
                        <div className='ciicon'>
                            <label htmlFor="fileInput">
                                <img src={camera} alt="Change" />
                            </label>

                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <p className='m-0'>Change</p>
                    </div>

                    <div className='change_user_img'>
                        {imageLoading ?
                            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s" />
                        :
                            <>
                                <img src={profileImage} alt="profile_image" onClick={handleSpanClick} style={{cursor:'pointer'}} />
                                {showModal && (
                                    <CropImage
                                        imageSrc={croppingFile}
                                        onCropComplete={handleCropComplete}
                                        onClose={handleModalClose}
                                        onShow={handleModalOpen}
                                    />
                                )}
                            </>
                        }
                    </div>

                    <div className='delete_img icon_img' onClick={handleDelete}>
                        <div className='ciicon'>
                            <img src={deleteicon} alt="Delete" />
                        </div>
                        <p className='m-0'>Delete</p>
                    </div>
                    {errors.profileImage && <div className="error-message text-danger">{errors.profileImage}</div>}
                </div>
                {/* image block end */}

                {userData.user_type ==='teenager' &&
                    <div className='setting_common_block linked_account_block'>
                        <h1 className='scb_heading'> Linked Accounts </h1>

                        {
                            gConnect?
                            <div className='social_info'>
                                <div className='social_img'> <img src={googleConnect.picture} alt="google_picture" /> </div>
                                <div className='social_user'>
                                    <span> {googleConnect.name} </span>
                                    <span> {googleConnect.sub} </span>
                                </div>
                                <div className='social_icon'><img src={GoogleLogo} alt="" /> </div>
                            </div>
                            :
                            <LoginSocialGoogle
                                client_id={process.env.REACT_APP_GG_APP_ID}
                                redirect_uri={REDIRECT_URI}
                                scope="openid profile email"
                                onResolve={({ provider, data }) => {
                                    onConnectSuccess(provider, data);
                                }}
                                onReject={err => {
                                    console.error(err.message);
                                }}
                            >
                                <button className="btn" type="button">
                                    <img src={GoogleLogo} alt="" /> <span>Connect Google</span>
                                </button>
                            </LoginSocialGoogle>
                        }

                        {
                            lConnect?
                            <div className='social_info'>
                                <div className='social_img'> <img src={linkedinConnect.picture} alt="linkedin_picture" /> </div>
                                <div className='social_user'>
                                    <span> {linkedinConnect.name} </span>
                                    <span> {linkedinConnect.sub} </span>
                                </div>
                                <div className='social_icon'><img src={linkedin} alt="" /> </div>
                            </div>
                            :
                            <button className="btn" type="button" onClick={linkedInLogin}>
                                <img src={linkedin} alt="" /> <span>Connect LinkedIn</span>
                            </button>
                        }
                    </div>
                }

                <div className='setting_common_block personal_info_block'>
                    <h1 className='scb_heading'> Personal info </h1>
                    <FloatingLabel controlId="floatingFirstName" label={<span>First name <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={userInfo.firstName||''}
                            onChange={handleChange}
                            placeholder=""
                        />
                        {errors.firstName && <div className="error-message text-danger">{errors.firstName}</div>}
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingLastName" label={ <span> Last name <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={userInfo.lastName||''}
                            onChange={handleChange}
                            placeholder=""
                        />
                        {errors.lastName && <div className="error-message text-danger">{errors.lastName}</div>}
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingLastName" label="Preferred Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="preferred_name"
                            value={userInfo.preferred_name||''}
                            onChange={handleChange}
                            placeholder=""
                        />
                    </FloatingLabel>



                    <FloatingLabel controlId="floatingphoneNumber" label={<span> Phone Number <span className='required'>*</span> </span>} className="mb-3">
                        <PhoneInput
                            placeholder=""
                            defaultCountry="US"
                            country="US"
                            international
                            withCountryCallingCode
                            className="form-control"
                            value={userInfo.phoneNumber||''}
                            onChange={value => handleChange({ target: { name: 'phoneNumber', value } })}

                        />
                        {errors.phoneNumber && <div className="error-message text-danger">{errors.phoneNumber}</div>}
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingEmail" label={<span> Email <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="email"
                            value={userInfo.email||''}
                            onChange={handleChange}
                            placeholder=""
                        />
                        {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                    </FloatingLabel>


                    {currentEmail!==userInfo.email && <div className='verify_field mb-3'>
                        <FloatingLabel controlId="" label="Verify" className="">
                            <Form.Control
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder=""
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]"
                            />
                        </FloatingLabel>
                        {otp && <button type='button' className='btn submit_btn m-0'  onClick={handleUpdate}> Verify </button>}
                        {!otp && <button type='button' className='btn submit_btn m-0' onClick={sendOtp}> Send Code </button>}
                    </div>}


                    {userData.user_type === 'teenager'  &&

                        <>

                            <FloatLabel className="mb-3">
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

                            <div className='form-group mb-3 mt-3'>
                                <FloatingLabel controlId="floatingLocation" label={<span> Location <span className='required'>*</span> </span>}>
                                    <Autocomplete
                                        className="form-control"
                                        apiKey= {process.env.REACT_APP_LOCATION_API_KEY}
                                        onPlaceSelected={handlePlaceSelect}
                                        placeholder=""
                                        defaultValue={userInfo.location|| ''}
                                        options={{
                                            types: ['geocode'], // or 'address' if you need full address
                                            componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                                            fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                                            disableAutoPan: true
                                        }}
                                        onChange={handleAddr}
                                    />
                                    {errors.location && <div className="error-message text-danger">{errors.location}</div>}
                                </FloatingLabel>
                                <p className="phone_Text"> Eg.: 2972 Westheimer Rd. Santa Ana, Illinois 85486 </p>
                            </div>


                            <div className='form-group mb-3'>
                                <FloatingLabel controlId="floatingCity" label={<span> Street Address <span className='required'>*</span> </span>}>
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
                                <FloatingLabel controlId="floatingCity" label={<span> City <span className='required'>*</span> </span>}>
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
                                <FloatingLabel controlId="floatingState" label={<span> State <span className='required'>*</span> </span>}>
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
                                <FloatingLabel controlId="floatingZipCode" label={<span> Zip Code <span className='required'>*</span> </span>}>
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
                                    <Form.Select aria-label="Floating label select example" name='pronouns' value={userInfo.pronouns} onChange={handleChange} >
                                        <option value="">Select</option>
                                        <option value="He/Him/His">He/Him/His</option>
                                        <option value="She/Her/Hers">She/Her/Hers</option>
                                        <option value="Ze/Hir/Hirs">Ze/Hir/Hirs</option>
                                        <option value="They/Them/Theirs">They/Them/Theirs</option>
                                        <option value="Other/Prefer not to say"> Other/Prefer not to say </option>
                                    </Form.Select>
                                </FloatingLabel>
                                <p className="phone_Text"> Optional </p>
                            </div>

                        </>
                    }

                </div>

                <div className='setting_common_block personal_info_block pb-0'>
                    {userData.user_type === 'manager' && (
                        <div>
                            <h1 className='scb_heading'> Business info </h1>

                            <div className='form-group mb-3'>
                                <FloatingLabel controlId="floatingBusinessName" label={<span> Business name <span className='required'>*</span> </span>}>
                                    <Form.Control
                                        type="text"
                                        name="businessName"
                                        value={userInfo.businessName||''}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                </FloatingLabel>
                                {errors.businessName && <div className="error-message text-danger">{errors.businessName}</div>}
                            </div>

                            <div className='form-group mb-3'>
                                <FloatingLabel controlId="floatingLocation" label={<span> Location <span className='required'>*</span> </span>}>

                                    <Autocomplete
                                        className="form-control"
                                        apiKey= {process.env.REACT_APP_LOCATION_API_KEY}
                                        onPlaceSelected={handlePlaceSelect}
                                        defaultValue={userInfo.location|| ''}
                                        options={{
                                            types: ['geocode'], // or 'address' if you need full address
                                            componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                                            fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                                            disableAutoPan: true
                                        }}
                                    />
                                    {errors.location && <div className="error-message text-danger">{errors.location}</div>}
                                </FloatingLabel>
                                <p className="phone_Text"> Eg.: 2972 Westheimer Rd. Santa Ana, Illinois 85486 </p>
                            </div>

                            <div className='form-group mb-3'>
                                <FloatingLabel controlId="floatingCity" label={<span> Street Address <span className='required'>*</span> </span>}>
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
                                <FloatingLabel controlId="floatingCity" label={<span> City <span className='required'>*</span> </span>}>
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
                                <FloatingLabel controlId="floatingState" label={<span> State <span className='required'>*</span> </span>}>
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
                                <FloatingLabel controlId="floatingZipCode" label={<span> Zip Code <span className='required'>*</span> </span>}>
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

                            <div className='form-group mb-3'>
                                <FloatingLabel controlId="floatingEinNumber" label={<span> Employer Identification Number (EIN) <span className='required'>*</span> </span>}>
                                    <Form.Control
                                        type="text"
                                        name="einnumber"
                                        value={userInfo.einnumber||''}
                                        onChange={handleChange}
                                        placeholder=""
                                        maxLength="10"
                                    />
                                    {errors.einnumber && <div className="error-message text-danger">{errors.einnumber}</div>}
                                </FloatingLabel>
                            </div>

                            <div className='form-group mb-3'>
                                <FloatingLabel controlId="floatingEmployees" label={<span> Number of Employees <span className='required'>*</span> </span>} className='noe_select'>
                                    <Form.Select aria-label="Floating Default select example" name='number_of_employees' value={userInfo.number_of_employees||''} onChange={handleChange}>
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
                                <FloatingLabel controlId="floatingHearAbout" label={<span> How Did You Hear About Us? <span className='required'>*</span> </span>} className='noe_select'>
                                    <Form.Select aria-label="Floating Default select example" name='hear_about' value={userInfo.hear_about||''} onChange={handleChange}>
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

                            {userInfo.hear_about === "Other" &&
                                <div className='form-group mb-3'>
                                    <FloatingLabel controlId="floatingOther" label={<span> Other Source <span className='required'>*</span> </span>}>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            name='hear_about_other'
                                            value={userInfo.hear_about_other||''}
                                            onChange={handleChange}
                                            maxLength="100"
                                        />
                                        {errors.hear_about_other && <div className="error-message text-danger">{errors.hear_about_other}</div>}
                                    </FloatingLabel>
                                </div>
                            }


                             {/* ------ ------- */}
                            <label className='mb-2'> Documents </label>
                            {userData.business_document.map((file, index) => (
                               (file && file !== "undefined" && <div className='upload_file_name' key={'name_'+index}>
                                    <div className='ufn_left' >
                                        <div className='file_icon'> <img src={File} alt={`file_${index}`} /> </div>
                                        <span>{file}</span>
                                    </div>

                                    <FileDownloadLink file={file}  key={'file_'+index} />
                                </div>)
                            ))}
                        </div>
                    )}

                    <button type="button" className="btn submit_btn" onClick={handleUpdate}> Save </button>
                </div>
            </form>

            <div className='button_block setting_common_block pt-0'>
                <button type="button" className="btn black_common_btn" onClick={handleLogout}> Log out </button>
                {userData.user_type !=='subuser' && <button className="btn delete_account_btn" type='button' onClick={()=>{setShowAlert(true)}}> Delete account </button>}
            </div>
        </>
    );
}

export default MyData;
