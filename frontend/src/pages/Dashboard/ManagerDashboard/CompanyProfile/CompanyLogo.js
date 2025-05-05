import React, { useState, useEffect, useRef } from 'react';
import { useWizard } from "react-use-wizard";
import user from '../../../../assets/images/user.jpg';
import camera from '../../../../assets/images/camera.svg';
import deleteicon from '../../../../assets/images/delete.svg';
import PlusWhite from '../../../../assets/images/plus-white.png';
import CropImage from '../../../CropImage/Index';

function CompanyLogo({ goDashboardPage, GoNextStep, formData, setFormData}) {

    const [logo, setLogo] = useState(user);
    const [imagest, setImageSt] = useState(false);
    const { previousStep, nextStep } = useWizard();
    const fileInputRef = useRef(null);
    const TOKEN = localStorage.getItem('token');

    const [showModal, setShowModal] = useState(false);
    const [croppingFile, setCroppingFile] = useState('');

    const handleFileChange__ = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
            setImageSt(true);
        }

        setFormData({...formData, ['company_logo']: file});
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

    useEffect(()=>{
        if(typeof formData.company_logo === 'string') {
            setLogo(formData.company_logo);
            setImageSt(formData?.image_company_upload);
        }else{

            if(typeof formData.company_logo === 'object') {
                const reader = new FileReader();
                reader.onload = () => {
                    setLogo(reader.result);
                    setImageSt(true);
                };
                reader.readAsDataURL(formData.company_logo);
            }
        }
    },[formData.company_logo])

    const handleDelete = () => {


        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-company-image`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                setFormData({
                    ...formData,
                    company_logo: result.image,
                    image_company_upload: false // Update form data with cropped image blob and filename
                });
                setImageSt(false);

                const fileInput = document.getElementById('fileInput');
                if (fileInput) { fileInput.value = ''; }
            }
        })
        .catch((error) => console.error(error));


    }

    const closeInfomastion = () => {
        goDashboardPage();
    }

    const handleClickNext = () => {
        GoNextStep();
        nextStep();
    }

    const handleSpanClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    /* crop image */
        const handleCropComplete = (croppedImage) => {
            if (!(croppedImage.blob instanceof Blob)) {
                console.error("Cropped image is not a Blob:", croppedImage.blob);
                return;
            }

            setLogo(croppedImage.croppedImageUrl); // Set the logo preview
            setFormData({
                ...formData,
                company_logo: croppedImage.blob // Update form data with cropped image blob and filename
            });
        };

        const handleModalClose = () => {
            setShowModal(false);
        };

        const handleModalOpen = () => {
            setShowModal(true);
        };
    /*  */

    return (
        <>
            <div className=''>
                <div className='rim_content'>
                    <h1 className='rim_heading'>Add Company Logo</h1>
                    <p className='rim_text'>Upload your company logo to make your job postings stand out and build trust with candidates. You can change or skip this step anytime.</p>
                </div>
                <div className='image_update_block'>
                    <div className='change_img icon_img'>
                        <input
                            id="fileInput"
                            type="file"
                            //style={{ display: 'none' }}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <div className='ciicon'>
                            <label htmlFor="fileInput">
                                <img src={camera} alt="Change" />
                            </label>
                        </div>
                        <p className='m-0'>Change</p>
                    </div>
                    <div className='change_user_img' style={{cursor:"pointer"}} onClick={handleSpanClick}>
                        {!imagest && <span className='plus_img'> <img src={PlusWhite} alt="User" /> </span>}
                        <img src={logo} alt="User" />
                    </div>
                    {showModal && (
                        <CropImage
                            imageSrc={croppingFile}
                            onCropComplete={handleCropComplete}
                            onClose={handleModalClose}
                            onShow={handleModalOpen}
                        />
                    )}
                    <div className='delete_img icon_img' onClick={handleDelete}>
                        <div className='ciicon'>
                            <img src={deleteicon} alt="Delete" />
                        </div>
                        <p className='m-0'>Delete</p>
                    </div>
                   
                </div>
                <p className="phone_Text"> Supported formats: PNG, JPEG (max size: 5MB). </p>
                <div className='btn_block'>
                    {/* <button type="button" className='btn submit_btn back-button' onClick={closeInfomastion}> Close </button> */}
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    );

}

export default CompanyLogo;