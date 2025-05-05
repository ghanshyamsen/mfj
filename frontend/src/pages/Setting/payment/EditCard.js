import React, {useState} from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left-gray.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const CustomCheckbox = ({ label, checked, onChange }) => {
    return (
        <label className="custom-checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="checkmark"></span>
            {label}
        </label>
    );
};

function EditCard({onBackClick, data}) {

    const [isChecked, setIsChecked] = useState(data.default_status);
    const [formData ] = useState({
        card_number: data.card_info.number,
        expiry_date: data.card_info.expiry,
        cvv: data.card_info.cvv
    });

    const handleChange = (event) => {
        //setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);

        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "default_status": e.target.checked
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-payment/${data.id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message,'success');
            }else{
                window.showToast(result.message,'error');
            }
        })
        .catch((error) => console.error(error));
    };

    const handleDelete = (e) => {

        const token = localStorage.getItem('token');

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-payment/${data.id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message,'success');
                onBackClick();
            }else{
                window.showToast(result.message,'error');
            }
        })
        .catch((error) => console.error(error));
    }

    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}><img src={BackArrow} alt="" /></button>
                <h1 className="heading"> Card </h1>
            </div>

            <div className='setting_common_block edit_payment_block'>

                <FloatingLabel controlId="card_number" label="Card Number" className="mb-3" >
                    <Form.Control type="text" name="card_number" onChange={handleChange}  value={formData.card_number||''} placeholder=""/>
                </FloatingLabel>

                <Row>
                    <Col>
                        <FloatingLabel controlId="expiry_date" label="Expiration date" className="mb-3" >
                            <Form.Control type="text" name="expiry_date" onChange={handleChange} value={formData.expiry_date||''} placeholder=""/>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="cvv" label="CVV" className="mb-3" >
                            <Form.Control type="text" name="cvv" value={formData.cvv||''} onChange={handleChange} placeholder=""/>
                        </FloatingLabel>
                    </Col>
                </Row>

                <div className='custom_check_box'>
                    <CustomCheckbox
                        label="Set as default"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                </div>

                <button type='button' className='btn submit_btn' onClick={handleDelete}> Remove payment method </button>
            </div>


        </>
    );
}

export default EditCard;


