import React, { useState, useEffect } from "react";
import './index.css'
import Thamb from '../../assets/images/thanb.png';
import DownThamb from '../../assets/images/down_thumbs.png';

import Medal from '../../assets/images/medalimg2.png';
import { ProgressBar } from 'primereact/progressbar';
import { useParams, Link, useNavigate } from "react-router-dom";
import ArrowOrenge from '../../assets/images/arroworenge.png'
import SimpleArrow from '../../assets/images/simple-line-icons_right.png'
import Medalimg from '../../assets/images/medalimg2.png'
import collectionShields from '../../assets/images/collection-shields-flat-design.png'
import ProblemSolving from '../../assets/images/ProblemSolving3.png'


function Index() {
    const { key:Id } = useParams();

    const TOKEN = localStorage.getItem('token');
    const [module, setModule] = useState({});
    const [type, setType] = useState('');
    const [pass, setPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const history = useNavigate();

    useEffect(() => {
        getResult();
    },[])

    function getNextId(skills, currentId) {
        // Find the current index in the array
        const currentIndex = skills.findIndex(item => item._id === currentId);

        // If the current ID is found and it's not the last element
        if (currentIndex !== -1 && currentIndex < skills.length - 1) {
            // Return the next ID
            return skills[currentIndex + 1]._id;
        } else {
            // If the current ID is the last one or not found, return null or handle accordingly
            return null;
        }
    }

    const getResult = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/result/${Id}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if(result.status){
                setModule(result.data);
                setType(result.type);

                if(result.type === 'path'){
                    const { skills } = result.data.path;
                    const completed = skills.some(value => value._id === Id && value.completed);
                    setPass(completed)
                }else{
                    setPass(result.data.completed)
                }
            }else{
                window.showToast(result.message, 'error');
                history('/my-learning');
            }
          })
          .catch((error) => console.error(error.message))
          .finally(() => setLoading(true))
    }

    const PathCard = ({value}) => {

        const { path } = value;
        const completed = ((path?.skills?.filter(value => value.completed)?.length === path?.skills?.length)?true:false);
        const nextId = getNextId(path?.skills, Id);
        const url = nextId?`/my-skills/${nextId}`:'/my-learning';

        return (
            <>
                <div className={`learning_cards ${completed?'complete_learning_card':''} `} key={path._id}>

                    <div className='lc_img_block'>
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
                                <p className='cskill'>
                                    You have completed Skill <span>{path.skills?.filter(value => value.completed)?.length} of {path.skills?.length}</span> of the Leadership Path.
                                    <br/>
                                    {/* {!value.completed && <span>Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>} */}
                                </p>
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

                {pass && <div className="text-center"><Link to={url} className="btn next_btn" type="button"> Next </Link></div>}
            </>
        )
    }

    const SkillCard = ({value}) => {

        const { skill } = value;

        return (
            <div className={`skills_card ${value?.completed?'complete_skills_card':''}`} key={skill._id}>

                <div className='skill_type_block'>
                    <div className="skill_type">
                        <div className='skill_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.skill_logo}`} alt="" /> </div>
                        <div>
                            <div className='skill_name'> {skill.title} </div>
                            {/* {!value.completed && <p className='cskill'>Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>} */}
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
                </div>
            </div>
        )
    }

    return(
        <>
            {loading && pass && <div className="result_page result_successfully">
                <div className="common_container">
                    <h1 className="heading"> Result </h1>
                    <div className="result_block">
                        <div className="rb_top_block">
                            <div className="rbs_messsage">
                                <img src={Thamb} alt="" />
                                <span className="tbsm"> You have successfully completed the assessment. </span>
                            </div>
                        </div>
                        {/*  */}
                        <div className="rp_block">
                            <div className="medal_content">
                                <img src={Medal} alt="" />
                                <span className="tbsm"> Great job! You've completed your assessment and earned this badge. </span>
                            </div>
                            {/*  */}
                            <div className="rs_block">

                                { type === 'path' &&  <PathCard value={module} /> }

                                { type === 'skill' &&  <SkillCard value={module} /> }


                                {type === 'skill' && <div className="text-center"><Link to="/my-learning" className="btn next_btn" type="button"> Next </Link></div>}
                            </div>
                            {/*  */}
                        </div>
                    </div>
                </div>
            </div>}

            {loading && !pass && <div className="result_page">
                <div className="common_container">
                    <h1 className="heading"> Result </h1>
                    <div className="result_block">
                        <div className="rb_top_block">
                            <div className="rbs_messsage">
                                <img src={DownThamb} alt="" />
                                <span className="tbsm"> You didn’t pass the assessment, but don't give up! </span>
                            </div>
                        </div>
                        {/*  */}
                        <div className="rp_block">
                            <div className="medal_content">
                                <span className="tbsm text-center"> You did well, but unfortunately the assessment was not passed. However, there's always room for improvement.</span>
                            </div>
                            {/*  */}
                            <div className="rs_block">

                                { type === 'path' &&  <PathCard value={module} /> }

                                { type === 'skill' &&  <SkillCard value={module} /> }

                                <div className="text-center"><Link to={`/my-skills/${Id}`} className="btn next_btn" type="button"> Try the assessment again </Link></div>
                            </div>
                            {/*  */}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Index;