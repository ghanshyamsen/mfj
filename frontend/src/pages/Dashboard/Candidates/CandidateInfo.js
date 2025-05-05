import React, {useState, useEffect} from "react";

import Copy from '../../../assets/images/u_copy-alt.svg';
import Send from '../../../assets/images/fi_send.svg';
import phone from '../../../assets/images/u_phone-color.svg';
import BookMarkNormal from '../../../assets/images/bookmark_normal.png';
import BookMark from '../../../assets/images/bookmark.png';

import { Dropdown } from 'primereact/dropdown';

import { useParams, Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useProfile } from '../../../ProfileContext';
import { Rating } from 'primereact/rating';

import { Skeleton } from 'primereact/skeleton';

import { useOnlineUsers } from '../../../OnlineUsersContext';

import backArrow from '../../../assets/images/fi_arrow-left.svg';

import Badges from '../Badges';

function CandidateInfo() {

    const [candidate, setCandidate] = useState({});
    const [loading, setLoading] = useState(false);
    const TOKEN = localStorage.getItem('token');
    const {key:Id, job:jobId} = useParams();
    const [bookmark, setBookmark] = useState(BookMarkNormal);
    const [isBoomark, setIsBookmark] = useState(false);
    const User = JSON.parse(localStorage.getItem('userData'));
    const UserId = (User.user_type==='subuser')?User.admin_id:User._id;
    const Role = (User.user_type==='subuser')?JSON.parse(User.role).hire:true;

    const onlineUsers = useOnlineUsers();
    const isUserOnline = onlineUsers.hasOwnProperty(Id);

    const {theme} = useProfile();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [review, setReview] = useState({
        rating:null,
        review:""
    });

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [appliedInfo, setAppliedInfo] = useState({});
    const status = [
        { name: 'Hired', code: 'Invited' },
        { name: 'Not Hired', code: 'Refused' }
    ];

    const [error, setError] = useState("");
    const [room, setRoom] = useState("");

    const handleCloseModal = () => {
        setShowReviewModal(false);
    };

    const handleChange = (e) => {
        if(review.rating === e.target.value){
            e.target.value = null;
        }
        setReview({...review, [e.target.name]:e.target.value});
    }

    var reviewGiven = true;
    const handleReviews = () => {

        if(!review.rating){
            setError("Review rating is required.");
            return
        }
        setError("");

        if(reviewGiven){
            reviewGiven = false;
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const URL = (review._id?`${process.env.REACT_APP_API_URL}/app/update-review-of-candidate/${review._id}`:`${process.env.REACT_APP_API_URL}/app/review-to-candidate`);
            const METHOD = (review._id?"PATCH":"POST");

            const raw = JSON.stringify({
                "job_id": jobId,
                "employer_id": UserId,
                "candidate_id": Id,
                "rating": review.rating,
                "review": review.review
            });

            const requestOptions = {
                method: METHOD,
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(URL, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    handleCloseModal();
                    setReview(result.data);
                    window.showToast(result.message, "success");
                    reviewGiven = true;
                }else{
                    window.showToast(result.message, "error");
                }
            })
            .catch((error) => console.error(error.message));
        }

    }

    const img = document.getElementById('dynamicImg');

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setCandidate(result.data);
                setLoading(true);
            }else{
                window.history.back();
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        fetch(`${process.env.REACT_APP_API_URL}/app/get-save-candidate/${UserId}/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                if(result.data){
                    setBookmark(BookMark);
                    setIsBookmark(result.data);
                }
            }else{
                window.history.back();
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        if(jobId){
            fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?job=${jobId}&user=${Id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.data){
                    setAppliedInfo(result.data);
                    setSelectedStatus({
                        name: (result.data.status === 'Invited'?'Hired':(result.data.status ==='Pending'?'In Review':'Not Hired')),
                        code: result.data.status
                    });
                    // setSelectedStatus(result.data.status);
                }else{
                    window.history.back();
                    window.showToast(result.message, 'error');
                }
            })
            .catch((error) => console.error(error.message))

            fetch(`${process.env.REACT_APP_API_URL}/app/get-review-of-candidate?job=${jobId}&employer=${UserId}&candidate=${Id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status && result.data.length > 0){
                    setReview(result.data[0]);
                }
            })
            .catch((error) => console.error(error));
        }

        getRoom();
    },[])

    const handleBookmark = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        if(!isBoomark){

            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "user_id": UserId,
                "candidate_id": Id
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/save-candidates`, requestOptions)
            .then((response) => response.json())
            .then((result) =>{
                if(result.status){
                    setBookmark(BookMark);
                    setIsBookmark(result.data);

                    if(bookmark === BookMark){
                        if (img) {
                            img.className = "bookmark_img";
                        }
                    }
                }
            })
            .catch((error) => console.error(error.message))
            .finally(() => setLoadingSkeleton(false));
        }else{

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/delete-candidates/${isBoomark._id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setBookmark(BookMarkNormal);
                    setIsBookmark(false);
                    if(bookmark === BookMarkNormal){
                        img.className = "";
                    }
                }
            })
            .catch((error) => console.error(error.message))
            .finally(() => setLoadingSkeleton(false));
        }
    };

    const copyToClipboardFallback = (text) => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          window.showToast('Location copied', 'success');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
    };

    const handleStatus = (e) => {

        setSelectedStatus(e.value)

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization",  `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "status": e.value.code
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-applied-job/${appliedInfo._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast("Application status updated successfully.", "success");
                RecordAnalyticsHandler(`employer_changed_status_${e.value.code?.toLowerCase()}`);
            }else{
                window.showToast(result.message, "error");
            }
        })
        .catch((error) => console.error(error.message));
    }

    const deleteReview = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-review-of-candidate/${review._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setReview({
                    rating:null,
                    review:""
                })
                window.showToast(result.message,"success");
                handleCloseModal();
            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error.message));
    }

    const getRoom =  () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "user_one": User._id,
            "user_two": Id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/chat/get-room`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setRoom(result.room);
            }
        })
        .catch((error) => console.error(error));
    }

    const RecordAnalyticsHandler = (action) => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "employer_id": UserId,
            "job_id": jobId,
            "candidate_id": Id,
            "type_of_action":action
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/post-clicks`, requestOptions)
        .then((response) => response.json())
        .then((result) => { })
        .catch((error) => console.error(error.status));
    }

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            {loading && <div className="common_background_block candidates_info_page member_infomation_page">
                <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                <div className="common_card">



                   {Role && appliedInfo?._id && <div className="status_dropdown_block">
                        <label className="d-block">  {loadingSkeleton ? <Skeleton width="50%" /> : 'Applicant Status' }  </label>
                        {loadingSkeleton ? <Skeleton width="100%" height="34px" /> :
                            <Dropdown value={selectedStatus} onChange={handleStatus} options={status} optionLabel="name" optionValue="code"  placeholder="In Review" className="status_dropdown" />
                        }
                    </div>}

                    <div className="c_info">
                        <div className="bookmark"> {loadingSkeleton ? <Skeleton width="100%" height="30px" className="m-auto" /> : <img className="" id="dynamicImg" src={bookmark} alt="" onClick={handleBookmark} /> } </div>
                        <div className="candidate_img">
                        {loadingSkeleton ? <Skeleton shape="circle" size="100%" />  :
                         <img src={candidate.user_info.image} alt="" />
                        }
                        </div>
                        {loadingSkeleton ? <Skeleton width="30%" className="m-auto" />  :
                            <p className="candi_name">  {candidate.user_info.first_name} {candidate.user_info.last_name} </p>
                        }
                        {isUserOnline && <span className="status"> online </span>}
                    </div>
                </div>

                {/*  */}
                <div className="common_card contact_info">
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="100%" height="32px" /> : "Contact Information" } </h1>
                    <div className='review_box'>
                        <div className='review_content'>
                            {loadingSkeleton ?<Skeleton width="100%" className="mb-1" /> :
                                <p className='que'> Phone number </p>
                            }
                            {loadingSkeleton ? <Skeleton width="100%" /> :
                                <p className='ans'> {candidate.user_info.phone_number} </p>
                            }
                        </div>
                        <Link to={`callto:${candidate.user_info.phone_number}`} className='edit_btn'> {loadingSkeleton ? <Skeleton width="100%" height="100%" /> : <img src={phone} alt="" /> } </Link>
                    </div>
                    <div className='review_box'>
                        <div className='review_content'>
                            {loadingSkeleton ?<Skeleton width="100%" className="mb-1" /> :
                            <p className='que'> Email </p> }
                            {loadingSkeleton ?<Skeleton width="100%" /> :
                                <p className='ans'> {candidate.user_info.email} </p>
                            }
                        </div>
                        <Link to={`mailto:${candidate.user_info.email}`} className='edit_btn'>
                            {loadingSkeleton ? <Skeleton width="100%" height="100%" /> : <img src={Send} alt="" />}
                        </Link>
                    </div>
                    <div className='review_box'>
                        <div className='review_content'>
                            {loadingSkeleton ?<Skeleton width="100%" className="mb-1" /> :
                                <p className='que'> Address </p>
                            }
                            {loadingSkeleton ? <Skeleton width="100%" /> :
                                <p className='ans'> {candidate.user_info.location} </p>
                            }
                        </div>
                        <button className='edit_btn' type='button' onClick={()=>{copyToClipboardFallback(candidate.user_info.location)}}>
                            {loadingSkeleton ? <Skeleton width="100%" height="100%" /> : <img src={Copy} alt="" /> }
                        </button>
                    </div>

                    {loadingSkeleton ?
                        <Skeleton width="100%" height="56px" className="sk_btn" />
                        :
                        (jobId && <button type="submit" className="btn submit_btn mb-0" onClick={(e) => setShowReviewModal(true)}> Review </button>)
                    }
                    <Link to={`/chat?room=${room}`} className="btn submit_btn"> Message </Link>


                    {candidate.resume_theame && <Link to={`/resume/${candidate.resume_theame}/${Id}`} className="btn black_common_btn"> Open PDF resume </Link>}

                </div>

                <Badges id={Id} />
                {/*  */}
               {appliedInfo.cover_letter &&  <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" className="mb-3" /> : "Cover letter" } </h1>
                    <div className="info_box">
                        {loadingSkeleton ?<Skeleton width="100%" className="mb-0" /> :
                            <p className="m-text"> {appliedInfo.cover_letter} </p>
                        }
                    </div>
                </div>}
                {/*  */}
                {candidate.objective_complete_status && <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Description" } </h1>
                    <div className="info_box">
                        {loadingSkeleton ?<Skeleton width="100%" className="mb-0" /> :
                            <p className="m-text"> {candidate.objective_summary} </p>
                        }
                    </div>
                </div>}

                {/*  */}
                {candidate.work_experience.length > 0 && <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Work Experience" } </h1>
                    {
                        candidate.work_experience.map((work, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="80%" height="24px" className="mb-1" /> </h6>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='m-text'> <Skeleton width="50%" height="20px"  /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{work.title}</h6>
                                <p className='m-text'> {work.company_name} </p>
                                <p className='d-text'> {window.formatDate(work.start_date)} - {work.end_date?window.formatDate(work.end_date):'Present'} </p>
                                <p className='m-text'> {work.description}</p>
                                <p className='m-text'> Supervisor: {work.first_name} {work.last_name} </p>
                                <p className='d-text'>{work.phone_number} / {work.email}</p>
                            </div>
                        ))
                    }
                </div>}

                {/*  */}
                {candidate.education.length > 0 && <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Education" } </h1>
                    {
                        candidate.education.map((education, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="80%" height="24px" className="mb-1" /> </h6>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='m-text'> <Skeleton width="50%" height="20px"  /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{education.school_name}</h6>
                                <p className='m-text'> {education.college_degree} </p>
                                <p className='m-text'> {education.study_field} </p>
                                <p className='d-text'> {window.formatDate(education.graduation_start_year)} - {education.graduation_end_year?window.formatDate(education.graduation_end_year):'Present'} </p>
                                <p className='m-text'> Grade {education.gpa}</p>
                                <p className='m-text'> {education.education_description} </p>
                            </div>
                        ))
                    }
                </div>}

                {/*  */}
                {candidate.volunteer_experience.length > 0 && <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Volunteer experience" } </h1>
                    {
                        candidate.volunteer_experience.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="80%" height="24px" className="mb-1" /> </h6>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='m-text'> <Skeleton width="50%" height="20px"  /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{value.organizationname}</h6>
                                <p className='m-text'>{value.responsibilities}</p>
                                <p className='d-text'>{window.formatDate(value.startdate)}  {value.enddate?`- ${window.formatDate(value.enddate)}`:''} {value.totalhours?'• '+value.totalhours+' Hours':''}</p>
                                <p className='m-text'>{value.accomplishments}</p>
                                <p className='m-text'>{value.rewardingaspect}</p>
                                <p className='m-text'>Supervisor: {value.firstname} {value.lastname}</p>
                                <p className='d-text'>{value.phonenumber} / {value.email}</p>
                            </div>
                        ))
                    }
                </div>}

                {/*  */}
                {candidate.certification.length > 0 && <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Licenses & Certifications" } </h1>
                    {
                        candidate.certification.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="80%" height="24px" className="mb-1" /> </h6>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{value.certification_name}</h6>
                                <p className='m-text'> {value.institution} • {window.formatDate(value.issue_date)} {value.expiry_date && ' -'+window.formatDate(value.expiry_date)} </p>
                                {value.credential_id && <p className='d-text'> Certificate Number {value.credential_id} </p>}
                                {value.credential_url && <p className='d-text'> URL {value.credential_url} </p>}
                            </div>
                        ))
                    }
                </div>}

                {/*  */}
                {candidate.awards_achievments.length > 0 && <div className='common_card '>
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Awards and Achievements" } </h1>
                    {
                        candidate.awards_achievments.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="80%" height="24px" className="mb-1" /> </h6>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{value.certification_name}</h6>
                                <p className='m-text'>{value.awarding_organization} • {window.formatDate(value.date_received)} </p>
                                <p className='d-text'> {value.brief_description} </p>
                            </div>
                        ))
                    }
                </div>}

                {/*  */}
                {candidate.references.length > 0 &&  <div className='common_card'>
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "References" } </h1>
                    {
                        candidate.references.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="80%" height="24px" className="mb-1" /> </h6>
                                <div className='m-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                                <div className='d-text'> <Skeleton width="50%" height="20px" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{value.first_name} {value.last_name} </h6>
                                <p className='m-text'> {value.organization} </p>
                                <p className='d-text'> {value.phone_number} </p>
                                <p className='d-text'> {value.email} </p>
                            </div>
                        ))
                    }
                </div>}

                {/*  */}
                {candidate.skills.length > 0 && <div className='common_card'>
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Top Skills" } </h1>
                    <div className='dlist_block'>
                        <ul>
                            {
                                candidate.skills.map((section, index) => (
                                    loadingSkeleton ?
                                    <li key={index}> <Skeleton width="200px" height="36px" /> </li>
                                    :
                                    <li key={index}>
                                        {section.image && <img src={section.image} alt="" />}
                                        <span>{section.name}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>}

                {/*  */}
                {candidate.hobbies.length > 0  && <div className='common_card'>
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Hobbies" } </h1>
                    <div className='dlist_block'>
                        <ul>
                            {candidate.hobbies.map((section, index) => (
                                loadingSkeleton ?
                                <li key={index}><Skeleton width="200px" height="36px" /> </li>
                                :
                                <li key={index}>
                                    {section.image && <img src={section.image} alt="" />}
                                    <span>{section.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}

                {/*  */}
                {candidate.extracurricular_activities.length > 0 && <div className='common_card'>
                    <h1 className="d_title"> {loadingSkeleton ?<Skeleton width="100%" height="32px" className="mb-3" /> : "Extracurricular Activities"} </h1>
                    <div className='dlist_block'>
                        <ul>
                            {candidate.extracurricular_activities.map((section, index) => (
                                loadingSkeleton ?
                                <li key={index}><Skeleton width="200px" height="36px" /> </li>
                                :
                                <li key={index}>
                                    {section.image && <img src={section.image} alt="" />}
                                    <span>{section.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}

                {/*  */}
            </div>}

            {/*  */}
            <Modal className={`report_modals ${theme}`} show={showReviewModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'> Review </h1>
                </Modal.Header>
                <Modal.Body>
                <div className='report_modal_content'>
                    <form>
                        <div className='star_rating_view'>
                            <Rating value={review.rating||null} name="rating" onChange={handleChange} cancel={false} />
                        </div>
                        <FloatingLabel controlId="floatineducation" label={<span> Description </span>} className="mt-3 mb-4">
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="review"
                                value={review.review}
                                onChange={handleChange}
                                maxLength="300"
                                placeholder=""
                            />
                            {error && <small style={{color:"red"}}>{error}</small>}
                            <p className="phone_Text"> {review.review.length}/300 </p>
                        </FloatingLabel>
                        <div className='btn_block'>
                            {review._id && <button className='btn report_btn back-button mdelete_btn mb-0' type='button' onClick={deleteReview}> Delete </button>}
                            <button className='btn submit_btn mb-0' type='button'  onClick={handleReviews}>Save</button>
                        </div>
                    </form>
                </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CandidateInfo;