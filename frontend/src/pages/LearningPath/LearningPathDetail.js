import React, { useEffect, useState } from 'react';
import Footer from './lFooter'
import CategoriesList from './CategoriesList'
import { Link, useParams } from "react-router-dom";
import MedalImg from '../../assets/images/medal_img.png'
import ArrowOrenge from '../../assets/images/arroworenge.png'
import SimpleArrow from '../../assets/images/simple-line-icons_right.png'
import Medalimg from '../../assets/images/medalimg2.png'
import LearningPathSlider from './LearningPathSlider'
import BackkkArrow from '../../assets/images/backkkArrow.png'
import Modal from 'react-bootstrap/Modal';
import Coin from '../../assets/images/coin.png';
import Cash from '../../assets/images/3d-cash-money.png';
import { Skeleton } from 'primereact/skeleton';
import { useProfile } from '../../ProfileContext';
import { Rating } from 'primereact/rating';

import Review from './review'
function LearningPathDetail() {
    const {theme} = useProfile();
    const { key:Id } = useParams();
    const TOKEN = localStorage.getItem('token');
    const [path, setPath] = useState({});
    const [otherpath, setOtherPath] = useState([]);
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [purchased,  setPurchased] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getPath();
        checkPurchased();
        getReviews();
    },[Id])

    const getPath = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-path/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPath(result.data);
            }else{
                goToBack()
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-path?limit=10`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                setOtherPath(result.data?.filter(path => path.id !== Id));
            }else{
                goToBack()
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const checkPurchased = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/check-purchased/path/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPurchased(result.purchased)
            }
        })
        .catch((error) => console.error(error.message));
    }

    const getReviews = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/lms-reviews?path=${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                setReviews(result.data);

            }
        })
        .catch((error) => console.error(error.message));
    }


    const goToBack = () => window.history.back();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const purchaseModules = (event) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": "learning_path",
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
                localStorage.setItem('userData', JSON.stringify(result.data));
                setUser(result.data);
                handleClose();
                window.showToast(result.message,'success');
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));


    }

    return (
        <>

            <CategoriesList />

            <div className='learningPath_detail_page'>
                <div className='common_container'>

                    <Link to="" onClick={goToBack} className='back_button'> <img src={BackkkArrow} alt="" /> </Link>

                    <div className='pld_section'>
                        <div className='pld_banner_block' style={{background:`url(${process.env.REACT_APP_MEDIA_URL}lms/path/${path.thumbnail}) center / cover no-repeat`}}>
                            <div className='banner_content_block'>
                                <h2 className='bheading'> {path.title} </h2>
                                { loadingSkeleton ?
                                    <Skeleton  width="200px" height='30px' className='mb-2 ms-auto me-auto' />
                                :
                                <>
                                    {!purchased && <p className='bsubtitle'> Buy for <img src={Coin} alt=""/> <b>{path.credit_price}</b> </p>}
                                </>
                                }
                                <div className='banner_btn_block'>
                                    { loadingSkeleton ?
                                        <Skeleton  width="200px" height='50px' className='ms-auto me-auto' />
                                    :
                                    <>
                                        {!purchased && <button type="button" className='btn buy-btn' onClick={handleShow}> Buy Now </button>}
                                        {purchased && <Link to="/my-learning" className='btn buy-btn'> Go to My Learning</Link>}
                                        {path.video_link && <Link to={path.video_link} target="_blank" className='btn watch-btn'> Watch Video </Link>}
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        <div className='pld_body_block'>
                            <div className='pldb_top_block'>
                                { loadingSkeleton ?
                                    <Skeleton  width="160px" height='36px' />
                                :
                                    <div className='badge_text'> {path.title} </div>
                                }
                                <div className='badge_block'>
                                    <div className='badge_icon'>
                                        { loadingSkeleton ?
                                            <Skeleton  width="100%" height='100%' shape="circle" />
                                        :
                                            <img src={`${process.env.REACT_APP_MEDIA_URL}lms/path/${path.badge}`} alt="" />
                                        }
                                    </div>
                                    <div className='badge_content'>
                                        <h3 className='badge_title'> Leadership Badge </h3>
                                        <p className='badge_desc'> You will earn this badge after successfully accomplishing all the Skills from the Leadership Path. </p>
                                    </div>
                                </div>
                            </div>
                            {/*  */}
                            <div className='pldb_content_block'>
                                <div className='heading_row'>
                                    <h1 className='content_title'> About this Path </h1>
                                </div>
                                <div className='pldb_text' dangerouslySetInnerHTML={path.long_description ? { __html: path.long_description } : undefined}></div>
                                {/* <h5 className='learn_title'> What you'll learn </h5>
                                <ul className=''>
                                    <li>Objects</li>
                                    <li>Learn 1</li>
                                    <li>Learn 2</li>
                                    <li>Classes</li>
                                    <li>Learn 3</li>
                                    <li>Learn 4</li>
                                </ul> */}

                                <div className='skills_list_block'>
                                    {
                                        path.skills?.map((value, index) => (
                                            <div className='skill_list' key={value._id}>
                                                <Link to={`/skill-detail/${value._id}`} className='list_item'>
                                                    <div className='list_left_block'>
                                                        <div className='skill_icon'> <img src={ArrowOrenge} alt=""/> </div>
                                                        <div className='skill_content'>
                                                            <h3 className='skill_name'> {value.title} </h3>
                                                            <p className='sbuy'> Buy for <img src={Coin} alt=""/> <span> {value.credit_price} </span> </p>
                                                        </div>
                                                    </div>
                                                    <div className='list_right_block'>
                                                        <div className='sbadge_icon'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${value.skill_badge}`} alt="" /> </div>
                                                        <div className='cnext_arrow'> <img src={SimpleArrow} alt="" /> </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    }

                                </div>


                            </div>
                            {/*  */}
                        </div>
                        {/*  */}
                    </div>
                    {/* pld_section */}
                </div>

                {otherpath.length > 0 && <div className='Recommended_block'>
                    <div className='common_container'>
                        <h1 className='rb_heading'> Other Recommended Learning Paths </h1>
                        <LearningPathSlider otherpath={otherpath} />
                    </div>
                </div>}
            </div>

            {reviews.length > 0 && <div className='review_section'>
                <div className='common_container'>
                    <h1 className='review_heading'> Reviews </h1>
                    <Review reviews={reviews} />
                </div>
            </div>}


             <Footer />

            <Modal className={`assign_modal_code ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{path.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='buy_block'>
                        <div className='credits_amount'>
                            <label> Credits Required </label>
                            <div className='ca_cash'> <img src={Coin} alt=""/> <span> {path.credit_price} </span> </div>
                        </div>

                        <div className='balance_block'>
                            <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                            <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {User.user_credit?.toLocaleString('en')} </span> </div>
                        </div>

                        {path.credit_price > User.user_credit &&  <div className='add_credits_block'>
                            <p className='mb-0'> Your Available Balance is low, please add credits </p>
                            <Link className='btn add_credit_btn' to='/packages'> Add Credits </Link>
                        </div>}

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn back-button' onClick={handleClose}> Cancel </button>
                            <button type="button" className='btn submit_btn' onClick={purchaseModules}> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}


export default LearningPathDetail;