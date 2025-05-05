import React, { useState, useEffect } from 'react';
import Product2 from '../../assets/images/pro2.jfif'
import { Link } from 'react-router-dom';
import Coin from '../../assets/images/coin.png'
import { Skeleton } from 'primereact/skeleton';

function RewardOrders() {

    const TOKEN = localStorage.getItem('token');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    useEffect(() => {
        getOrders();
    },[]);

    const getOrders = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-orders`, requestOptions)
        .then((response) => response.json())
        .then((result) => setOrders(result.data))
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

    }

    return(
        <>
            <div className='reward_orders_page'>
                <div className='common_container'>
                    <div className='reward_order_block'>
                        <h1 className="rob_heading"> Reward Store Orders </h1>

                        {orders.length > 0 &&
                            orders.map((order) => (
                                <div className='reward_order_list' key={order.id}>
                                    <div className='rol_img'>
                                        <Link to={`/product-detail/${window.createSlug(order.title)}/${order.product_id}`} style={{textDecoration:'none'}}>
                                            <img src={order.image} alt="" />
                                        </Link>
                                    </div>

                                    <div className='rol_content_block'>
                                        <Link to={`/product-detail/${window.createSlug(order.title)}/${order.product_id}`} style={{textDecoration:'none'}}>
                                            <h4 className='rcb_title'> {order.title} </h4>
                                        </Link>
                                        <div className='rcb_middal_row'>
                                            <p className='category_text'> {order.category} </p>
                                            <p className=''> {order.created} <span className='ct_title'> Purchased Date & TIme </span> </p>
                                            {/* <p className=''> {order.user} <span className='ct_title'> Name </span> </p> */}
                                            <p className='credit_amount'> <span> <img src={Coin} alt="" /> {order.price} </span> <span className='ct_title'> Credit Spent </span> </p>
                                        </div>
                                        {/* <p className='bfc_text'> Buy for <img src={Coin} alt=""/> <span>{order.price}</span> </p> */}
                                    </div>
                                </div>
                            ))
                        }

                        {loadingSkeleton ?
                            <div className='reward_order_list'>
                                <Skeleton width="100%" height="126px" />
                            </div>
                        :
                         orders.length <= 0 && <div className="notext">No orders found!</div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
}

export default RewardOrders;