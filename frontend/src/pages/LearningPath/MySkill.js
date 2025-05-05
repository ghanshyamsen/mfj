import React, {useEffect, useState} from 'react';
import Footer from './lFooter'
import chapter1 from '../../assets/images/chapter1.png'

import SimpleArrow from '../../assets/images/simple-line-icons_right.png'
import BackkkArrow from '../../assets/images/backkkArrow.png'
import Check from '../../assets/images/ic_round-check.png'
import CheckWhite from '../../assets/images/ic_round-check-white.png'

import { Skeleton } from 'primereact/skeleton';

import { Link, useParams } from "react-router-dom";

function MySkills() {

    const { key:Id } = useParams();
    const TOKEN = localStorage.getItem('token');
    const [skill, setSkill] = useState({});
    const [materials, setMaterials] = useState([]);
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));
    const [completed, setCompleted] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const goToBack = () => window.history.back();

    const [assessments, setAssessments] = useState([]);

    useEffect(() => {

        /* if(!User.purchased_skills.includes(Id)){
            window.showToast("You don't have access to this module.");
            goToBack();
        } */

        getSkill();
    },[]);

    const getSkill = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-skill/${Id}?page=purchased`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setSkill(result.data);
                setMaterials(result.material);
                setCompleted(result.completed);
                setAssessments(result.assessments);
            }else{
                window.showToast(result.message,'error');
                goToBack();
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

    return(
        <>
          <div className='mylearning_page myskill_page'>
                <div className='common_container'>
                    <div className='heading_row_top'>
                        <Link to='' className='back_button' onClick={goToBack}> <img src={BackkkArrow} alt="" /> </Link>
                        <h1 className='heading'> My Skills </h1>
                    </div>

                    <div className='pld_section'>
                        <div className='pld_body_block m-0'>
                            <div className='pldb_content_block'>
                                <div className='heading_row'>
                                    <h1 className='content_title'> Course Overview: {skill.title} </h1>
                                </div>
                                <div className='pldb_text' dangerouslySetInnerHTML={skill.description ? { __html: skill.description } : undefined}></div>
                            </div>
                            {/*  */}
                            <div className='chapter_list_block'>

                                {

                                    materials.map((value, index) => {

                                        const isCompleted = completed.some(({ chapter }) => chapter === value._id);
                                        const unlocked = isUnlocked(index, 'chapter', value._id);

                                        return (
                                                <Link
                                                    to={unlocked ? `/my-skills-detail/${value._id}` : '#'} // Disable navigation if not unlocked
                                                    key={value._id}
                                                    style={{ pointerEvents: unlocked ? 'auto' : 'none', opacity: unlocked ? 1 : 0.5 }}
                                                >
                                                <div className={`chapter_list ${completed.some(({chapter}) => chapter === value._id)?'complete_chapter_list':''}`}>
                                                    <div className='chapter_left_content'>
                                                        {loadingSkeleton ?
                                                            <div className='chapter_img'> <Skeleton width="80px" height="80px" /> </div>
                                                            :
                                                            <div className='chapter_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/material/${value.thumbnail}`} alt="" /> </div>
                                                        }
                                                        <div className='chapter_info'>
                                                            <h2 className='chapter_title'> {value.title} </h2>
                                                            <p className='chapter_desc'> {value.brief_description}  </p>
                                                            {completed.some(({chapter}) => chapter === value._id) && <p className='chap_bottom'> Congratulations, you have passed <span>{value.title}</span> </p>}
                                                            {!completed.some(({chapter}) => chapter === value._id) && <p className='chap_bottom'> <span>Click to learn {value.title}</span> </p>}
                                                        </div>
                                                    </div>
                                                    <div className='chapter_right_content'>
                                                        <div className='check_img'> <img src={Check} alt="" /> <img src={CheckWhite} alt="" />  </div>
                                                        <div className='cnext_arrow'> <img src={SimpleArrow} alt="" /> </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }

                                {
                                    assessments.map((value, index) => {

                                        const isCompleted = completed.some(({ assessment, assessment_completed }) => assessment === value._id && assessment_completed);
                                        const unlocked = isUnlocked(index, 'assessment', value._id);

                                        return (
                                            <Link
                                                to={unlocked ? `/my-assessment-detail/${value._id}` : '#'} // Disable navigation if not unlocked
                                                key={value._id}
                                                style={{ pointerEvents: unlocked ? 'auto' : 'none', opacity: unlocked ? 1 : 0.5 }}
                                            >
                                                <div className={`chapter_list ${completed.some(({assessment, assessment_completed}) => assessment === value._id && assessment_completed)?'complete_chapter_list':''}`}>
                                                    <div className='chapter_left_content'>
                                                        {loadingSkeleton ?
                                                            <div className='chapter_img'> <Skeleton width="80px" height="80px" /> </div>
                                                            :
                                                            <div className='chapter_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/assessment/${value.thumbnail}`} alt="" /> </div>
                                                        }
                                                        <div className='chapter_info'>
                                                            <h2 className='chapter_title'> {value.title} </h2>
                                                            <p className='chapter_desc'> {value.brief_description}  </p>
                                                            {completed.some(({assessment, assessment_completed}) => assessment === value._id && assessment_completed) && <p className='chap_bottom'> Congratulations, you have passed <span>{value.title}</span> </p>}
                                                            {!completed.some(({assessment, assessment_completed}) => assessment === value._id && assessment_completed) && <p className='chap_bottom'> <span>Click to learn {value.title}</span> </p>}
                                                        </div>
                                                    </div>
                                                    <div className='chapter_right_content'>
                                                        <div className='check_img'> <img src={Check} alt="" /> <img src={CheckWhite} alt="" />  </div>
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
                </div>

            </div>

            <Footer />
        </>
    )
}


export default MySkills;