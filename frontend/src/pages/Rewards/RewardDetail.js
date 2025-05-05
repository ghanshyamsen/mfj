import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate} from 'react-router-dom';

import Coin from '../../assets/images/coin.png'
import RewardSlider from './RewardSlider'
import Cash from '../../assets/images/3d-cash-money.png';
import BackkkArrow from '../../assets/images/backkkArrow.png'

import { Skeleton } from 'primereact/skeleton';
import Modal from 'react-bootstrap/Modal';

import { useProfile } from '../../ProfileContext';

function RewardDetail() {

    const {theme} = useProfile();
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const {key:Id} = useParams();
    const history = useNavigate();

    const TOKEN = localStorage.getItem('token');
    const User = JSON.parse(localStorage.getItem('userData'));

    const [show, setShow] = useState(false);
    const [credit, setCredit] = useState(User?.user_credit);
    const [product, setProduct] = useState({});
    const [recommended, setRecommended] = useState([]);


    const goToBack = () => window.history.back();


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getProduct();
    },[Id])


    const getProduct = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-products/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setProduct(result.data);
                setRecommended(result.recommended);
            }else{
                window.showToast(result.message,'error');
                history('/products')
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }


    const purchaseModules = (event) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": "product",
            "id": Id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/purchase-module`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setCredit(result.credit);
                window.showToast(result.message,'success');
                handleClose();
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));


    }


    return (
        <>

            <div className='reward_section'>
                <div className='common_container'>
                    <div className='reword_heading_block'>
                        <div className='reword_heading'>
                            <Link to="" onClick={goToBack} className='back_button'> <img src={BackkkArrow} alt="" /> </Link>

                            {/* <h1 className='rh_title'> Rewards </h1>
                            <div className='reword_img'> <img src={Gift} alt="" /> </div> */}
                        </div>
                        <div className='reword_balance_block'>
                            <div className='bb_left'>
                                <div className='bbl_img'> <img src={Cash} alt="" /> </div>
                                <p className='m-0'> Available Balance </p>
                            </div>
                            <div className='bb_right'>
                                <img src={Coin} alt="" />
                                <span className=''> {credit.toLocaleString('en')||0} </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  */}

                <div className='common_container'>
                    <div className="reward_select_block">
                        {loadingSkeleton ?
                            <div className="reward_item_img">  <Skeleton width="100%" height="315px" /> </div>
                        :
                            <div className="reward_item_img">
                                <img src={product.image} alt="" />
                            </div>
                        }
                        {/*  */}
                        {loadingSkeleton ?
                            <div className="reward_content_block">
                                <h1 className="rc_title">  <Skeleton width="100%" height="40px" /> </h1>
                                <Skeleton width="100%" height="30px" />
                                <div className="btn_row">
                                    <p className="amount"> <Skeleton width="100%" height="30px" /> </p>
                                     <Skeleton width="100%" height="44px" />
                                </div>
                                <div className="rctext">
                                    <h3>Product Information:</h3>
                                    <Skeleton width="100%" height="20px" className="mb-1" />
                                    <Skeleton width="100%" height="20px" className="mb-1" />
                                </div>
                            </div>
                        :
                        <div className="reward_content_block">
                            <h1 className="rc_title"> {product.title} </h1>
                            <p className="category_text"> {product?.category?.title} </p>
                            <div className="btn_row">
                                <p className="amount"> <span> <img src={Coin} alt="" /> </span> {product.price} </p>
                                <button className="btn buy_btn" type="button" onClick={handleShow}> Buy Now </button>
                            </div>
                            <div className="rctext">
                                <h3>Product Information:</h3>
                                <div dangerouslySetInnerHTML={{ __html: product?.description?window?.convertUrlsToLinks(product?.description):'' }}></div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
                {/*  */}

                {recommended.length > 0 && <div className='Recommended_block'>
                    <div className='common_container'>
                        <h1 className='rb_heading'> Other Recommended Products </h1>
                        <RewardSlider recommended={recommended} />
                    </div>
                </div>}

            </div>


            {/*  */}

            <Modal className={`assign_modal_code ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title> Buy {product.title} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='buy_block'>

                        <div className="product_info">
                            <div className="pi_row">
                                <div className="product_img"> <img src={product.image} alt="" /> </div>
                                <div className="p_info_row">
                                    <p className="pname"> {product.title} </p>
                                    <p className="p_category"> {product?.category?.title} </p>
                                </div>
                            </div>
                            <p className="p_amount"> <span><img src={Coin} alt="" /></span> {product.price} </p>
                        </div>

                        <div className='balance_block'>
                            <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                            <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {credit.toLocaleString('en')||0} </span> </div>
                        </div>


                        {product?.price > credit &&
                            <>
                                <div className='credits_amount'>
                                    <label> Credits Required </label>
                                    <div className='ca_cash'> <img src={Coin} alt=""/> <span> {product?.price - credit} </span> </div>
                                </div>

                                <div className='add_credits_block'>
                                    <p className='mb-0'> Your Available Balance is low, please add credits </p>
                                    <Link to="/packages" className='btn add_credit_btn' type='button'> Add Credits </Link>
                                </div>
                            </>
                        }

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn back-button' onClick={handleClose}> Cancel </button>
                            {product?.price < credit && <button type="button" className='btn submit_btn' onClick={purchaseModules}> Submit </button>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}


export default RewardDetail;