import React, {useState, useEffect} from 'react';
import Footer from './lFooter'
import chapter1 from '../../assets/images/chapter1.png'
import BackkkArrow from '../../assets/images/backkkArrow.png'
import { Link, useParams, useNavigate } from "react-router-dom";

import { Skeleton } from 'primereact/skeleton';

function AssessmentDetail() {

    const { key:Id } = useParams();
    const history = useNavigate();


    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData')));
    const TOKEN = localStorage.getItem('token');
    const [material, setMaterial] = useState({});
    const [chapters, setChapters] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [queans, setQueans] = useState([]);

    const goToBack = () => window.history.back();

    useEffect(() => {
        setQueans([]);
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
        const currentIndex = assessments.findIndex(item => item._id === currentId);

        // If the current ID is found and it's not the last element
        if (currentIndex !== -1 && currentIndex < assessments.length - 1) {
            // Return the next ID
            return assessments[currentIndex + 1]._id;
        } else {
            // If the current ID is the last one or not found, return null or handle accordingly
            return null;
        }
    }

    const getMaterial = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-assessment/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setMaterial(result.data);
                setChapters(result.other);
                setCompleted((result?.completed?._id?true:false));
                if(result?.completed?.assessment_answer?.length > 0){
                    setQueans(result?.completed?.assessment_answer);
                }

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
        const nextAssessmetId = getNextAssessmentId(Id);



            if(material?.questions?.length !== queans?.length){
                event.target.disabled = false;
                window.showToast("Please complete you assignments question first.",'error');
                return
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "skill": material.skill._id,
                "assessment": Id,
                "type": "assessment",
                'assessment_answer': queans
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

                    if(nextAssessmetId){
                        history('/my-assessment-detail/'+nextAssessmetId);
                    }else{
                        history('/result/'+material.skill._id);
                    }

                }else{
                    window.showToast(result.message,'error');
                    event.target.disabled = false;
                }
            })
            .catch((error) => console.error(error.message));

        /* if(!completed){
        }else{
            event.target.disabled = false;

            if(nextAssessmetId){
                history('/my-assessment-detail/'+nextAssessmetId);
            }else{
                history('/my-skills/'+material.skill._id);
            }

        } */
    }

    /*  */

    const handleChange = (index, obj) => {
        setQueans((prevQueans) => {
            const updatedQueans = [...prevQueans];
            updatedQueans[index] = obj; // Replace or add at the specific index
            return updatedQueans;
        });
    };

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
                                            <div className='chapter_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/assessment/${material.thumbnail}`} alt="" /> </div>
                                        }
                                        <div className='chapter_info'>
                                            <h2 className='chapter_title'> {material.title}</h2>
                                            <p className='chapter_desc' style={{color: '#767676'}}> {material.brief_description}  </p>
                                        </div>
                                    </div>
                                    <div className='chapter_content_block'>
                                        {/* <div className='ccb_img'>  </div> */}
                                        {material.description && <div className='' dangerouslySetInnerHTML={material.description ? { __html: material.description } : undefined}></div>}
                                    </div>
                                </div>

                                {
                                    material?.questions?.map((question, index) => (

                                        <div key={index} className='meterial_quetion_block'>
                                            <h5>Q.{index+1}) {question.question}</h5>
                                            <ul className='materialul'>
                                                {
                                                    question.options.map((option, indexId) =>(
                                                        <li key={indexId}>
                                                            <label key={index} className={`radio-button ${queans?.[index]?.answer === option ? 'selected' : ''}`}>
                                                                <input
                                                                    type="radio"
                                                                    value={option}
                                                                    checked={queans?.[index]?.answer === option}
                                                                    onChange={() => handleChange(index, {
                                                                        question: question.question,
                                                                        answer: option
                                                                    })}
                                                                />
                                                                <span className="radio-button-label">{option}</span>
                                                            </label>
                                                        </li>
                                                    ))
                                                }

                                            </ul>
                                        </div>
                                    ))
                                }

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


export default AssessmentDetail;