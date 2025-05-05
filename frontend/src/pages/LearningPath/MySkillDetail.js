import React, {useState, useEffect} from 'react';
import Footer from './lFooter'
import chapter1 from '../../assets/images/chapter1.png'
import BackkkArrow from '../../assets/images/backkkArrow.png'
import { Link, useParams, useNavigate } from "react-router-dom";

import { Skeleton } from 'primereact/skeleton';

import HtmlRender from './HtmlRender';
import PdfViewer from './PdfViewer';
import VideoPlayer from './VideoPlayer';

function MySkillDetail() {

    const { key:Id } = useParams();
    const history = useNavigate();

    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));
    const TOKEN = localStorage.getItem('token');
    const [material, setMaterial] = useState({});
    const [chapters, setChapters] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [chapterPath, setChapterPath] = useState('');

    const goToBack = () => window.history.back();

    useEffect(() => {
        getMaterial();
    },[Id]);

    function getNextId(currentId) {
        // Find the current index in the array
        const currentIndex = chapters.findIndex(item => item._id === currentId);

        // If the current ID is found and it's not the last element
        if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
            // Return the next ID
            return chapters[currentIndex + 1]._id;
        } else {
            // If the current ID is the last one or not found, return null or handle accordingly
            return null;
        }
    }

    function getNextAssessmentId(currentId) {
        // Find the current index in the array
        const currentIndex = assessments?.[0]?._id;

        // If the current ID is the last one or not found, return null or handle accordingly
        return currentIndex;
    }

    const getMaterial = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-material/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                // if(!User.purchased_skills.includes(result.data?.skill?._id)){
                //     window.showToast("You don't have access to this module.",'error');
                //     goToBack();
                // }

                setChapterPath(result.chapter_path)
                setMaterial(result.data);
                setChapters(result.other);
                setCompleted(result.completed);
                setAssessments(result.other_assessments);

            }else{
                window.showToast("You don't have access to this module.",'error');
                goToBack();
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const goToNext = (event) => {

        event.target.disabled = true;

        const nextChapterId = getNextId(Id);
        const nextAssessmentId = getNextAssessmentId(Id);


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "skill": material.skill._id,
            "chapter": Id,
            "type": "chapter"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/mark-completed`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                event.target.disabled = false;
                if(nextChapterId){
                    history('/my-skills-detail/'+nextChapterId);
                }else if(nextAssessmentId){
                    history('/my-assessment-detail/'+nextAssessmentId);
                }else{
                    history('/result/'+material.skill._id);
                    //history('/my-skills/'+material.skill._id);
                }
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error.message));
        return
        if(!completed){
        }else{
            event.target.disabled = false;

            if(nextChapterId){
                history('/my-skills-detail/'+nextChapterId);
            }else if(nextAssessmentId){
                history('/my-assessment-detail/'+nextAssessmentId);
            }else{
                history('/my-skills/'+material.skill._id);
            }

        }
    }

    return(
        <>
          <div className='mylearning_page myskill_detail_page'>
                <div className='common_container'>
                    <div className='heading_row_top'>
                        <Link to='' className='back_button' onClick={goToBack}> <img src={BackkkArrow} alt="" /> </Link>
                        <h1 className='heading'> {material.skill?.title}  </h1>
                    </div>

                    <div className='pld_section'>
                        <div className='pld_body_block m-0'>

                            <div className='chapter_list_block'>
                                <div className='chapter_list complete_chapter_list'>
                                    <div className='chapter_left_content'>
                                        {loadingSkeleton ?
                                            <div className='chapter_img'> <Skeleton width="80px" height="80px" /> </div>
                                            :
                                            <div className='chapter_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/material/${material.thumbnail}`} alt="" /> </div>
                                        }
                                        <div className='chapter_info'>
                                            <h2 className='chapter_title'> {material.title}</h2>
                                            <p className='chapter_desc' style={{color: '#767676'}}> {material.brief_description}  </p>
                                        </div>
                                    </div>
                                    <div className='chapter_content_block'>
                                        {/* <div className='ccb_img'>  </div> */}
                                        {(material.type === 'video' && material.material_media) && <VideoPlayer link={`${chapterPath+material.material_media}`} title={material.title} />}
                                        {(material.type === 'content' || material.type === 'video') && material.description && <div className='' dangerouslySetInnerHTML={material.description ? { __html: material.description } : undefined}></div>}
                                        {(material.type === 'html' &&  material.content_media_path) && <HtmlRender link={`${process.env.REACT_APP_MEDIA_URL+material.content_media_path}`} />}
                                        {(material.type === 'pdf' &&  material.material_media ) && <PdfViewer link={`${chapterPath+material.material_media}`}  title={material.title} />}

                                    </div>
                                </div>

                            </div>

                            <div className='text-center'>
                                <button className="btn next_btn" type='button' onClick={goToNext}> Next </button>
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


export default MySkillDetail;