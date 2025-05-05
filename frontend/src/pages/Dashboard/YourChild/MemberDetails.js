import React, {useState, useEffect}  from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import Badges from '../Badges';

const MemberDetails = () => {

    const TOKEN = localStorage.getItem('token');
    const [childData, setChildData] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const UserId = JSON.parse(localStorage.getItem('userData'))._id;

    const { key:Id } = useParams();
    const history = useNavigate();


    useEffect(()=> {
        fetchChild()
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

                setChildData(result.data);
                setLoading(true);
            }else{
                window.showToast("Your child information not setup currently.");
                history('/dashboard');
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            {loading && <div className="add_childs_page member_infomation_page">
                <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Contact Information" } </h1>
                    <div className='info'>
                        {childData.user_info.phone_number && <div className='info_form'>
                                {loadingSkeleton ? <Skeleton width="50%" className='mb-1' /> :
                                    <label>Phone number</label>
                                }
                                {loadingSkeleton ? <Skeleton width="50%" /> :
                                    <p className='mb-0'>{childData.user_info.phone_number||''}</p>
                                }
                        </div>}
                        {childData.user_info.email && <div className='info_form'>
                            {loadingSkeleton ? <Skeleton width="50%" className='mb-1' /> :
                                <label>Email</label>
                            }
                            {loadingSkeleton ? <Skeleton width="50%" /> :
                                <p className='mb-0'>{childData.user_info.email||''}</p>
                            }
                        </div>}
                        {childData.user_info.location && <div className='info_form'>
                            {loadingSkeleton ? <Skeleton width="50%" className='mb-1' /> :
                                <label>Address</label>
                            }
                            {loadingSkeleton ? <Skeleton width="50%" /> :
                                <p className='mb-0'>{childData.user_info.location||''}</p>
                            }
                        </div>}
                    </div>
                </div>


                <Badges id={Id} />

                {childData.objective_summary && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Description" } </h1>
                    <div className='info_form'>
                        {loadingSkeleton ? <Skeleton width="50%" className='mb-1' /> :
                            <label>About me</label>
                        }
                        {loadingSkeleton ? <Skeleton width="50%" /> :
                            <p className='mb-0'>{childData.objective_summary}</p>
                        }
                    </div>
                </div>}

                {childData.work_experience.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Work Experience" } </h1>
                    {
                        childData.work_experience.map((work, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'><Skeleton width="70%" height='24px' />  </h6>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='d-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
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

                {childData.education.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Education" } </h1>
                    {
                        childData.education.map((education, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'><Skeleton width="70%" height='24px' />  </h6>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='d-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
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

                {childData.volunteer_experience.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Volunteer Experience" } </h1>
                    {
                        childData.volunteer_experience.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'><Skeleton width="70%" height='24px' />  </h6>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='d-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='m-text'> <Skeleton width="100%" /> </div>
                                <div className='d-text'> <Skeleton width="100%" /> </div>
                            </div>
                            :
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'>{value.organizationname}</h6>
                                <p className='m-text'>{value.responsibilities}</p>
                                <p className='d-text'>{window.formatDate(value.startdate)} - {window.formatDate(value.enddate)} • {value.totalhours} Hours</p>
                                <p className='m-text'>{value.accomplishments}</p>
                                <p className='m-text'>{value.rewardingaspect}</p>
                                <p className='m-text'>Supervisor: {value.firstname} {value.lastname}</p>
                                <p className='d-text'>{value.phonenumber} / {value.email}</p>
                            </div>
                        ))
                    }
                </div>}

                {childData.certification.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Licenses & Certifications" } </h1>
                    {
                        childData.certification.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="70%" height='24px' />  </h6>
                                <div className='m-text'> <Skeleton width="100%" />  </div>
                                <div className='d-text'><Skeleton width="100%" />  </div>
                                <div className='d-text'> <Skeleton width="100%" />  </div>
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

                {childData.awards_achievments.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Awards and Achievements" } </h1>
                    {
                        childData.awards_achievments.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="70%" height='24px' />  </h6>
                                <div className='m-text'> <Skeleton width="100%" />  </div>
                                <div className='d-text'><Skeleton width="100%" />  </div>
                                <div className='d-text'> <Skeleton width="100%" />  </div>
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

                {childData.references.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "References" } </h1>
                    {
                        childData.references.map((value, index) => (
                            loadingSkeleton ?
                            <div className='info_box' key={index}>
                                <h6 className='sub_title'> <Skeleton width="70%" height='24px' />  </h6>
                                <div className='m-text'> <Skeleton width="100%" />  </div>
                                <div className='d-text'><Skeleton width="100%" />  </div>
                                <div className='d-text'> <Skeleton width="100%" />  </div>
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

                {childData.hobbies.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Hobbies" } </h1>
                    <div className='dlist_block'>
                        <ul>
                            {childData.hobbies.map((section, index) => (
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

                {childData.extracurricular_activities.length > 0 && <div className='chlid_block mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : "Extracurricular Activities" } </h1>
                    <div className='dlist_block'>
                        <ul>
                            {childData.extracurricular_activities.map((section, index) => (
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

            </div>}
        </>
    );
};

export default MemberDetails;
