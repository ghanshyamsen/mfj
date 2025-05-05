import React, {useEffect, useState} from "react";
import { Skeleton } from 'primereact/skeleton';

import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';


const Subscription = () => {

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [plans, setPlans] = useState('')
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));
    const [showAlert, setShowAlert] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(User?.plan_id?._id);

    const TOKEN = localStorage.getItem('token');

    useEffect(() => {
        getPlans();
    },[])


    const getPlans = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-plans?keys=free_plan,pro_plan,premium_plan,enterprise_plan`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPlans(result.data);
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));

    }

    const cancelSubscription = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/cancel-subscription`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setShowAlert(false)
                localStorage.setItem('userData', JSON.stringify(result.data));
                setUser(result.data);
                window.showToast(result.message,'success');
                window.location.reload();
            }
        })
        .catch((error) => console.error(error.message));
    }

    const isSubscribed = window.isSubscribed();

    return(
        <>
            <SweetAlert
                show={showAlert}
                //warning
                showCancel
                confirmBtnText="Yes, Cancel it!"
                confirmBtnBsStyle="danger"
                title="Cancel Subscription?"
                onConfirm={cancelSubscription}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                Are you sure you want to cancel your subscription.
            </SweetAlert>

            <div className="subscription_page">
                <div className="subscription_card_block">
                    {loadingSkeleton ? <Skeleton width="250px" height='30px' className="m-auto mb-5" /> : <h1 className="sub_heading"> Pick your plan, choose your best </h1> }
                    {loadingSkeleton ? <Skeleton width="290px" height='24px' className="m-auto mb-5" /> : <p className="sub_desc"> Plan give you access to My First Job accessibility  </p> }

                    <div className="plan_card_block">

                        {
                            loadingSkeleton ?(

                                [1,2,3,4].map((value) => (
                                    <div className="plan_card_outer" key={value}>
                                        <div className="plan_card_inner">
                                            <Skeleton width="100%" height='124px' className="mb-3"  />
                                            <Skeleton width="100%" height='17px' className="mb-3" />
                                            <Skeleton width="100%" height='54px' className="mb-3" />
                                            <Skeleton width="100%" height='44px' className="mb-3" />
                                            <Skeleton width="100%" height='56px' className="mt-4 mb-4" borderRadius="50px" />
                                            <ul className="skel_animtion">
                                                <li> <Skeleton width="100%" height='18px' className="mb-1" /> </li>
                                                <li> <Skeleton width="100%" height='18px' className="mb-1" /> </li>
                                                <li> <Skeleton width="100%" height='18px' className="mb-1" /> </li>
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ):(
                                plans?.map((value, index) => (
                                    <div className="plan_card_outer" key={value._id}>
                                        <div className="plan_card_inner">
                                            <div className="plan_name"> {value.plan_name} </div>
                                            <h2 className="plan_title"> {value.plan_title} </h2>
                                            <p className="plan_desc"> {value.plan_price_text} </p>
                                            {value.plan_price > 0 &&<p className="plan_amount"> <span>${value.plan_price}</span>/Per Month </p>}
                                            {value.plan_price <= 0 &&<p className="plan_amount">   <span>Free</span> </p>}
                                            {(!User.subscription_status || currentPlan !== value._id) && <div className="plan_btn">
                                                <Link to={`/checkout/${value._id}?type=subscription`}  className='btn submit_btn'>Get started</Link>
                                            </div>}
                                            {(User.subscription_status && currentPlan === value._id) && <div className="plan_btn">
                                                <button  className='btn submit_btn current_btn'>Current</button>
                                            </div>}
                                            <div className='m-content' dangerouslySetInnerHTML={{ __html: (value.plan_description||'') }}></div>

                                            {(User.subscription_status && currentPlan === value._id) && <p className="currentPlan_txt plan_amount" onClick={() => setShowAlert(true)}><span>Cancel Plan</span></p>}

                                            {(!User.subscription_status && isSubscribed && currentPlan === value._id) &&
                                                <>
                                                    <span className="currentPlan_txt text-center">Cancelled</span>
                                                    <p className="plan_desc text-center">End Date: {window.formatmdyDate(User.subscription_next_payment_date)}</p>
                                                </>
                                            }
                                            {(value.plan_key!=='free_plan' && User.subscription_status && currentPlan === value._id) && <p className="plan_desc text-center">Next Charge Date: {window.formatmdyDate(User.subscription_next_payment_date)}</p>}
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>

                </div>
            </div>
        </>
    )


}

export default Subscription;