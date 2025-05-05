import React, { useEffect, useState } from 'react';
import Footer from './lFooter'
import CategoriesList from './CategoriesList'
import { Link, useParams } from "react-router-dom";
import MedalImg from '../../assets/images/medal_img.png'
import chapter1 from '../../assets/images/chapter1.png'
import Modal from 'react-bootstrap/Modal';
import SimpleArrow from '../../assets/images/simple-line-icons_right.png'
import Lock from '../../assets/images/lock.png'
import BackkkArrow from '../../assets/images/backkkArrow.png'
import Coin from '../../assets/images/coin.png';
import Cash from '../../assets/images/3d-cash-money.png';
import { Skeleton } from 'primereact/skeleton';
import { useProfile } from '../../ProfileContext';

function LearningPathDetail() {
    const {theme} = useProfile();
    const { key:Id } = useParams();
    const TOKEN = localStorage.getItem('token');
    const [skill, setSkill] = useState({});
    const [materials, setMaterials] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [purchased, setPurchased] = useState(false);
    const [completed, setCompleted] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);


    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        checkPurchased();
        getSkill();
    },[]);

    const checkPurchased = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/check-purchased/skill/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPurchased(result.purchased)
            }
        })
        .catch((error) => console.error(error.message));
    }

    const getSkill = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-skill/${Id}?page=detail`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setSkill(result.data);
                setMaterials(result.material)
                setCompleted(result.completed);
                setAssessments(result.assessments);
            }else{
                goToBack();
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    }

    const goToBack = () => window.history.back();

    const purchaseModules = (event) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": "learning_skill",
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
                setPurchased(true);
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));

    }

    const isUnlocked = (index, type, id) => {
        const areAllChaptersCompleted = materials.every(material =>
            completed.some(({ chapter }) => chapter === material._id)
        );

        if (type === 'chapter') {
            return index === 0 || completed.some(({ chapter }) => chapter === materials[index - 1]?._id);
        } else if (type === 'assessment') {
            return areAllChaptersCompleted && index === 0 || completed.some(({ assessment, assessment_completed }) => assessment === assessments[index - 1]?._id && assessment_completed);
        }
    };


    return (
        <>

            <CategoriesList />

            <div className='skills_detail_page'>
                <div className='common_container'>
                    <Link to='' className='back_button' onClick={goToBack}> <img src={BackkkArrow} alt="" /> </Link>
                    <div className='pld_section'>
                        <div className='pld_banner_block' style={{background:`url(${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.thumbnail}) center / cover no-repeat`}}>
                            <div className='banner_content_block'>
                                <h2 className='bheading'> {skill.title} </h2>
                                { loadingSkeleton ?
                                    <Skeleton  width="200px" height='30px' className='mb-2 ms-auto me-auto' />
                                :
                                <>
                                    {!purchased && <p className='bsubtitle'> Buy for <img src={Coin} alt=""/> <b>{skill.credit_price}</b> </p>}
                                </>
                                }
                                <div className='banner_btn_block'>
                                     { loadingSkeleton ?
                                        <Skeleton  width="200px" height='50px' className='ms-auto me-auto' />
                                    :
                                    <>
                                        {!purchased && <button type="button" className='btn buy-btn' onClick={handleShow}> Buy Now </button>}
                                        {purchased && <Link to="/my-learning" className='btn buy-btn'> Go to My Learning</Link>}
                                        {skill.video_link && <Link to={skill.video_link} target="_blank" className='btn watch-btn'> Watch Video </Link>}
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        <div className='pld_body_block'>
                            <div className='pldb_top_block'>
                                <div className='badge_block'>
                                    <div className='badge_icon'>
                                        { loadingSkeleton ?
                                            <Skeleton  width="100%" height='100%' shape="circle" />
                                        :
                                            <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.skill_badge}`} alt="" />
                                        }
                                    </div>
                                    <div className='badge_content'>
                                        <h3 className='badge_title'> {skill.title} Badge   </h3>
                                        <p className='badge_desc'>You will earn this badge after successfully accomplishing all the material from the {skill.title}. </p>
                                    </div>
                                </div>
                            </div>
                            {/*  */}
                            <div className='pldb_content_block'>
                                <div className='heading_row'>
                                    <h1 className='content_title'> Course Overview: {skill.title} </h1>
                                    <h3 className='cright_title'> {materials.length} {materials.length >1?'Chapters':'Chapter'} {assessments.length >0?`and ${assessments.length} ${assessments.length > 1?'Assessments':'Assessment'}`:''} </h3>
                                </div>
                                <div className='pldb_text' dangerouslySetInnerHTML={skill.description ? { __html: skill.description } : undefined}></div>
                            </div>
                            {/*  */}
                            <div className='chapter_list_block'>
                                {
                                    materials.map((value, index) =>{

                                        const unlocked = isUnlocked(index, 'chapter', value._id);

                                        return (
                                            <Link
                                                to={unlocked && purchased?`/my-skills-detail/${value._id}`:''} key={value._id}
                                                onClick={() => { !purchased && handleShow()  }}
                                                style={purchased ? { pointerEvents: unlocked ? 'auto' : 'none', opacity: unlocked ? 1 : 0.5 } : {}}
                                            >
                                                <div className='chapter_list'>
                                                    <div className='chapter_left_content'>
                                                        <div className='chapter_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/material/${value.thumbnail}`} alt="" /> </div>
                                                        <div className='chapter_info'>
                                                            <h2 className='chapter_title'> {value.title} </h2>
                                                            <p className='chapter_desc'> {value.brief_description}  </p>
                                                        </div>
                                                    </div>
                                                    <div className='chapter_right_content'>
                                                        {!purchased && <div className='lock_img'> <img src={Lock} alt="" />  </div>}
                                                        <div className='cnext_arrow'> <img src={SimpleArrow} alt="" /> </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                                {
                                    assessments.map((value, index) => {

                                        const unlocked = isUnlocked(index, 'assessment', value._id);

                                        return (
                                            <Link
                                                to={unlocked && purchased?`/my-assessment-detail/${value._id}`:''} key={value._id}
                                                onClick={() => { !purchased && handleShow()  }}
                                                style={purchased ? { pointerEvents: unlocked ? 'auto' : 'none', opacity: unlocked ? 1 : 0.5 } : {}}
                                            >
                                                <div className='chapter_list'>
                                                    <div className='chapter_left_content'>
                                                        <div className='chapter_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/assessment/${value.thumbnail}`} alt="" /> </div>
                                                        <div className='chapter_info'>
                                                            <h2 className='chapter_title'> {value.title} </h2>
                                                            <p className='chapter_desc'> {value.brief_description}  </p>
                                                        </div>
                                                    </div>
                                                    <div className='chapter_right_content'>
                                                        {!purchased && <div className='lock_img'> <img src={Lock} alt="" />  </div>}
                                                        <div className='cnext_arrow'> <img src={SimpleArrow} alt="" /> </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>


                        </div>
                        {/*  */}
                    </div>
                    {/* pld_section */}
                </div>
            </div>

            <Footer />

            <Modal className={`assign_modal_code ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{skill.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='buy_block'>
                        <div className='credits_amount'>
                            <label> Credits Required </label>
                            <div className='ca_cash'> <img src={Coin} alt=""/> <span> {skill.credit_price} </span> </div>
                        </div>

                        <div className='balance_block'>
                            <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                            <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {User.user_credit?.toLocaleString('en')} </span> </div>
                        </div>

                        {skill.credit_price > User.user_credit &&  <div className='add_credits_block'>
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