import React,{useState} from "react";
import Coin from '../../assets/images/coin.png'
import ComingcuteStarFillin from '../../assets/images/mingcute_star-fill.png'
import RivetIconWhite from '../../assets/images/rivet-icons_white.png'
import RivetIconExpand from '../../assets/images/rivet-icons_collapse.png'

import RivetIcon from '../../assets/images/rivet-icons_orange.png'
import RivetIconExpandOrange from '../../assets/images/rivet-icons_expand_orange.png'


import level1 from '../../assets/images/level1.svg'
import level2 from '../../assets/images/level2.svg'
import level3 from '../../assets/images/level3.svg'
import Lock from '../../assets/images/lockgrays.svg'


import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

import { Skeleton } from 'primereact/skeleton';

function Levels({levels, setShowModal, setPurchaseData, buyModule, levelSkeleton }) {

    const [activeState, setActiveState] = useState(0);
    const getPurchasedStatus = (order, type) => {
        const data = levels;
        // Check for 'level' type
        if (type === 'level') {
            // Find the level by order
            const level = data.find(level => level.order === order);
            if (level) {
                return level.purchased || null; // If level exists, return its purchased status (or null if it doesn't exist)
            }
        }

        // Check for 'path' type
        if (type === 'path') {
            // Iterate over levels to find the path by order
            for (const level of data) {
                const path = level.paths.find(path => path.order === order);
                if (path) {
                    return path.purchased || null; // If path exists, return its purchased status (or null)
                }
            }
        }

        // Check for 'skill' type
        if (type === 'skill') {

            // Iterate over levels and paths to find the skill by order
            for (const level of data) {
                for (const path of level.paths) {
                    const skill = path.skills.find(skill => skill.order === order);
                    if (skill) {
                        return skill.purchased || null; // If skill exists, return its purchased status (or null)
                    }
                }
            }
        }

        // Return null if no matching order is found for the specified type
        return null;
    };

    if(!levelSkeleton){
        setTimeout(() => {
            setActiveState(0)
        }, 1000);
    }

    return(
        <>
            {levelSkeleton?
                <>
                    <div>
                        <Skeleton width="100%" height="15rem" className='mb-1' />
                        <Skeleton width="100%" height="3rem" className='mb-1' />
                        <Skeleton width="100%" height="3rem" className='mb-1' />
                        <Skeleton width="100%" height="3rem" className='mb-1' />
                        <Skeleton width="100%" height="3rem" className='mb-1' />
                    </div>
                </>
            :<Accordion defaultActiveKey={activeState}>

                {
                    levels.map((values, index) => {
                        return (
                            <Accordion.Item eventKey={index} key={index} className="level_accordion_items">
                                <Accordion.Header>
                                    <div className="accor_heading_row">
                                        <h2 className="ahr_title">{values.order}. {values.name} </h2>
                                        {!values.purchased && <div type="button" className="buy_button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent accordion toggle
                                                buyModule({
                                                    type:"level",
                                                    id: values._id,
                                                    name:values.name,
                                                    order: values.order,
                                                    price: values.price
                                                }); // Your redirect logic
                                            }}
                                        >
                                        Buy for <img src={Coin} alt="" /> <span>{values.price}</span>
                                        </div>}
                                        <span className="reviews">
                                            <img src={ComingcuteStarFillin} alt="" />
                                            <span> {values.avgRating?.toFixed(1)} ({values.totalRatings}) </span>
                                        </span>
                                        <span className="revet_icon"> 
                                            <img src={RivetIcon} alt="" /> 
                                            <img src={RivetIconExpandOrange} alt="" />
                                        </span>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="">
                                        <div className="ab_content_block">
                                            <h2>{values.title}</h2>
                                            <p>{values.description}</p>
                                        </div>

                                        <Accordion defaultActiveKey={activeState}>

                                            {
                                                values?.paths.map((path, index) => {
                                                    return (
                                                        <Accordion.Item eventKey={index} key={index} className="level_path_accordion">
                                                            <Accordion.Header>
                                                                <div className="lpa_heading_row">
                                                                    <div className="lpa_title">
                                                                        {path.logo && <img src={path.logo} alt="" />}
                                                                        <span>{path.title}</span>
                                                                    </div>
                                                                    <Link to={`/learning-path-detail/${path._id}`} className="view_text"> View → </Link>
                                                                    <span className="revet_icon"> 
                                                                        <img src={RivetIconExpand} alt="" /> 
                                                                        <img src={RivetIconWhite} alt="" /> 
                                                                    </span>
                                                                </div>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <Row>

                                                                    {
                                                                        path?.skills.map((skill, index) => {
                                                                            let isLocked = ((skill.order!==1 && !getPurchasedStatus((skill.order-1),'skill')))?true:false;
                                                                            return (
                                                                                <Col sm={6} key={index}>
                                                                                    <Link to={`/skill-detail/${skill._id}`}>
                                                                                        <div className={`learning_path_card ${ isLocked? 'locked' : ''}`}>
                                                                                            {isLocked && (
                                                                                                <div className="path_lock">
                                                                                                    <img src={Lock} alt="" />
                                                                                                </div>
                                                                                            )}
                                                                                            <div className="learning_path_card_inner">
                                                                                                <div className="lpc_icon"> <img src={skill.skill_logo} alt="" /> </div>
                                                                                                <div className="lpc_body">
                                                                                                    <h3 className="lpc_title"> {skill.title} </h3>
                                                                                                    {!skill?.purchased && <p className="lpc_amount"> Buy for <img src={Coin} alt="" /> <span>{skill.credit_price}</span> </p>}
                                                                                                </div>
                                                                                                {/* <p className="count"> {skill?.linkPaths?.length} </p> */}
                                                                                                <div className="lpc_logo_outer">
                                                                                                    <div className="lpc_logo_inner"> <img src={skill.skill_badge} alt="" />  </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Link>
                                                                                </Col>
                                                                            )
                                                                        })
                                                                    }

                                                                </Row>

                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    )
                                                })
                                            }

                                        </Accordion>
                                    </div>

                                </Accordion.Body>
                            </Accordion.Item>
                        )
                    })
                }
            </Accordion>}
        </>
    )


}

export default Levels;