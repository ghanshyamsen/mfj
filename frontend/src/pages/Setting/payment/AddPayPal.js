import React, {useState} from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left-gray.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


function AddPayPal({onBackClick , setPayMethod}) {

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        paypal_email: ""
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        // Validate the form data
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }else{
            setErrors(validationErrors);
        }

        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "payment_method": "paypal",
            "paypal_info": formData.paypal_email,
            "default_status": "false"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/add-payment`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message,'success');
                onBackClick();
                setPayMethod(true);
            }else{
                window.showToast(result.message,'error');
            }
        })
        .catch((error) => console.error(error));
    }


    const validateForm = (data) => {


        const errors = {};
        // Example: Required validation
        if (!data.paypal_email.trim()) {
          errors.paypal_email = 'Paypal email is required';
        }else{
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(data.paypal_email)) {
                errors.paypal_email ='Please enter a valid email address.';
            }
        }

        // You can add more validation logic here
        return errors;
    };

    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}><img src={BackArrow} alt="" /></button>
                <h1 className="heading"> PayPal </h1>
            </div>

            <div className='setting_common_block add_payment_block'>
                <h1 className='scb_heading'> Add PayPal </h1>
                <p className='scb_description'> We will store and use card details for smooth and secure future purchases </p>

                <FloatingLabel controlId="floatingEmail" label={<span> PayPal <span className='required'>*</span> </span>} className="mb-3" >
                    <Form.Control type="text" name="paypal_email" onChange={handleChange} placeholder=""/>
                    {errors.paypal_email && <div className="error" style={{ color: "red" }}>{errors.paypal_email}</div>}
                </FloatingLabel>

                <button type='button' className='btn submit_btn'  onClick={handleSubmit} > Save </button>
            </div>


        </>
    );
}

export default AddPayPal;


