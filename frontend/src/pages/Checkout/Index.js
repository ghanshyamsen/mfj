import React, {useEffect, useState, useCallback} from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import backArrow from '../../assets/images/fi_arrow-left.svg';
import CheckoutIcon from '../../assets/images/secure.png';
import Spinner from 'react-bootstrap/Spinner';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Checkout(){

    const {key:Id} = useParams();

    const [skKey, setSkKey] = useState('');
    const TOKEN = localStorage.getItem('token');
    const User = JSON.parse(localStorage.getItem('userData'));
    const geturl = new URL(window.location.href).searchParams;
    const Type = geturl.get('type');
    const job_paid = geturl.get('job_paid');
    const job_boost = geturl.get('job_boost');
    const navigate = useNavigate();

    useEffect(() => {
        getCheckOut();
    },[]);

    const getCheckOut = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/create-payment/${Id}?type=${Type?Type:''}&job_paid=${job_paid}&job_boost=${job_boost}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                if(result.key){
                    setSkKey(result.key);
                }
                if(result.subscribed){
                    localStorage.setItem('userData', JSON.stringify(result.data));
                    window.showToast(result.message,'success');
                    navigate('/subscription')
                }
            }else{
                window.showToast(result.message,'error');
                handleBack();
            }
        })
        .catch((error) => console.error(error.message));
    }

    const options = {
        // passing the client secret obtained from the server
        clientSecret: skKey,
    };

    const handleBack = () => {
        if(Type === 'job'){
            window.showToast('Your payment was cancelled.','error');
            navigate('/jobs')
        }else{
            window.history.back();
        }
    };


    return (
        <>
            {skKey && <div id="checkout" className={`checkout-frame ${User.user_type === 'teenager'?'student':'parents'}`}>
                <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
                >
                <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>}

           {!skKey && <div className='subscription_page d-flex h-full align-items-center justify-content-center' style={{height: 'calc(100vh - 70px)'}}>
                <div className='subscription_card_block' style={{width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <div className='checkout_icon'> <img src={CheckoutIcon} alt="" />  </div>
                    <div className='d-flex align-items-center justify-content-center'>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <span className='textcheck ms-2'>Please wait while we are processing your request...</span>
                    </div>
                </div>
            </div>}
        </>
    );

}



export default Checkout;