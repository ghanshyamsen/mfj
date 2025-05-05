import React, {useState, useEffect} from 'react';
import u_credit_card from '../../assets/images/u_credit-card.svg';
import paypal from '../../assets/images/paypal.svg';
import mastercard from '../../assets/images/mastercard.svg';
import PaypalIcon from '../../assets/images/PaypalIcon.svg';
import u_angle_rightcolor from '../../assets/images/u_angle_rightcolor.svg';
import plus from '../../assets/images/plus.svg';
import BackArrow from '../../assets/images/fi_arrow-left-gray.svg';

import EditPayPal from './payment/EditPayPal';
import AddPayPal from './payment/AddPayPal';
import EditCard from './payment/EditCard';
import AddCard from './payment/AddCard';


function Payments() {

    const [activePayment, setActivePayment] = useState('MyData');
    const [isWizardBlockVisible, setIsWizardBlockVisible] = useState(true);
    const [isPaymentMethod, setIsPaymentMethod] = useState(true);
    const [MethodList, setMethodList] = useState([]);
    const [MethodData, setMethodData] = useState({});
    const token = localStorage.getItem('token');


    const fetchMethods = () => {

        fetch(`${process.env.REACT_APP_API_URL}/app/get-payment`,{
            headers:{
                "Authorization": "Bearer " + token
            }
        })
        .then(response => response.json())
        .then((response) =>{
            if(response.status === 'success'){
                setMethodList(response.data);
            }else{
                window.showToast(response.message,'error')
            }
        }).catch((error) => window.showToast(error.message,'error'));

    }


    useEffect(()=>{
        fetchMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[activePayment]);

    const handleSetPayment = (value,data) => {
        setActivePayment(value);
        setIsWizardBlockVisible(false);
        setMethodData(data);
    }

    const handleBackClick = () => {
        setIsWizardBlockVisible(true);
        setActivePayment('MyData');
    }

    const showPaymentMethod = () => {
        setIsPaymentMethod(false);
    }

    return(
        <>
            {isWizardBlockVisible && (
                <div className='wizard_block'>
                    <div className="heading_block wizard_conponent">
                        {!isPaymentMethod && (
                            <button type="button" className="back_btn" onClick={()=>{setIsPaymentMethod(true)}}>
                                <img src={BackArrow} alt="" />
                            </button>
                        )}
                        <h1 className="heading"> Payments </h1>
                    </div>
                    <div className='setting_common_block payment_block'>

                        {isPaymentMethod && (
                            <div className='card_list'>
                                <ul className="">
                                    {MethodList.map((method) =>(
                                        (
                                            method.payment_method==="card"?
                                            <li>
                                                <a onClick={() => handleSetPayment('EditCard',method)}>
                                                    <div className='card-img'>
                                                        <img src={mastercard} alt="" />
                                                    </div>
                                                    <div className='card_info'>
                                                        <p className='card_type'> {window.ucfirst(method.card_info.type)} </p>
                                                        <p className='card_de'> •••• {method.card_info.last_four_digit}</p>
                                                    </div>
                                                    {method.default_status === true && <span className='defualt_text'> Default </span>}
                                                    <div className='arrow_img'> <img src={u_angle_rightcolor} alt="" /> </div>
                                                </a>
                                            </li>:
                                            <li>
                                                <a onClick={() => handleSetPayment('EditPayPal',method)}>
                                                    <div className='card-img'><img src={PaypalIcon} alt="" /> </div>
                                                    <div className='card_info'>
                                                        <p className='card_type'> PayPal </p>
                                                        <p className='card_de'>{method.paypal_info}</p>
                                                    </div>
                                                    {method.default_status === true && <span className='defualt_text'> Default </span>}
                                                    <div className='arrow_img'> <img src={u_angle_rightcolor} alt="" /> </div>
                                                </a>
                                            </li>
                                        )
                                    ))}
                                </ul>

                                <div className='addCard_btn' onClick={showPaymentMethod}>
                                    <div className='plus_icon'> <img src={plus} alt="" /> </div>
                                    <span>Add payment method </span>
                                </div>
                            </div>
                        )}

                        {!isPaymentMethod && (
                            <div>
                                <h1 className='scb_heading'> Add a new payment method </h1>
                                <button type="button" className="btn black_common_btn"  onClick={() => handleSetPayment('AddCard')}> <img src={u_credit_card} alt="" /> Credit, debit or prepaid card </button>
                                <button type="button" className="btn black_common_btn"  onClick={() => handleSetPayment('AddPayPal')}> <img src={paypal} alt="" /> PayPal </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <div className='wizard_conponent'>
                {activePayment === 'EditPayPal' && <EditPayPal onBackClick={handleBackClick} data={MethodData}/>}
                {activePayment === 'AddPayPal' && <AddPayPal onBackClick={handleBackClick} setPayMethod={setIsPaymentMethod} />}
                {activePayment === 'EditCard' && <EditCard onBackClick={handleBackClick} data={MethodData} />}
                {activePayment === 'AddCard' && <AddCard onBackClick={handleBackClick} setPayMethod={setIsPaymentMethod} />}
            </div>
        </>
    );
}

export default Payments;

