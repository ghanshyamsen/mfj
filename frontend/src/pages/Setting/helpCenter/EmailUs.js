import React, { useState } from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left.svg';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function EmailUs({ onBackClick }) {

    const TOKEN = localStorage.getItem('token');

    const [formValues, setFormValues] = useState({
        subject: '',
        description: '',
    });

    const [errors, setErrors] = useState({
        subject: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (isValid) {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "subject": formValues.subject,
                "message": formValues.description
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/email-us`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setFormValues({
                        subject: '',
                        description: '',
                    })
                    setErrors({
                        subject: '',
                        description: '',
                    });
                    window.showToast(result.message,"success");
                }else{
                    window.showToast(result.message,"error");
                }

            })
            .catch((error) => console.error(error));

        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // Check if first name is empty
        if (!formValues.subject.trim()) {
            errors.subject = 'Subject is required';
            isValid = false;
        }

        // Check if last name is empty
        if (!formValues.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    }

    return (
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}>
                    <img src={BackArrow} alt="Go back" />
                </button>
                <h1 className="heading">Email Us</h1>
            </div>

            <div className="setting_common_block">
                <form onSubmit={handleSubmit}>
                    <FloatingLabel controlId="subject" label={<span> Subject <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="subject"
                            value={formValues.subject}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {errors.subject && <div className="error-message text-danger">{errors.subject}</div>}
                    </FloatingLabel>
                    <FloatingLabel controlId="description" label={<span> Description <span className='required'>*</span> </span>}>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                            maxLength="500"
                            placeholder=""
                        />
                        <p className="phone_Text"> {formValues.description.length}/500 </p>
                        {errors.description && <div className="error-message text-danger">{errors.description}</div>}
                    </FloatingLabel>
                    <button type="submit" className="btn submit_btn">Send</button>
                </form>
            </div>
        </>
    );
}



export default EmailUs;
