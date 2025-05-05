import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Leadership1 from '../../assets/images/Leadership1.png'
import Leadership2 from '../../assets/images/Leadership2.png'
import Leadership from '../../assets/images/Leadership.png'
import ProblemSolving from '../../assets/images/ProblemSolving.png'
import ProblemSolving1 from '../../assets/images/ProblemSolving1.png'
import Ellipse2 from '../../assets/images/Ellipse2.png'
import Ellipseblue from '../../assets/images/Ellipseblue.png'
import Coin from '../../assets/images/coin.png';
import blackarrows from '../../assets/images/blackarrows.png'
import snakArrow from '../../assets/images/snakarrow.png'
import boyBoard from '../../assets/images/boy-with-empty-board.png'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Rating } from 'primereact/rating';


import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import Review from './review'
import Footer from './lFooter'
import CategoriesList from './CategoriesList'


function LearningPath() {

    const TOKEN = localStorage.getItem('token');

    const [skills, setSkills] = useState([]);
    const [path, setPath] = useState([]);
    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        getContents();
        getReviews();
    },[])

    const getContents = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-skill`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setSkills(result.data);
            }
        })
        .catch((error) => console.error(error.message));


        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-path`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPath(result.data);
            }
        })
        .catch((error) => console.error(error.message));
    }


    const classes = ["gb1", "gb2", "gb3", "gb4"];

    const renderTooltip = (props) =>{
        return (
            <Tooltip id="button-tooltip" {...props}>
                {props.content.length ? props.content.map(({title}) => title).join(',\n ') : ''}
            </Tooltip>
        )
    };

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

    return(
        <>

            <CategoriesList />

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

            {/* <div className='begin_assessment_section'>
                <div className='common_container'>
                    <div className='bas_block'>
                        <h1 className='bas_title'> Not Sure <br/> which Path to select?  </h1>
                        <p className='p_text'> Take our Preliminary Assessment Survey! </p>
                        <Link to="/my-learning" className='bas_btn btn' type='button'> <img src={lStar} alt="" /> Begin Assessment </Link>
                    </div>
                </div>
            </div> */}

            {path.length > 0 && <div className="learning_paths_section">
                <div className='common_container'>
                    <h1 className='lps_title'> Learning Paths </h1>
                    <Row>

                        {
                            //Updated code
                            path.map((value, index) => {
                                return  (
                                    <Col lg={3} sm={4} key={'path_' + index}>
                                        <div className='learning_card_block'>
                                            <div className='learning_inner'>
                                                <div className={`top_row ${classes[index % classes.length]}`}>
                                                    <h1 className='lcb_title'> {value.title}</h1>
                                    <div className='bage_img'> <img src={value.thumbnail} alt="" /> </div>
                                    </div>
                                    <div className='learn_body'>
                                    <h2 className='lb_title'> Total Skills {value.skills} </h2>
                                    <div className='review_block'>
                                        <p className='review_sm'> Reviews received </p>
                                        <div className='d-flex align-items-center rbox'>
                                            <Rating value={parseFloat(value.avg_rating)} readOnly cancel={false} />
                                            <span className='rading_count'>{value.avg_rating} ({value.total_ratings})</span>
                                        </div>
                                    </div>
                                    <p className='credit_text'> Buy for <img src={Coin} alt="" /> <span>{value.credit_price}</span> </p>
                                    <div className='view_btn text-center'>
                                        <Link to={`/learning-path-detail/${value.id}`} className='btn'>View Details</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })
                        }

                    </Row>
                </div>
            </div>}

            {skills.length > 0 && <div className="skills_section">
                <div className='common_container'>
                    <h1 className='ss_title'> Skills </h1>
                    <p className='ss_desc'> Browse content by the topics that interest you most. </p>

                    <Row>
                        {
                            skills.map((value, index) => (
                                <Col lg={4} md={6} sm={6} key={'skill_'+index}>
                                    <Link className='skill_card_outer' to={`/skill-detail/${value.id}`}>
                                        <div className='skill_card'>
                                            <div className='skill_img'> <img src={value.thumbnail} alt="" /> </div>
                                            <div className='skill_body'>
                                                <h2 className='s_name'> {value.title} </h2>
                                                <div className='d-flex mt-auto'>
                                                    <p className='credit_text'> Buy for <img src={Coin} alt="" /> <span>{value.credit_price}</span></p>
                                                    {value.paths?.length > 0 && <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={(props) => renderTooltip({ ...props, content: value?.paths })}
                                                    >
                                                        <div className='skill_type' > {value.paths?.length || 0} </div>
                                                    </OverlayTrigger>}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            ))
                        }

                    </Row>

                </div>
            </div>}

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

        </>
    )
}

export default LearningPath;