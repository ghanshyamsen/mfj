import React, {useEffect, useState} from 'react';
import Footer from './lFooter'
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Link } from "react-router-dom";
import ArrowOrenge from '../../assets/images/arroworenge.png'
import SimpleArrow from '../../assets/images/simple-line-icons_right.png'
import { Rating } from 'primereact/rating';
import Modal from 'react-bootstrap/Modal';
import { Skeleton } from 'primereact/skeleton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useProfile } from '../../ProfileContext';

function MyLearning() {
    const {theme} = useProfile();
    const [activeIndex, setActiveIndex] = useState(0);
    const TOKEN = localStorage.getItem('token');
    const [modules, setModules] = useState([]);
    const [show, setShow] = useState(false);
    const [leaveReview, setSeaveReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [error, setError] = useState('');
    const [selectedPath, setSelectedPath] = useState('');
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const handleClose = () => {
        setShow(false);
        setSeaveReview(false);
    };

    const handleShow = () => setShow(true);

    useEffect(() => {
        getData(0);
    },[]);

    const getData = (index) => {

        setActiveIndex(index);
        const type = index === 0?'path':'skill';

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/my-learning?type=${type}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setModules(result.data);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

    }

    const submitReview = (event) => {

        if(rating < 1 || !review){
            setError('Please select rating and provide your review.');
            return
        }
        setError('');

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "rating": rating,
            "review": review
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/leave-path-review/${selectedPath}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                getData(0);
                handleClose();
                setSeaveReview(true);
                setRating(0);
                setReview('');
            }else{
                window.showToast(result.message,'error');
            }

            event.target.disabled = false;
        })
        .catch((error) => console.error(error.message));

    }


    return(
        <>
            <div className='mylearning_page'>
                <div className='common_container'>
                    <h1 className='heading'> My Learning </h1>

                    <TabView activeIndex={activeIndex} onTabChange={(e) => getData(e.index)}>

                        <TabPanel header="Learning Paths">

                            {modules.length > 0 ? (
                                modules.map((value, index) => {
                                    const { path } = value;
                                    const completed = ((path?.skills?.filter(value => value.completed)?.length === path?.skills?.length)?true:false);

                                    return  (
                                        path && <div className={`learning_cards ${completed?'complete_learning_card':''}  ${index % 2 === 0?'':'problemSolving_bg'}`} key={path._id}>

                                            <div className='lc_img_block'>
                                                <div className='bagde_name'> {path.level} </div>
                                                <h1 className='lc_img_title'>
                                                    {path.title}
                                                </h1>
                                                <div className='lc_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/path/${path.badge}`} alt="" /> </div>
                                                {completed && <div className='lc_badge_earn'> <span> Badge Earned </span></div>}
                                            </div>

                                            <div className='lc_content_block'>
                                                <h3 className='lccb_title'> {path.title} </h3>
                                                <div className='lccb_rating_block'>
                                                    <div className='lccb_left'>

                                                        {!value.rating && <button type="button" className='btn rating_btn' onClick={() => {
                                                            handleShow();
                                                            setSelectedPath(value._id)
                                                        }}> Leave a rating </button>}


                                                        {value.rating && <div className='rating_block'>
                                                            <p className=''> Your rating </p>
                                                            <Rating value={value.rating} readOnly cancel={false} />
                                                        </div>}

                                                        <p className='cskill'>
                                                            You have completed Skill <span>{path.skills?.filter(value => value.completed)?.length} of {path.skills?.length}</span> of the Leadership Path.
                                                            <br/>
                                                            {/* {!completed && <span>Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>} */}
                                                        </p>
                                                    </div>
                                                    <div className=''>
                                                        {!completed && <Link to={`/learning-path-detail/${path._id}`} className='btn continue_btn'> Continue </Link>}
                                                        {completed && <button type="button" className='btn continue_btn completed-btn'> Completed </button>}
                                                    </div>
                                                </div>

                                                <div className='progressBar_block'>
                                                    <ProgressBar value={(path.skills?.filter(value => value.completed)?.length/path.skills?.length)*100}></ProgressBar>
                                                    <div className='progress_value'>
                                                        <span> Overall Progress </span>
                                                        <span> {((path.skills?.filter(value => value.completed)?.length/path.skills?.length)*100).toFixed(2)}% </span>
                                                    </div>
                                                </div>

                                                <div className='skills_list_block'>

                                                    {
                                                        path?.skills?.map((value, index) => (
                                                            <div className={`skill_list ${value?.completed?'complete_skill':''}`} key={value._id}>
                                                                <Link to={`/my-skills/${value._id}`} className='list_item'>
                                                                    <div className='list_left_block'>
                                                                        <div className='skill_icon'> <img src={ArrowOrenge} alt=""/> </div>
                                                                        <div className='skill_content'>
                                                                            <h3 className='skill_name'> {value.title} </h3>
                                                                            {!value?.completed && <p className='sbuy'> <span> Click to learn Team work skills </span> </p>}
                                                                            {value?.completed && <p className='sbuy'> Congratulations, you have passed {value.title}! </p>}
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
                                        </div>
                                    )
                                })

                            ) : (
                                loadingSkeleton ?
                                    <Skeleton width="100%" height='250px' />
                                :
                                <div className='nocard_data'>
                                    <h3> It looks like you haven’t started a learning path yet. Explore our available paths to begin developing new skills and tracking your progress! </h3>
                                    <Link to={`/learning-path`}> <button className='btn apply_btn'>Get Started</button> </Link>
                                </div>
                            )}

                        </TabPanel>

                        <TabPanel header="Skills">

                            <div className='skill_card_block'>
                                {modules.length > 0 ? (
                                    modules.map((value, index) => {

                                        const { skill } = value;

                                        return (
                                            skill &&
                                            <div className={`skills_card ${value?.completed?'complete_skills_card':''}`} key={skill._id}>

                                                <div className='skill_type_block'>
                                                    <div className="skill_type">
                                                        <div className='skill_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.skill_logo}`} alt="" /> </div>
                                                        <div>
                                                            <div className='skill_name'> {skill.title} </div>
                                                            {/* {!value?.completed && <p className='cskill'>Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>} */}
                                                        </div>
                                                    </div>
                                                    <div className='progressBar_block'>
                                                        <ProgressBar value={value?.total_chapters_count?(((value.completed_count/value.total_chapters_count)*100)):0}></ProgressBar>
                                                        <div className='progress_value'>
                                                            <span> Overall Progress </span>
                                                            <span> {value?.total_chapters_count?(((value.completed_count/value.total_chapters_count)*100).toFixed(2)):0}% </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*  */}
                                                <div className='skill_process_block'>
                                                    <div className='badge_img_block'>
                                                        <div className='badge_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.skill_badge}`} alt="" /> </div>
                                                    </div>
                                                    <div className=''>
                                                        {!value?.completed && <Link to={`/my-skills/${skill._id}`} className='btn continue_btn'> Continue </Link>}
                                                        {value?.completed && <button className='btn continue_btn complete_btn' type="button"> Completed </button>}
                                                        {skill?.path.length > 0 && <span className='path_text'> {skill?.path?.map(({title}) => title).join(', ')} </span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    loadingSkeleton ?
                                        <Skeleton width="100%" height='250px' />
                                    :
                                    <div className='nocard_data'>
                                        <h3> It looks like you haven’t added any skills yet. Start learning by exploring our Learning Paths or completing skill-building activities to unlock and showcase your progress here! </h3>
                                        <Link to={`/learning-path`}> <button className='btn apply_btn'>Get Started</button> </Link>
                                    </div>
                                )}


                            </div>


                        </TabPanel>

                    </TabView>
                </div>
            </div>


            <Footer />

            <Modal className={`assign_modal_code ${theme}`} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Leave a Review </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='buy_block'>

                        <Rating value={rating} cancel={false} onChange={(e) => setRating(e.value)} />

                        <FloatingLabel controlId="floatineducation" label={<span> Review <span className='required'>*</span> </span>} className="mt-3 mb-4">
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="review"
                                value={review||''}
                                onChange={(e) => setReview(e.target.value)}
                                maxLength="300"
                                placeholder=""
                            />
                            {/* {error && <small style={{color:"red"}}>{error}</small>} */}
                            {error && <p className="error text-center mt-2" style={{color:"red"}}>{error}</p>}
                            <p className="phone_Text"> {review?.length}/300 </p>
                        </FloatingLabel>

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn back-button' onClick={handleClose}> Cancel </button>
                            <button type="button" className='btn submit_btn' onClick={submitReview}> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className={`assign_modal_code ${theme}`} show={leaveReview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Leave a Review </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='buy_block'>

                        <h3 className='review_text'>Thank you for leaving a review! Your feedback is greatly appreciated.</h3>

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn m-0' onClick={handleClose}> Close </button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>

        </>
    )


}

export default MyLearning;