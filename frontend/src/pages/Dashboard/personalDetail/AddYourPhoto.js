import React, { useState, useEffect, useRef } from 'react';
import PlusWhite from '../../../assets/images/plus-white.png';
import camera from '../../../assets/images/camera.svg';
import deleteicon from '../../../assets/images/delete.svg';
import { useWizard } from "react-use-wizard";
import resumeHook from "../../../userStatusHook";
import { useProfile } from '../../../ProfileContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import CropImage from '../../CropImage/Index';

function AddYourPhoto({ GoBackStep, GoNextStep }) {
    const { setProfileImage  } = useProfile();
    const [imageLoading, setImageLoading] = useState(true);
    const [profileImages, setProfileImages] = useState('');
    const { previousStep, nextStep } = useWizard();
    const resumeData = resumeHook().data;
    const userData = JSON.parse(localStorage.getItem('userData'));

    const token= localStorage.getItem('token');
    const fileInputRef = useRef(null);
    const [imagest, setImageSt] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [croppingFile, setCroppingFile] = useState('');

    const handleSpanClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    useEffect(() => {
        if(userData){
            setProfileImages(userData.profile_image);
            setImageSt(userData?.image_upload);
            setTimeout(() => {
                setImageLoading(false);
            }, 200);
        }
    }, []);
    // userData,resumeData
    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {
        GoNextStep();
        nextStep();
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {

            const maxSize = 5 * 1024 * 1024; // 5MB limit

            if (file.size > maxSize) {
                window.showToast('File size exceeds 5MB', 'error');
                e.target.value = "";
                return
            }

            const fileType = await window.detectMimeType(file);
            if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
                window.showToast('Please select a valid file png, jpeg, jpg.','error');
                e.target.value = "";
                return false;
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

    const uploadCropImage = (url) => {

        setImageLoading(true);
        const formdata = new FormData();
        // Append the file to the form data
        formdata.append('image', url, 'cropped_image.png');

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
            .then(function(response){
                if(response.status === 'S'){
                    const profileImage = response.data.image;
                    uploadProfileImage(url);

                }else{
                    window.showToast(response.message, 'error')
                }
            })
            .catch((error) => window.showToast(error.message, 'error'));

        } catch(error) {
            window.showToast('Error uploading file:'+error.message, 'error')
        }
    }

    const uploadProfileImage = (file) => {
        if(file){

            try{

                // Create a FormData instance
                const formdata = new FormData();
                // Append the file to the form data
                formdata.append('profile_image', file, 'cropped_image.png');

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
                        setProfileImages(profileImage);
                        //setImageLoading(false);
                        const userData = JSON.parse(localStorage.getItem('userData'));
                        userData.profile_image = profileImage;
                        localStorage.setItem('userData', JSON.stringify(userData));

                        setImageSt(true)
                        setImageLoading(false)
                    }

                })
                .catch((error) => window.showToast(error.message, 'error'));

            } catch(error) {
                window.showToast('Error uploading file:'+error.message, 'error')
            }
        }
    }

    const handleDelete = () => {

        const fileInput = document.getElementById('fileInput');
        if (fileInput) { fileInput.value = ''; }
        setImageLoading(true);

        try{

            handleDeleteProfileImage();

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
            .then(function(response){

                if(response.status === 'S'){
                    const profileImage = response.data.image;
                    setProfileImages(profileImage);
                    setImageLoading(false);
                    window.showToast('Image deleted successfully.', 'success');
                    setImageSt(false);
                }

            })
            .catch((error) => window.showToast(error.message, 'error'));
        }catch(error){
            window.showToast(error.message, 'error')
        }

    }

    const handleDeleteProfileImage = () => {
        try{
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
                    //setImageLoading(false);
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    userData.profile_image = profileImage;
                    localStorage.setItem('userData', JSON.stringify(userData));
                }

            })
            .catch((error) => window.showToast(error, 'error'));

        }catch(error){
            window.showToast(error.message, 'error');
        }
    }

    /* crop image */
        const handleCropComplete = (croppedImage) => {

            setProfileImages(croppedImage.croppedImageUrl)

            uploadCropImage(croppedImage.blob);
        };

        const handleModalClose = () => {
            setShowModal(false);
        };

        const handleModalOpen = () => {
            setShowModal(true);
        };

    /*  */
    return (
        <div className=''>
            <div className='rim_content'>
                <h1 className='rim_heading'>Add Your Professional Photo</h1>
            </div>

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
                    {!imagest && <span className='plus_img' onClick={handleSpanClick}  style={{cursor:'pointer'}}> <img src={PlusWhite}  alt="User" /> </span>}

                    {imageLoading ? <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s" />
                    :
                        <>
                            <div className='w-100 h-100' style={{cursor:'pointer'}} onClick={handleSpanClick}>
                                <img src={profileImages} alt="User"  />
                            </div>
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
            </div>

            <div className='rim_content'>

                <p className='rim_text'>Your photo is one of the first things potential employers will notice. Make a great first impression by following these tips:</p>
                    <h3 className="ul_title"> What to Choose </h3>
                            <ul className="">
                                <li>Select a professional-looking photo—think of a clear headshot with a neutral background.</li>
                                <li>Wear what you would for a job interview in your chosen field.</li>
                            </ul>
                    <h3 className="ul_title"> Why It Matters </h3>
                    <p className='rim_text'>This photo will become part of your resume and profile, helping you stand out to employers. It should reflect the best version of yourself:</p>
                            <ul className="">
                                <li><b>Recent</b> – Ensure it’s up-to-date.</li>
                                <li><b>Friendly</b> – Show a warm, approachable expression.</li>
                                <li><b>Professional</b> – Keep it polished and appropriate for the workplace.</li>
                            </ul>
                    <p className='rim_text'>Ready to upload your photo? If not, you can always come back and do it later. </p>


            </div>

            <div className='btn_block'>
                <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
            </div>
        </div>
    );
}

export default AddYourPhoto;
