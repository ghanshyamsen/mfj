import React, { useState, useEffect } from 'react';
import Dots from '../../../assets/images/dots.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import Copy from '../../../assets/images/u_copy.png';
import Megaphone from '../../../assets/images/megaphone.png';
import Star from '../../../assets/images/star.png';
import { Modal } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Lamp from '../../../assets/images/Lamp.png';
import Refresh from '../../../assets/images/refresh.png';
import { useProfile } from '../../../ProfileContext';
import { Rating } from 'primereact/rating';
import { useParams, useNavigate, Link  } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import Coin from '../../../assets/images/coin.png'
import PurchaseModel from '../../../BuyCreditModal'

const CustomCheckbox = ({ checked, onChange, label }) => {
    return (
      <label className="custom-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="custom-checkmark"></span>
        {label}
      </label>
    );
};

const JobDetail = () => {

    const {key:Id} = useParams();

    const history = useNavigate();
    const TOKEN = localStorage.getItem('token');
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData'))); /* setUser */

    const personality_assessment = localStorage.getItem('personality_assessment') === 'true';

    const {theme} = useProfile();
    const [showModal, setShowModal] = useState(false);
    const [coverModal, setCoverModal] = useState(false);
    const [coverPlanModal, setCoverPlanModal] = useState(false);
    const [coverLetterModal, setCoverLetterModal] = useState(false);
    const [coverLetterQuestionnaireModal, setCoverLetterQuestionnaireModal] = useState(false);
    const [job, setJob] = useState({});
    const [loading, setLoading] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [error, setError] = useState("");
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [value, setValue] = useState(null);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [reportData, setReportData] = useState({
        report_reason:[],
        report_reason_description:""
    });
    const [details, setDetails] = useState("");
    const [questionnaire, setQuestionnaire] = useState({
        q_one:"",
        q_two:"",
        q_three:"",
        q_four:"",
        q_five:"",
        q_six:""
    });
    const [reviewerror, setReviewError] = useState("");
    const [review, setReview]   = useState({
        rating:null,
        review:""
    });
    const [letterLoading, setLetterLoading] = useState(false);
    const [checkboxes, setCheckboxes] = useState([
        { id: 'Inappropriate Content', label: 'Inappropriate Content', checked: false },
        { id: 'Expired Job Posting', label: 'Expired Job Posting', checked: false },
        { id: 'Spam Job Posting', label: 'Spam Job Posting', checked: false },
        { id: 'Duplicate Job Posting', label: 'Duplicate Job Posting', checked: false },
        { id: 'Inaccurate Job Details', label: 'Inaccurate Job Details', checked: false },
        { id: 'Unresponsive Employer', label: 'Unresponsive Employer', checked: false }
    ]);

    const [resume, setResume] = useState({});
    const [plans, setPlans] = useState([]);
    const [purchaseData, setPurchaseData] = useState({});
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [reGenLimit, setReGenLimit] = useState(0);

    const fetchResuneBuilder = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if(result.status){
            if(!result?.data || (result?.data && !result?.data?.personal_detail_complete_status)){
                history('/personal-detail');
            }else{
                setResume(result?.data);
            }
          }else{
            history('/personal-detail');
          }
        })
        .catch((error) => console.error(error.message));
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setLetterLoading(false);
        setShowModal(false);
        setCoverModal(false);
        setCoverLetterModal(false);
        setShowReviewModal(false);
        setCoverLetterQuestionnaireModal(false);
        setCoverPlanModal(false);
    };

    const handleReport = () => {

        if(!reportData.report_reason_description.trim() && reportData.report_reason.length <= 0){
            setReviewError("Please provide a report reason or details");
            return
        }
        setReviewError("");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "job_id": Id,
            "candidate_id": User._id,
            "user_info": {
                first_name: User.first_name,
                last_name: User.last_name
            },
            ...reportData
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/job-reports`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message, "success");
                setShowModal(false);
                setReportData({
                    report_reason:[],
                    report_reason_description:""
                })
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    };

    const handleCheckboxChange = (e,id) => {
        let newArray = [...reportData.report_reason];
        if(e.target.checked){
            newArray.push(id);
        }else{
            newArray = newArray.filter(value => value !== id);
        }
        setReportData({...reportData,["report_reason"]:newArray});
    };

    const applyJobModal = () => {
        setCoverModal(true);
        RecordAnalyticsHandler('click_to_apply');
    }

    const handleChange = (event) => {
        setReportData({...reportData,["report_reason_description"]:event.target.value});
    }

    const handleCoverChange = (event) => {
        setDetails(event.target.value);
    }

    const handleQuestionnaire = (event) => {
        setQuestionnaire({...questionnaire, [event.target.name]:event.target.value});
    }

    const writeModal = () => {
        if(User.purchased_plan?.includes('cover_letter') ||  User?.purchased_letter > 0){
            RecordAnalyticsHandler('closed_application_on_questionnaire');
            setCoverModal(false);
            setCoverLetterQuestionnaireModal(true);
        }else{
            setCoverPlanModal(true);
        }
    }

    const reGenerateCoverLetter = () => {

        if(reGenLimit >= 5){
            window.showToast('The maximum number of regenerations has been reached.', 'error');
            return
        }

        setLetterLoading(false);
        generateCoverLetter();
    }

    const generateCoverLetter = async () => {

        // - **Personal Summary**: "${resume.objective_summary}"
        // - **Key Skills**: ${resume.skills.join(', ')}
        RecordAnalyticsHandler('closed_application_on_cover_letter');
        setCoverLetterModal(true);
        setCoverLetterQuestionnaireModal(false);
        const prompt = `


            The format of the cover letter must follow this exact structure:

            [ Address]
            [City, State, and ZIP Code]
            [Email Address]
            [Phone Number]
            [Date of cover letter generation]
            [Hiring Manager's Name]
            [Company Name]
            [Company Address]
            [Company City, State, and ZIP Code]

            Dear [Hiring Manager's Name],

            [Cover Letter Body including closing salutation]

            [Student Name]

            Please use the information provided below to generate the cover letter:

            - Name: ${resume.user_info.name}
            - Address: ${User.street_address}, ${User.city}, ${User.state}, ${User.zip_code}
            - Email: ${resume.user_info.email}
            - Phone Number: ${resume.user_info.phone_number}
            - Today's Date: ${new Date().toLocaleDateString()}
            - Hiring Manager's Name: ${(job?.user_id?.first_name+' '+job?.user_id?.last_name)|| 'Hiring Manager'}
            - Company Name: ${job.orgnaization}
            - Company Address: ${job.location || ''}
            - Company City, State, and ZIP Code: ${job.location || ''}
            - Job Title: ${job.job_position}

            My name is ${resume.user_info.name}, and I am currently residing at ${resume.user_info.location},
            street address ${User.street_address},
            state ${User.state},
            city ${User.city},
            zip code ${User.zip_code}.

            You can reach me via email at ${resume.user_info.email} or on my phone at ${resume.user_info.phone_number}. Today's date is ${new Date().toLocaleDateString()}.

            I am writing to express my interest in the ${job.job_position} position at ${job.organization}, located at ${job.location||''}. Below is a brief summary of my professional background and key skills:

            Please generate a professional cover letter tailored to the ${job.job_position} role at ${job.orgnaization}, incorporating the information provided above. Ensure that all placeholders, such as [Company Name], [Job Title], and [Company Location], are replaced with the corresponding values and **not given to in response blank placeholders or variables it's important**:
            - Company Name: ${job.orgnaization}
            - Job Title: ${job.job_position}
            - Company Location: ${job.location||''}

            ${resume.skills.length > 0 ? '- My Skills : '+resume.skills.map(skill => skill.name).join(', '):''}

            ${
                questionnaire.q_one?
                `
                    - Question : Why are you interested in this position?
                    - Response : ${questionnaire.q_one}
                `:''
            }

            ${
                questionnaire.q_two?
                `
                    - Question : What excites you about working in this role or industry?
                    - Response : ${questionnaire.q_two}
                `:''
            }

            ${
                questionnaire.q_three?
                `
                    - Question : What personal qualities do you think make you a good fit for this job? (e.g., hardworking, reliable, enthusiastic)
                    - Response : ${questionnaire.q_three}
                `:''
            }

            ${
                questionnaire.q_four?
                `
                    - Question : How do your friends and family describe you?
                    - Response : ${questionnaire.q_four}
                `:''
            }

            ${
                questionnaire.q_five?
                `
                    - Question : What are your career goals, and how do you think this job will help you achieve them?
                    - Response : ${questionnaire.q_five}
                `:''
            }

            ${
                questionnaire.q_six?
                `
                    - Question : Is there anything else you want the employer to know about you?
                    - Response : ${questionnaire.q_six}
                `:''
            }

            Return only the completed cover letter with these values correctly filled in without brackets [Any text].

            Ensure the cover letter reads naturally and professionally, incorporating all provided details seamlessly. Avoid explicitly stating "Name:", "Address:", "Email:", "Phone:", or "Date:", "Your Name", "Your Address", "Your Email", "Your Phone", "Your City", "State", "Zipcode", "Zip Code", "Employer Name", "Your Phone Number", "Recipient", "Recipient's Name","[Your Name]", "[Your Address]", "[Your Email]", "[Your Phone]", "[Your City]", "[State]", "[Zipcode]", "[Zip Code]", "[Employer Name]", "[Your Phone Number]", "[Recipient]", [Your City, State, Zipcode], [Your City, State, Zip Code]. Return only the completed cover letter.

            IMPORTANT: Do not given to in response blank placeholders or variables like below example.

            [Your Name: example name]
            [Your Address: example address]
            [Your Email: example@gmail.com]
            [Your Phone: example phone]
            [Date: example date]
            Name: example name
            Address: example address
            Email: example@gmail.com
            Phone: example phone
            Date: example date
            [Your Name]
            [Your Address]
            [Your Email]
            [Your Phone Number]
            [Your City, State, Zipcode]
            [Your City, State, Zip Code]
            [Employer Name]
            [Date]
            [Recipient's Name]
            [Recipient]

            **Important Instructions:**
            1. The cover letter should read naturally and professionally, incorporating all provided details seamlessly.
            2. **Do not use placeholders, square brackets, or variable names** like "[Your Name]", "[Your City, State, Zip Code]", "Recipient", or any other placeholder syntax.
            3. **Avoid explicit labels** such as "Email:", "Phone:", "Date:", "Name:", etc. Integrate the information fluidly into the text.
            4. **Return only the completed cover letter** with these values naturally filled in and do not include any example values or instructions in the output.

            Return only the completed cover letter text.


        `;

        try {
            const response = await window.getOpenAIResponse(prompt)
            setDetails(response);
            setLetterLoading(true);
            setReGenLimit((prev) => prev + 1);
        } catch (error) {
            console.error('Failed to get OpenAI response:', error.message);
        }
    }

    var jobApplied = true;
    const handleApply = (skip=false) => {

        if(jobApplied){

            jobApplied = false
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "employer_id":job.user_id,
                "job_id": Id,
                "candidate_id": User,
                "user_info": {
                    first_name:User.first_name,
                    last_name:User.last_name,
                    image:User.profile_image
                },
                "job_info": {
                    job_position: job.job_position,
                    orgnaization: job.orgnaization,
                    location: (job.location||''),
                    logo: job.logo,
                    salary: (((job.job_min_amount?'$'+((job.job_min_amount||0).toLocaleString('en-US')):'')+(job.job_max_amount?'- $'+((job.job_max_amount||0).toLocaleString('en-US')):'')))
                },
                "status": "Pending",
                "cover_letter": (skip?'':details)
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/applied-job`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setCoverLetterModal(false);
                    setCoverModal(false);
                    window.showToast(result.message, 'success');
                    setApplied(result.data);
                    jobApplied = true;
                    RecordAnalyticsHandler('applied_on_job');
                }else{
                    window.showToast(result.message, 'error');
                    jobApplied = true;
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoadingSkeleton(false));
        }
    }

    useEffect(() => {

        if(!personality_assessment){
            window.showToast("Please complete your Personality Assessment first.",'error');
            history('/dashboard');
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-jobs/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setJob(result.data);
                setLoading(true);
            }else{
                window.showToast(result.message,'error');
                history('/jobs')
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));


        fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?job=${Id}&user=${User._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(!result.status){

            }else{
                setApplied(result.data);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        fetch(`${process.env.REACT_APP_API_URL}/app/get-review-of-employer?job=${Id}&candidate=${User._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status && result.data.length > 0){
                setReview(result.data[0]);
            }
        })
        .catch((error) => console.error(error));

        fetchResuneBuilder()
        getPlans()
    },[])

    useEffect(() => {
        if(job._id && !applied?.status){
            RecordAnalyticsHandler('visit_on_job');
        }
        addView()
    },[job._id, applied])

    const CancelApplication = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-applied-job/${applied._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message,"success");
                setApplied(false)
                setShowCancelModal(false)
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    }

    const saveCoverLetter = () => {
        if(!details.trim()){
            setError("Cover letter is required.");
            return
        }

        handleApply()
    }

    const skipCoverLetter = () => {
        setDetails('')
        handleApply(true)
    }

    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
    }

    const handleClick = (e) => {
        if (value === e.value) {
          setValue(null);
        } else {
          setValue(e.value);
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
          window.showToast('Link copied', 'success');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
    };

    const copyToClipboard = () => {
        const url = window.location.href;
        copyToClipboardFallback(url); // Use fallback if Clipboard API fails.
    };

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

            const URL = (review._id?`${process.env.REACT_APP_API_URL}/app/update-review-of-employer/${review._id}`:`${process.env.REACT_APP_API_URL}/app/review-to-employer`);
            const METHOD = (review._id?"PATCH":"POST");

            const raw = JSON.stringify({
                "job_id": Id,
                "employer_id": job.user_id,
                "candidate_id": User._id,
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

    const handleReviewChange = (e) => {
        if(review.rating === e.target.value){
            e.target.value = null;
        }
        setReview({...review, [e.target.name]: e.target.value});
    }

    const deleteReview = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-review-of-employer/${review._id}`, requestOptions)
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

    const addView = () => {
        if(job._id){
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "job_id": job._id,
                "employer_id": job.user_id,
                "candidate_id": User._id
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/create-job-views`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                //console.log(result);
            })
            .catch((error) => console.error(error.message));
        }
    }

    const handleBack = () => {
        window.history.back();
    };

    const RecordAnalyticsHandler = (action) => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "employer_id":job.user_id,
            "job_id": Id,
            "candidate_id": User._id,
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

    const getPlans = () => {


        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-plans?keys=cover_letter,life_time_access,all_feature_access`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPlans(result.data)
            }
        })
        .catch((error) => console.error(error));
    }

    const buyModule = (data) => {
        setPurchaseData(data);
        setShowBuyModal(true);
    }

    const purchaseModules = (event, data) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": (data.key=='cover_letter'?'cover_letter':data.type),
            "id": data.id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/purchase-module`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                localStorage.setItem('userData', JSON.stringify(result.data));
                setUser(result.data);
                setShowBuyModal(false);
                setCoverPlanModal(false);
                window.showToast(result.message,'success');
                setCoverLetterQuestionnaireModal(true);
                getPlans();
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));
    }

    return (
        <>
            {loading && <div className="jobs_page common_background_block">
                <div className='detail_block'>
                    <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                    <div className='detail-product'>
                        <div className='aul_content'>
                            <h4 className='application_name'> {loadingSkeleton ? <Skeleton width="75%" height='30px' /> : job.job_position } </h4>
                            {loadingSkeleton ?
                                <p className='amount'> <Skeleton width="50%" height='20px' /> </p>
                            :
                                <p className='amount'> {job.job_min_amount && `$${job.job_min_amount}`} {job.job_min_amount && job.job_max_amount && '-'} {job.job_max_amount && `$${job.job_max_amount}`}</p>
                            }
                            <p className='aul_text aul_keyword'> <Link to={`/company-detail/${job.user_id?._id}`}> {loadingSkeleton ? <Skeleton width="50%" /> : `${job.orgnaization}` } </Link></p>

                            {(job.job_location_type === 'In-person at a precise location' || job.job_location_type === 'In-person within a limited area') && (
                                 <p className='aul_text aul_location'>
                                        {loadingSkeleton ? <Skeleton width="50%" /> : `${job.location || ""}`}
                                    </p>
                            )}
                            <div className="dots_btn_row">
                                {loadingSkeleton ?
                                    <Skeleton width="105px" height='34px' className="sk_btn me-1"/>
                                    :
                                    <Link to={`/company-detail/${job.user_id?._id}`}>
                                        <button className='btn apply_btn me-1'>Company</button>
                                    </Link>
                                }
                                {loadingSkeleton ?
                                    <Skeleton width="170px" height='34px' className="sk_btn"/>
                                    :
                                    <>
                                        {!applied && <button className='btn apply_btn' onClick={applyJobModal}>Apply</button>}
                                        {applied && <button className='btn apply_btn cancel_btn' onClick={()=>{setShowCancelModal(true)}}>Cancel application</button>}
                                    </>
                                }

                                <Dropdown>
                                    <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                        <img src={Dots} alt="" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={copyToClipboard} > <img src={Copy} alt="" /> Copy link </Dropdown.Item>
                                        <Dropdown.Item onClick={handleOpenModal}> <img src={Megaphone} alt="" /> Report </Dropdown.Item>
                                        {applied && <Dropdown.Item onClick={handleOpenReviewModal}> <img src={Star} alt="" /> Review </Dropdown.Item>}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <p className='mb-0 matchrate_text'> {job.percentage}% Match rate </p>
                            </div>
                        </div>
                        {job.logo && <div className='icon'>
                            <Link to={`/company-detail/${job.user_id?._id}`}> <img src={job.logo} alt="" /></Link>
                        </div>}
                    </div>

                    {/*  */}
                    <div className='detail-product d-block '>
                        <h3 className='dd_title'> About the Job </h3>
                        <div className='dp_block'>
                            <p className=""> <span> Location Type : </span> {job.job_location_type} </p>
                            {job.job_location_type ==='In-person at a precise location' || job.job_location_type ==='In-person within a limited area' && <p className=""> <span>Distance from the location : </span> {(job.location_miles ? job.location_miles + ' Miles' : '') || 'Anywhere from the location'} </p>}
                            <p className=""> <span> Work Authorization : </span> {job.work_authorization} </p>
                            {job.work_authorization === 'Yes' && <p className=""> <span> Work Authorization Requirement : </span> {job.work_authorization_requirement} </p>}
                        </div>
                        <div className='dp_block'>

                            <p className=""> <span> Job Type : </span> {job.job_type} </p>
                            <p className=""> <span> Experience : </span> {job.job_experience_level} </p>
                            <p className="">
                                <span> Working Days : </span>
                                {/* {job?.weekly_day_range?.join(', ')} */}
                                {
                                    job.weekly_day_range.map(value => (value!=='Other'?value:(job?.weekly_day_range_other:''))).join(', ')
                                }
                            </p>
                            <p className=""> <span> Shift : </span>
                                {/* {job.shift_time ==='Other'?job.other_shift_time:job.shift_time}  */}
                                {
                                    job.shift_time.map(value => (value!=='Other'?value:(job?.other_shift_time:''))).join(', ')
                                }
                            </p>
                            <p className=""> <span> Expected Weekly Hours : </span> {job.expected_hours.join(', ')}</p>
                        </div>

                        <div className='dp_block'>
                            <p className=""> <span> Pay Type : </span> {job.job_pay_type} {job.job_pay_type ==='Other'?`(${job.job_pay_type_other})`:''} </p>
                            <p className=""> <span> Pay Frequency : </span> {job.job_pay_frequency} </p>
                            {job.job_benefits.length > 0 && <><p className=""> <span> Benefits : </span></p>
                            <ul>
                                {
                                    job.job_benefits.map((benefit, key) => (benefit!=='Other'?(<li key={`ben_${key}`}><p>{benefit}</p></li>):(<li key={`ben_${key}`}><p>{job.job_benefits_other}</p></li>)))
                                }
                            </ul></>}

                            {/* {job.job_benefits_other && <p className=""> <span> Other Benefits : </span> {job.job_benefits_other} </p>} */}
                        </div>

                        {job.pay_is_competitive === 'Yes' && <div className='dp_block'>
                            <p className=""> <span> Competitive Salary : </span> {job.pay_is_competitive} </p>
                        </div>}

                        <div className='dp_block'>
                            {job.education_level && <p className=""> <span> Education Level : </span> {job.education_level} </p>}
                            {/* {job.year_of_experience && <p className=""> <span> Years of Experience : </span> {job.year_of_experience} </p>} */}
                            {job?.required_skills.length > 0 && <><p className=""> <span> Top 5 Preferred Skills : </span> </p>
                                <ul>
                                    {
                                        job?.required_skills.map((skill, key) => ( <li key={`skill_${key}`}><p>{skill}</p></li>))
                                    }
                                </ul></>
                            }
                            {job.other_preferences && <p className=""> <span> Certifications : </span> {job.other_preferences} </p>}
                        </div>

                    </div>


                    {/*  */}
                    <div className='detail-description'>
                        <h3 className='dd_title'> {loadingSkeleton ? <Skeleton width="50%" height='30px' /> : 'Job Description' } </h3>
                        <div>{loadingSkeleton ?
                            <>
                                <Skeleton width="100%" className='mb-1' />
                                <Skeleton width="100%" className='mb-1' />
                                <Skeleton width="100%" className='mb-1' />
                                <Skeleton width="100%" className='mb-1' />
                            </>
                        :
                        `${job.job_description}` }</div>
                    </div>
                </div>
            </div>}

            {/* Modal block */}
            <Modal className={`report_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'> Report </h1>
                </Modal.Header>
                <Modal.Body>
                    <div className='report_modal_content'>
                        <form>

                            <div className='re_checkboxes'>
                                {checkboxes.map((checkbox,index) => (
                                    <CustomCheckbox
                                        key={index}
                                        checked={reportData.report_reason.some(value=> checkbox.id === value)}
                                        onChange={(e) => {handleCheckboxChange(e,checkbox.id)}}
                                        label={checkbox.label}
                                    />
                                ))}
                            </div>

                            <FloatingLabel controlId="floatineducation" label={<span> Details <span className='required'>*</span> </span>} className="mt-3 mb-4">
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={reportData.report_reason_description}
                                    onChange={handleChange}
                                    maxLength="300"
                                    placeholder=""
                                />
                                {reviewerror && <small style={{color:"red"}}>{reviewerror}</small>}
                                <p className="phone_Text"> {reportData.report_reason_description.length}/300 </p>
                            </FloatingLabel>

                            <button className='btn report_btn mb-0' type='button'  onClick={handleReport}>Report</button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* cover_modals */}
            <Modal className={`application_modals cover_modals ${theme}`} show={coverModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <div className='icons'>
                        <img src={Lamp} alt="" />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='application_modal_content modal_content'>
                        <h1 className='heading'>Would you like to write a cover letter?</h1>
                        <p className='text'>A cover letter is crucial as it provides a personalized introduction reflecting your personality and enthusiasm for the role.</p>
                        <button className='btn continue_btn mb-3' type='button'  onClick={writeModal} >Write</button>
                        <button className='btn goback_btn' type='button' onClick={handleApply}>Skip</button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* cover_latter_plan_modals */}
            <Modal className={`application_modals cover_plan_modal cover_modals ${theme}`} show={coverPlanModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <div className='icons'>
                        <img src={Lamp} alt="" />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='application_modal_content modal_content'>
                        <h1 className='heading'>Write a cover letter with plan</h1>
                        <p className='text'>A cover letter is crucial as it provides a personalized introduction reflecting your personality and enthusiasm for the role.</p>
                        <div className='cover_plan_info'>

                            {
                                plans?.map((value, index) => (
                                    <div className={`lmsacc_card cover_plan_box generator_plan_box ${value.plan_key}`} key={value.plan_key}>
                                        <h2 className='lmsacc_title'> {value.plan_name} </h2>
                                        <p className='lms_desc'> {value.plan_title} </p>
                                        <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> {value?.plan_price} </span> {value?.plan_price_text} </p>
                                        <div className='m-content' dangerouslySetInnerHTML={{ __html: (value.plan_description||'') }}></div>
                                        <button type='button' className='btn assecc_btn' onClick={(e) => {
                                            buyModule({
                                                type:"plan",
                                                id: value._id,
                                                name:value.plan_name,
                                                key:value.plan_key,
                                                price: value?.plan_price
                                            })
                                        }}> Get {value.plan_name} </button>
                                    </div>
                                ))
                            }

                            {/* <div className="lmsacc_card cover_plan_box generator_plan_box">
                                <h2 className='lmsacc_title'> AI-powered cover Letter Generator </h2>
                                <p className='lms_desc'>Pay-per-use model </p>
                                <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> 199 </span> 1 per use </p>
                                <button type='button' className='btn assecc_btn' onClick={buyModal}> Continue </button>
                            </div>

                            <div className="lmsacc_card cover_plan_box lifetime_plan_box">
                                <h2 className='lmsacc_title'>Lifetime Access </h2>
                                <p className='lms_desc'> One-time purchase, includes unlimited cover letters, resume templates, and future AI tools </p>
                                <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> 199 </span> </p>
                                <button type='button' className='btn assecc_btn' onClick={buyModal}> Continue </button>
                            </div>

                            <div className="lmsacc_card cover_plan_box features_plan_box">
                                <h2 className='lmsacc_title'> All Features Access </h2>
                                <p className='lms_desc'> Includes unlimited cover letters, resume templates. </p>
                                <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> 249 </span> one-time purchase, lifetime access </p>
                                <ul>
                                    <li>Includes all resume and cover letters</li>
                                    <li>Includes complete LMS Access</li>
                                    <li>Lifetime access to all current and future features.</li>
                                </ul>
                                <button type='button' className='btn assecc_btn' onClick={buyModal}> Get Complete Access </button>
                            </div> */}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Buy modal */}
            <PurchaseModel showModal={showBuyModal} setShowModal={setShowBuyModal} purchaseModules={purchaseModules} purchaseData={purchaseData} User={User}/>

            {/* cover letter questionnaire modal */}
            <Modal className={`cover_letter_modals cover_letter_questionnaire_modals ${theme}`} show={coverLetterQuestionnaireModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h3 className='modal_title'> Cover letter questionnaire </h3>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <form>
                            <Form.Group className="mb-3" >
                                <Form.Label>1. Why are you interested in this position?</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="q_one"
                                    value={questionnaire?.q_one||""}
                                    onChange={handleQuestionnaire}
                                    maxLength="500"
                                    placeholder="Write here..."
                                />
                                <p className="phone_Text"> {questionnaire?.q_one.length}/500 | Optional</p>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label>2. What excites you about working in this role or industry?</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="q_two"
                                    value={questionnaire?.q_two||""}
                                    onChange={handleQuestionnaire}
                                    maxLength="500"
                                    placeholder="Write here..."
                                />
                                <p className="phone_Text"> {questionnaire?.q_two.length}/500 | Optional</p>
                            </Form.Group>

                            {/* ------ */}
                            <Form.Group className="mb-3" >
                                <Form.Label>3. What personal qualities do you think make you a good fit for this job? (e.g., hardworking, reliable, enthusiastic)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="q_three"
                                    value={questionnaire?.q_three||""}
                                    onChange={handleQuestionnaire}
                                    maxLength="500"
                                    placeholder="Write here..."
                                />
                               <p className="phone_Text"> {questionnaire?.q_three.length}/500 | Optional</p>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label>4. How do your friends and family describe you?</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="q_four"
                                    value={questionnaire?.q_four||""}
                                    onChange={handleQuestionnaire}
                                    maxLength="500"
                                    placeholder="Write here..."
                                />
                                <p className="phone_Text"> {questionnaire?.q_four.length}/500 | Optional</p>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label>5. What are your career goals, and how do you think this job will help you achieve them?</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="q_five"
                                    value={questionnaire?.q_five||""}
                                    onChange={handleQuestionnaire}
                                    maxLength="500"
                                    placeholder="Write here..."
                                />
                                <p className="phone_Text"> {questionnaire?.q_five.length}/500 | Optional</p>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label>6. Is there anything else you want the employer to know about you?</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="q_six"
                                    value={questionnaire?.q_six||""}
                                    onChange={handleQuestionnaire}
                                    maxLength="500"
                                    placeholder="Write here..."
                                />
                                <p className="phone_Text"> {questionnaire?.q_six.length}/500 | Optional</p>
                            </Form.Group>

                            <div className="button_row">
                                <button className='btn continue_btn mt-0' type='button' onClick={generateCoverLetter}> Generate Cover Letter </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* cover letter modals */}
            <Modal className={`cover_letter_modals ${theme}`} show={coverLetterModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h3 className='modal_title'>Write a cover letter </h3>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        {letterLoading && <span className='regenerate_btn' type='button' onClick={reGenerateCoverLetter}> <img src={Refresh} alt="" /> Regenerate </span>}
                        {letterLoading && <form>
                            <FloatingLabel controlId="floatineducation" label={<span> Cover letter <span className='required'>*</span> </span>} className="">
                                <Form.Control
                                    as="textarea"
                                    rows={7}
                                    name="description"
                                    value={details}
                                    onChange={handleCoverChange}
                                    maxLength="5000"
                                    placeholder=""
                                />
                                {error && <small style={{color:"red"}}>{error}</small>}
                                <p className='phone_Text'> {details.length}/5000 | This summary was generated with the help of AI.</p>
                            </FloatingLabel>
                            <div className="button_row">
                                <button className='btn goback_btn' type='button' onClick={skipCoverLetter}>Skip cover letter</button>
                                <button className='btn continue_btn mt-0' type='button' onClick={saveCoverLetter}>Apply</button>
                            </div>
                        </form>}
                        {!letterLoading &&
                            <div className='mb-3 mt-3 text-center'>
                                <ProgressSpinner />
                                <h5>Cover letter is generating...</h5>
                            </div>
                        }
                    </div>
                </Modal.Body>
            </Modal>

            {/*  */}
            <Modal className={`application_modals ${theme}`} show={showCancelModal} onHide={()=>{setShowCancelModal(false)}} backdrop="static">
                <Modal.Header closeButton>
                <div className='icons'>
                    <img src={Lamp} alt="" />
                </div>
                </Modal.Header>
                <Modal.Body>
                <div className='application_modal_content'>
                    <h1 className='heading'>Cancelling application</h1>
                    <p className='text'>Are you sure you want to cancel application?</p>
                    <button className='btn cancel_btn' type='button'  onClick={CancelApplication} >Cancel</button>
                    <button className='btn goback_btn' type='button' onClick={()=>{setShowCancelModal(false)}}>Go back</button>
                </div>
                </Modal.Body>
            </Modal>

            {/* Reveiw Modal block */}
            <Modal className={`report_modals ${theme}`} show={showReviewModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'> Review </h1>
                </Modal.Header>
                <Modal.Body>
                <div className='report_modal_content'>
                    <form>
                        <div className='star_rating_view'>
                            <Rating value={review.rating||null} name="rating" onChange={handleReviewChange} cancel={false} />
                        </div>
                        <FloatingLabel controlId="floatineducation" label={<span> Description </span>} className="mt-3 mb-4">
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="review"
                                value={review.review||''}
                                onChange={handleReviewChange}
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

export default JobDetail;