import React, {useState, useEffect} from 'react';
import RightArrow from '../../../assets/images/rightArrow.svg';

import u_check from '../../../assets/images/u_check.svg';

import { Link, useParams, useNavigate } from 'react-router-dom';
import backArrow from '../../../assets/images/fi_arrow-left.svg';

import SweetAlert from 'react-bootstrap-sweetalert';
import { Skeleton } from 'primereact/skeleton';
const MemberInfo = () => {

    const TOKEN = localStorage.getItem('token');
    const [childData, setChildData] = useState({});
    const [resume, setResume] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [skills, setSkills] = useState([]);
    const UserId = JSON.parse(localStorage.getItem('userData'))._id;
    const [room, setRoom] = useState("");

    const { key:Id } = useParams();
    const history = useNavigate();

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    useEffect(()=> {
        fetchChild()
        getRoom()
    },[])

    const fetchChild = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/teenager/get/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status == 'success'){
                if(result.data.parents_id !== UserId){
                    window.showToast('Invalid member request!!', "error");
                    history('/dashboard');
                }
                setChildData(result.data);
            }else{
                window.showToast('Invalid member request!!', "error");
                history('/dashboard');
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));


        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setResume(result.data);
                setSkills(result.data.skills);
            }else{
                setResume(false);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

    }

    const deleteUser = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/teenager/delete/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status == 'success'){
                window.showToast(result.message, "success");
                history('/dashboard');
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const getRoom =  () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "user_one": UserId,
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

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>

            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={deleteUser}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                {/* You will not be able to recover your record! */}
            </SweetAlert>

            <div className="add_childs_page member_infomation_page">
                    <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                    <div className='chlid_block member_block mb-3'>
                        <div className='member_img'> {loadingSkeleton ? <Skeleton shape="circle" size="7.5rem" /> : <img src={childData.profile_image} alt=""/> } </div>
                        {loadingSkeleton ? <Skeleton width="50%" height='32px' className='m-auto' />
                        :
                        <p className='member_name'> {childData.first_name+' '+childData.last_name} </p>
                        }
                        {/* <p className='mtime'> Was online 8 minutes ago </p> */}
                    </div>

                    <div className='chlid_block member_menu_block mb-3'>
                        <ul className='member_list_menu'>
                           {resume && <li className="">
                                <Link to={`/member-details/${Id}`} className='mlink'>
                                    {loadingSkeleton ? <Skeleton width="50%" />
                                    :
                                    <span>Details</span>
                                    }
                                    {loadingSkeleton ? <Skeleton width="20px" height='20px' /> :
                                    <span className='arrow'> <img src={RightArrow} alt=""/> </span>}
                                </Link>
                            </li>}
                            <li  className="">
                                <Link to={`/chat?room=${room}`} className='mlink'>
                                    {loadingSkeleton ? <Skeleton width="50%" />
                                    :
                                        <span>Messages</span>
                                    }
                                    {loadingSkeleton ? <Skeleton width="20px" height='20px' /> :
                                    <span className='arrow'><img src={RightArrow} alt=""/></span>}
                                </Link>
                            </li>
                            <li className="">
                                <Link className='mlink' onClick={()=>{setShowAlert(true)}}>
                                    {loadingSkeleton ? <Skeleton width="50%" />
                                    :
                                    <span className='deletem'>Delete family member</span>
                                    }
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {skills.length > 0 && <div className='chlid_block  mb-3'>
                        <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Top Skills" } </h1>
                        <div className='dlist_block'>
                            <ul>
                                {skills && skills.map((section, index) => (
                                    loadingSkeleton ?
                                    <li key={index}>
                                        <Skeleton width="125px" height='36px' className={index % 2 === 0 ? 'even' : 'odd'} />
                                    </li>
                                    :
                                    <li key={index}>
                                        {section.image && <img src={section.image} alt="" />}
                                        <span>{section.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>}

                    {resume && <div className='chlid_block  mb-3'>
                        <h1 className="d_title">{loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Analytics" }  </h1>
                        <ul className="analyics_ul">

                            {/* {resume?.personal_detail_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Personal details” completed </p> }
                            </li>} */}

                           {resume?.objective_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Personal Summary” completed </p> }
                            </li>}

                            {resume?.job_prefernces_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Job preferences” completed </p> }
                            </li>}


                            {resume?.work_experience_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Work experience” completed </p> }
                            </li>}


                            {resume?.education_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Education” completed </p> }
                            </li>}

                            {resume?.awards_achievments_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Awards and Achievements” completed </p> }
                            </li>}


                            {resume?.certification_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Certifications and Training” completed </p> }
                            </li>}

                            {resume?.extracurricular_activities?.length > 0 && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'>Section “Extracurricular Activities” completed </p> }
                            </li>}

                            {resume?.volunteer_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'>Section “Volunteer Experience” completed </p> }
                            </li>}

                            {resume?.hobbies_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'>Section “Hobbies and Interests” completed </p> }
                            </li>}

                            {resume?.references_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “References” completed </p> }
                            </li>}

                            {resume?.personality_assessment_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Personality Assessment” completed </p> }
                            </li>}

                            {resume?.skills_complete_status && <li className=''>
                                <div className='icon'> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={u_check} alt="" /> } </div>
                                {loadingSkeleton ? <Skeleton width="70%" /> :
                                <p className='content mb-0'> Section “Skills” completed </p> }
                            </li>}

                        </ul>
                    </div>}

            </div>
        </>
    );
};

export default MemberInfo;
