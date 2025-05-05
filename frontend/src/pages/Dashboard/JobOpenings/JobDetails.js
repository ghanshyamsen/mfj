import React, {useState, useEffect} from "react";
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

function JobDetails() {

    const {key:Id} = useParams();
    const history = useNavigate();
    const TOKEN = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userData'));
    const userId = (user.user_type==='subuser')?user.admin_id:user._id;
    const Roles = JSON.parse(localStorage.getItem('Roles'));

    const [job, setJob] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [candidates, setCandidates] = useState([]);


    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: for smooth scrolling
        });

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        if(Id){

            fetch(`${process.env.REACT_APP_API_URL}/app/get-company-jobs/${Id}?user=${userId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setJob(result.data);
                }else{
                    window.showToast("Invalid job request.","error");
                    history('/jobs');
                }
            })
            .catch((error) => console.error(error.message));

            fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?job=${Id}&limit=5`, requestOptions)
            .then((response) => response.json())
            .then((result) =>  {
                if(result.status){
                    if(result.data.length > 0){
                        setCandidates(() => {
                            return result.data.filter(job => job.user_info.image).map(job => job.user_info.image);
                        });
                    }else{
                        // window.showToast(result.message,"error");
                        // history('/jobs');
                    }
                }else{
                    window.showToast(result.message,"error");
                }
            })
            .catch((error) => console.error(error.message));

        }else{
            window.showToast("Invalid job request.","error");
            history('/jobs');
        }
    },[]);

    const handleBack = () => {
        window.history.back();
    };

    const deleteJob = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-job/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message,"success");
                history('/jobs');
            }
        })
        .catch((error) => console.error(error.message));
    }

    const jobOpenClosed = (status,reopen=false) => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        var URL = `${process.env.REACT_APP_API_URL}/app/update-job/${Id}`;
        var METHOD = "PATCH";

        const raw = JSON.stringify({
            job_status:status
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
                window.showToast((result.data.job_status?(reopen?"Job reopened successfully.":"Job posted successfully."):"Job closed successfully."),"success");
                history('/jobs');
            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error.message));
    }

    const matching_preferences = {
        job_types: {
          label: "Job Title and Job Types",
        },
        location: {
          label: "Location",
        },
        soft_skill: {
          label: "Soft Skills",
        },
        schedule: {
          label: "Schedule Compatibility",
        },
        age_requirement: {
          label: "Candidate Minimum Age Requirement (18+)",
        },
        personality_match: {
          label: "Personality Match (Innovative)",
        },
    };



    return(
        <>
            <SweetAlert
                show={showAlert}
                //warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Delete job post?"
                onConfirm={deleteJob}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                {job?.job_status && 'You will lose all candidates'}
            </SweetAlert>

            <SweetAlert
                show={showAlert2}
                //warning
                showCancel
                confirmBtnText="Close"
                confirmBtnBsStyle="danger"
                title="Close job post?"
                onConfirm={() => jobOpenClosed(false)}
                onCancel={() => setShowAlert2(false)}
                focusCancelBtn
            >
                You can always reopen it
            </SweetAlert>

            <div className="job_review_page common_background_block company_job_openings_page">

                <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                {((Roles?.view_applicants && user.user_type==='subuser') || user.user_type!=='subuser') && Id && job.job_status && <div className='jobopening_job common_card mb-3'>
                    <div className='matched_block'>
                        {candidates.length > 0 && <div className='matched_img'>
                            {
                                candidates.map((image, index) => <img key={index} src={image} alt=""/>)
                            }
                        </div>}

                        <h2 className='match_title'> Candidates are waiting </h2>
                        <p className='match_text'> Find out who has already applied for this job </p>
                        <Link to={`/candidates/${Id}`} className='btn get_btn'> See candidates </Link>
                    </div>
                </div>}

                <div className="common_card mb-3">
                    {/* General Information */}
                    <div className="review_data pb-0">
                        <h2 className="sub_title"> General Information </h2>
                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Title </p>
                                <p className="ans"> {job?.job_position} </p>
                            </div>
                        </div>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Job Type </p>
                                <p className="ans"> {job?.job_type} </p>
                            </div>
                        </div>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Location Type </p>
                                <p className="ans"> {job?.job_location_type} </p>
                            </div>
                        </div>

                        {(job?.job_location_type === 'In-person at a precise location' || job?.job_location_type === 'In-person within a limited area') &&
                            <>
                                <div className="review_box">
                                    <div className="review_content">
                                        <p className="que"> Location </p>
                                        <p className="ans"> {job?.location} </p>
                                    </div>
                                </div>

                                <div className="review_box">
                                    <div className="review_content">
                                        <p className="que"> Geo-location matching (e.g., within 30 miles). </p>
                                        <p className="ans"> {job?.location_miles||'Anywhere from the location'} </p>
                                    </div>
                                </div>
                            </>
                        }

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Work Authorization </p>
                                <p className="ans"> {job?.work_authorization} </p>
                            </div>
                        </div>

                        {job?.work_authorization === 'Yes' && <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Work Authorization Requirement </p>
                                <p className="ans"> {job?.work_authorization_requirement} </p>
                            </div>
                        </div>}
                    </div>

                    {/* Job Details */}
                    <div className="review_data pb-0">
                        <h2 className="sub_title"> Job Details </h2>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Experience Level </p>
                                <p className="ans"> {job?.job_experience_level} </p>
                            </div>
                        </div>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Education Level </p>
                                <p className="ans"> {job?.education_level||'N/A'} </p>
                            </div>
                        </div>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Top 5 Preferred Skills </p>
                                <p className="ans"> {job?.required_skills?.join(', ')||'N/A'}  </p>
                            </div>
                        </div>
                        <p className="phone_Text">This information is used to calculate the matching percentage of applied candidates based on the comparison of their skills and qualifications.</p>


                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Certifications </p>
                                <p className="ans"> {job?.other_preferences||'N/A'} </p>
                            </div>
                        </div>



                        {/* {   Array.isArray(job?.weekly_day_range) && job?.weekly_day_range.some(val => val.toLowerCase() === 'other') &&
                            <div className="review_box">
                                <div className="review_content">
                                    <p className="que"> Other Weekly Day </p>
                                    <p className="ans">  {job?.weekly_day_range_other}  </p>
                                </div>
                            </div>
                        } */}



                        {/* { job?.expected_hours === 'Range' &&
                            <div className="review_box">
                                <div className="review_content">
                                    <p className="ans"> <span> Min Hours :</span> {job?.expected_min_hour} </p>
                                    <p className="ans"> <span> Max Hours :</span> {job?.expected_max_hour} </p>
                                </div>
                            </div>
                        }

                        { job?.expected_hours === 'Fixed Hours' &&
                            <div className="review_box">
                                <div className="review_content">
                                    <p className="ans"> <span> Fixed Hours :</span> {job?.expected_min_hour} </p>
                                </div>
                            </div>
                        } */}
                    </div>


                    <div className="review_data pb-0">
                        <h2 className="sub_title"> Schedule Compatibility </h2>


                        <div className="review_box">
                            <div className="review_content">
                                <p className="que">Days required for the role </p>
                                <p className="ans">  {job?.weekly_day_range?.join(', ')}  </p>
                            </div>
                        </div>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Shift Type </p>
                                <p className="ans">  {job?.shift_time?.join(', ')}  </p>
                            </div>
                        </div>

                        {Array.isArray(job?.shift_time) && job?.shift_time.some(val => val.toLowerCase() === 'other') && <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Shift Type Description </p>
                                <p className="ans">  {job?.other_shift_time}  </p>
                            </div>
                        </div>}

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Expected Weekly Hours </p>
                                <p className="ans">  {job?.expected_hours?.join(', ')}  </p>
                            </div>
                        </div>
                    </div>
                    {/* Pay Structure */}
                    <div className="review_data pb-0">
                        <h2 className="sub_title"> Pay Structure </h2>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Pay Type </p>
                                <p className="ans"> {job?.job_pay_type} </p>
                            </div>
                        </div>

                        {
                            job?.job_pay_type === 'Other' && <div className="review_box">
                                <div className="review_content">
                                    <p className="que"> Pay Other </p>
                                    <p className="ans"> {job?.job_pay_type_other} </p>
                                </div>
                            </div>
                        }

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Pay Frequency </p>
                                <p className="ans">  {job?.job_pay_frequency}  </p>
                            </div>
                        </div>

                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Benefits </p>
                                <p className="ans"> {job?.job_benefits?.join(', ') || 'N/A'}</p>
                            </div>
                        </div>

                        {Array.isArray(job?.job_benefits) && job?.job_benefits.some(val => val.toLowerCase() === 'other') &&
                            <div className="review_box">
                                <div className="review_content">
                                    <p className="que"> Other Benefits </p>
                                    <p className="ans"> {job?.job_benefits_other}</p>
                                </div>
                            </div>
                        }


                    </div>
                    {/* Pay Range */}
                    <div className="review_data pb-0">
                        <h2 className="sub_title"> Pay Range </h2>
                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Enter minimum and maximum pay (if applicable) </p>
                                <p className="ans"> <span>$ Min :</span> {job?.job_min_amount||'N/A'} </p>
                                <p className="ans"> <span>$ Max :</span> {job?.job_max_amount||'N/A'} </p>
                            </div>
                        </div>
                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Indicate whether pay is competitive </p>
                                <p className="ans"> {job?.pay_is_competitive} </p>
                            </div>
                        </div>
                    </div>
                    {/* Job Description */}
                    <div className="review_data pb-0">
                        <h2 className="sub_title"> Job Description </h2>
                        <div className="review_box">
                            <div className="review_content">
                                <p className="que"> Description </p>
                                <p className="ans"> {job?.job_description} </p>
                            </div>
                        </div>
                    </div>
                    {/* Job Preferences */}
                    <div className="review_data pb-0">
                        <h2 className="sub_title"> Candidate Matching Preferences: </h2>

                        {job?.matching_preferences &&  Object.entries(matching_preferences).map(([key, preference]) => {
                            const dynamicPreference = job?.matching_preferences?.[key];
                            return dynamicPreference.checked && (
                                <div className="cmp_block" key={key}>
                                    <div className="cmp_box">
                                        <label className="checkbox">
                                            {preference.label}
                                        </label>

                                        <div className="job_per">
                                            <span>{dynamicPreference.percent} %</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

               {((Roles?.edit_job_position && user.user_type==='subuser') || user.user_type!=='subuser') && <div className='jobopening_job common_card mb-3'>
                    <Link to={`/post-job/${Id}`} className='btn submit_btn mb-0 mt-0'> Edit</Link>
                    {job?.job_status && <button type="button" className="btn submit_btn mt-3 mb-0" onClick={() => setShowAlert2(true)}>Close Job Posting</button>}
                    {!job?.job_status && <button type="button" className="btn submit_btn mt-3 mb-0" onClick={() => jobOpenClosed(true,true)}>Reopen Job Posting</button>}
                    <button type="button" className="btn black_common_btn mt-3 mb-0" onClick={()=>{setShowAlert(true)}}> Delete </button>
                </div>}
            </div>
        </>
    )
}

export default JobDetails;