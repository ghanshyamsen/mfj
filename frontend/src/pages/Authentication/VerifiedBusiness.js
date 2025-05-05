import React, { useState, useRef  } from 'react';
import { useWizard } from "react-use-wizard";
import backArrow from '../../assets/images/fi_arrow-left.svg';
import File from '../../assets/images/file.svg';
import Dots from '../../assets/images/dots.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import Delete from '../../assets/images/delete.svg';

import { FileTypeParser } from 'file-type';
import Spinner from 'react-bootstrap/Spinner';


function VerifiedBusiness({ data, onUpdate, handleSubmitForm, submitBtn }) {
    const { previousStep } = useWizard();
    const [selectedFiles, setSelectedFiles] = useState((data?.files||[]));
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);


    const handleFileChange = async (event) => {
        const filesArray = Array.from(event.target.files);

        try {
            // Process each file asynchronously
            const validFilesPromises = filesArray.map(async (file) => {

                const type = await window.detectMimeType(file);

                if (type === "application/pdf" || type === "image/png" || type === "image/jpeg" || type === "image/jpg") {
                    return file; // Keep the valid file
                } else {
                    window.showToast('Invalid file type, please upload a pdf, png, jpg, or jpeg file.', 'error');
                    return null; // Return null for invalid file
                }
            });

            // Wait for all the file type checks to finish
            const validFiles = (await Promise.all(validFilesPromises)).filter(file => file !== null);

            // Check if there are valid files
            if (validFiles.length === 0) {
                throw new Error('No valid files to process.');
            }

            // Validate the number of selected files
            if (selectedFiles.length + validFiles.length <= 5) {
                setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
                setError(''); // Clear any previous errors
            } else {
                setError("You can't upload more than 5 files.");
            }
        } catch (error) {
            console.error(error.message);
            setError(error.message); // Handle the error by displaying it in the UI
        }
    };

    const handleUpload = async () => {
        if (selectedFiles && selectedFiles.length > 0) {
            onUpdate({...data, files: selectedFiles});
            //await new Promise(resolve => setTimeout(resolve, 1000)); // Ensure state update has completed
            handleSubmitForm();
        } else {
            setError('Please upload at least one document.');
        }
    };

    const handleRemoveImage = (file) => {
        const updatedFiles = selectedFiles.filter(image => image !== file)
        setSelectedFiles(updatedFiles);
        fileInputRef.current.value = updatedFiles;
    };

    return (
        <div className='auth_form_block'>
            <button type='button' className='back_btn' onClick={previousStep}>
                <img src={backArrow} alt="" />
            </button>
            <h1 className='heading'>Verify your business</h1>
            <p className='login_text'>
                Supporting Legal Documents: An IRS EIN letter, a business license, or a letter from the Secretary of State is required.
            </p>

            <div className='upload_img'>
                <span> + upload  <span className="phone_Text"> (Only: pdf, png, jpg)</span> </span>
                <input type="file" onChange={handleFileChange} multiple name='file[]' ref={fileInputRef} accept=".pdf,.png,.jpeg,.jpg" />
            </div>


            <div className='upload_file_blocks'>
                {selectedFiles && selectedFiles.map((file, index) => (
                    <div className='upload_file_name' key={index}>
                        <div className='ufn_left'>
                            <div className='file_icon'> <img src={File} alt="" /> </div>
                            <span>{file.name}</span>
                        </div>
                        <div className='ufn_right'>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                    <img src={Dots} alt="" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleRemoveImage(file)}> <img src={Delete} alt="" /> Delete </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className='uf_dropdowns'>  </div>
                        </div>
                    </div>
                ))}
            </div>

            {error && <p className="error-message text-danger">{error}</p>}

            <button type='button' className='btn submit_btn' onClick={handleUpload} ref={submitBtn}>
                Continue
                <Spinner animation="border" role="status" variant="dark" style={{display:'none'}}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </button>
        </div>
    );
}

export default VerifiedBusiness;
