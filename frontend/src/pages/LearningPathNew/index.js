import React, { useEffect, useState } from 'react';
import Leadership1 from '../../assets/images/Leadership1.png'
import Leadership2 from '../../assets/images/Leadership2.png'
import Leadership from '../../assets/images/Leadership.png'
import ProblemSolving from '../../assets/images/ProblemSolving.png'
import ProblemSolving1 from '../../assets/images/ProblemSolving1.png'
import Ellipse2 from '../../assets/images/Ellipse2.png'
import Ellipseblue from '../../assets/images/Ellipseblue.png'
import Coin from '../../assets/images/coin.png'

import blackarrows from '../../assets/images/blackarrows.png'
import snakArrow from '../../assets/images/snakarrow.png'
import boyBoard from '../../assets/images/boy-with-empty-board.png'

import Review from '../LearningPath/review'
import Footer from '../LearningPath/lFooter'
import PurchaseModel from '../../BuyCreditModal'

import Levels from './levels'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Skeleton } from 'primereact/skeleton';


function LearningPathNew() {

    const TOKEN = localStorage.getItem('token');
    const [reviews, setReviews] = useState([]);
    const [levels, setLevels] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [levelSkeleton, setLevelSkeleton] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [purchaseData, setPurchaseData] = useState({});
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));

    useEffect(() => {
        getReviews();
        getLevels();
        getPlan();
    },[])

    const getLevels = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-levels`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setLevels(result.data);
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLevelSkeleton(false))
    }

    const getReviews = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/lms-reviews`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setReviews(result.data);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const getPlan = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-plans?keys=lms_access,all_feature_access`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPlans(result.data);
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));

    }

    const purchaseModules = (event, data) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": data.type,
            "id": data.id
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
                setShowModal(false);
                window.showToast(result.message,'success');
                setLevelSkeleton(true)
                setLoadingSkeleton(true)
                getPlan();
                getLevels();
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));


    }

    const buyModule = (data) => {
        setPurchaseData(data);
        setShowModal(true);
    }

    return(
        <>

            <div className="learning_banner_seciton">
                <div className='banner_imgs'> <img src={Leadership1} alt="" /> </div>
                <div className='banner_imgs'> <img src={Leadership2} alt="" /> </div>
                <div className='banner_imgs'> <img src={Leadership} alt="" /> </div>
                <div className='banner_imgs'> <img src={ProblemSolving} alt="" /> </div>
                <div className='banner_imgs'> <img src={ProblemSolving1} alt="" /> </div>
                <div className='banner_imgs'> <img src={Ellipse2} alt="" /> </div>
                <div className='banner_imgs'> <img src={blackarrows} alt="" /> </div>
                <div className='banner_imgs'> <img src={snakArrow} alt="" /> </div>
                <div className='banner_imgs'> <img src={boyBoard} alt="" /> </div>
                <div className='banner_imgs'> <img src={Ellipse2} alt="" /> </div>
                <div className='banner_imgs'> <img src={Ellipseblue} alt="" /> </div>
                <div className='banner_imgs'> <img src={Ellipseblue} alt="" /> </div>

                <h1 className='banner_heading'>Browse Various Learning<br/> Paths & Skills  </h1>
            </div>

           {/*  */}

            <div className='level_content_section'>
                <div className='lcs_inner_block'>
                    <h2 className='lcs_title'> Build confidence with hands-on practice </h2>
                    <div className='las_level_tab_blocks'>
                        <Levels levels={levels} setShowModal={setShowModal} setPurchaseData={setPurchaseData} buyModule={buyModule} levelSkeleton={levelSkeleton} />
                    </div>
                    <div className='lms_access_block'>
                        <Row>

                            {
                                plans.map((value, index) => (
                                    <Col sm={6} key={index}>
                                        {loadingSkeleton ?
                                            <div className="lmsacc_card">
                                                <Skeleton width="10rem" height="1rem" className='mb-1' />
                                                <Skeleton width="10rem" height="1rem" className='mb-1' />
                                                <Skeleton width="10rem" height="1rem" className='mb-1' />

                                            </div>
                                        :
                                            <div className={`lmsacc_card ${value.plan_key}`}>
                                                <h2 className='lmsacc_title'> {value.plan_name} </h2>
                                                <p className='lms_desc'> {value.plan_title} </p>
                                                <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> {value?.plan_price} </span> {value?.plan_price_text} </p>
                                                <div className='m-content' dangerouslySetInnerHTML={{ __html: (value.plan_description||'') }}></div>
                                                {/* <ul>
                                                    <li>Includes Course Module</li>
                                                    <li>Includes Full Learning Level</li>
                                                    <li>Includes All Levels</li>
                                                </ul> */}
                                                <button type='button' className='btn assecc_btn' onClick={(e) => {
                                                    buyModule({
                                                        type:"plan",
                                                        id: value._id,
                                                        name:value.plan_name,
                                                        price: value?.plan_price
                                                    })
                                                }}> Get {value.plan_name} </button>
                                            </div>
                                        }
                                    </Col>
                                ))
                            }
                        </Row>
                    </div>
                </div>
            </div>

            {/*  */}

            <div className='structured_section'>
                <div className='common_container'>
                    <div className='ss_img1'></div>
                    <div className='content_block'>
                        <h1 className='ssc_title'> Structured Learning Paths </h1>
                        <p className='ssc_desc'> Strategically designed & Organized Learning paths offering range of skill based achievements   </p>
                    </div>
                    <div className='ss_img2'></div>
                    <div className='ss_img3'></div>
                </div>
            </div>

            {reviews.length > 0 && <div className='review_section'>
                <div className='common_container'>
                    <h1 className='review_heading'> Reviews </h1>
                    <Review reviews={reviews} />
                </div>
            </div>}

            <Footer />

            <PurchaseModel showModal={showModal} setShowModal={setShowModal} purchaseModules={purchaseModules} purchaseData={purchaseData} User={User}/>

        </>
    )
}

export default LearningPathNew;