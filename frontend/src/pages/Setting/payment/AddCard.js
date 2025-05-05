import React, {useState} from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left-gray.svg';
import cards from '../../../assets/images/cards.svg';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function AddCard({onBackClick, setPayMethod}) {

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        card_number: "",
        expiry_date: "",
        cvv: ""
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
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
            "payment_method": "card",
            "card_info": {
                "name" : "",
                "type" : "visa",
                "number": formData.card_number,
                "expiry": formData.expiry_date,
                "cvv": formData.cvv
            },
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
        if (!data.card_number.trim()) {
          errors.card_number = 'Card number is required';
        }else{
            let isnum = /^\d+$/.test(data.card_number);

            if(data.card_number.length < 15 || data.card_number.length > 16 || !isnum){
                errors.card_number = 'Invalid card number.';
            }
        }

        if (!data.expiry_date.trim()) {
            errors.expiry_date = 'Expiry date is required';
        }else{
            const pattern = /^(0[1-9]|1[0-2])\/([0-9]{4})$/;
            if(!pattern.test(data.expiry_date)){
                errors.expiry_date = 'Invalid expiry date format use MM/YYYY.';
            }
        }

        if (!data.cvv.trim()) {
            errors.cvv = 'Cvv is required';
        }else{
            let isnum = /^\d+$/.test(data.cvv);
            if(!isnum){
                errors.cvv = 'Invalid cvv number.';
            }
        }

        // You can add more validation logic here
        return errors;
    };

    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}>
                    <img src={BackArrow} alt="" />
                </button>
                <h1 className="heading"> Card </h1>
            </div>

            <div className='setting_common_block add_payment_block'>
                <h1 className='scb_heading'> Add Card </h1>
                <p className='scb_description'> We will store and use card details for smooth and secure future purchases </p>

                <FloatingLabel controlId="card_number" label={<span> Card Number <span className='required'>*</span> </span>} className="mb-3" >
                    <Form.Control type="text" name="card_number" onChange={handleChange}  value={formData.card_number||''} maxlength="16" minlength="15" placeholder=""/>
                    {errors.card_number && <div className="error" style={{ color: "red", fontSize: "12px" }}>{errors.card_number}</div>}
                </FloatingLabel>

                <Row>
                    <Col>
                        <FloatingLabel controlId="expiry_date" label={<span> Expiration date <span className='required'>*</span> </span>} className="mb-3" >
                            <Form.Control type="text" name="expiry_date" onChange={handleChange} value={formData.expiry_date||''} placeholder=""/>
                            {errors.expiry_date && <div className="error" style={{ color: "red", fontSize: "12px" }}>{errors.expiry_date}</div>}
                            <p className="phone_Text"> (MM/YYYY) </p>
                        </FloatingLabel>
                    </Col>

                    <Col>
                        <FloatingLabel controlId="cvv" label={<span> CVV <span className='required'>*</span> </span>} className="mb-3" >
                            <Form.Control type="text" name="cvv" value={formData.cvv||''} onChange={handleChange} maxlength="4" minlength="3" placeholder=""/>
                            {errors.cvv && <div className="error" style={{ color: "red", fontSize: "12px" }}>{errors.cvv}</div>}
                        </FloatingLabel>
                    </Col>
                </Row>

                <div className='all_types_card mb-3'>
                    <img src={cards} alt="" />
                </div>

                <button type='button' className='btn submit_btn' onClick={handleSubmit} > Save </button>
            </div>

        </>
    );
}

export default AddCard;


