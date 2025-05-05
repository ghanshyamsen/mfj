import React, {useEffect, useState} from 'react';


import { useNavigate } from 'react-router-dom'

import CheckoutIcon from '../../assets/images/secure.png';
import Spinner from 'react-bootstrap/Spinner';

export default function Response() {

    const [status, setStatus] = useState(null);
    const TOKEN = localStorage.getItem('token');
    const navigate = useNavigate();
    const User = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');
        const Type = urlParams.get('type');

        getRespose(sessionId, Type);
    },[])


    const getRespose = (id, Type) => {


        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/payment-response/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {

            localStorage.removeItem('refJob');

            if(result.status){

                window.showToast(result.message,'success');

                if(User.user_type!== 'subuser' && result.data){
                    localStorage.setItem('userData', JSON.stringify(result.data));
                }

                if(result.type === 'job'){
                    navigate('/jobs')
                }else if(result.type === 'subscription'){
                    navigate('/subscription')
                }else{
                    navigate('/wallet')
                }

            }else{
                window.showToast(result.message,'error');
            }

        })
        .catch((error) => console.error(error.message));
    }

    return (
        <section id="success">
            <div className='subscription_page d-flex h-full align-items-center justify-content-center' style={{height: 'calc(100vh - 70px)'}}>
                <div className='subscription_card_block' style={{width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <div className='checkout_icon'> <img src={CheckoutIcon} alt="" />  </div>
                    <div className='d-flex align-items-center justify-content-center'>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <span className='textcheck ms-2'>Your checkout is complete, we are processing now...</span>
                    </div>
                </div>
            </div>
        </section>
    )
}