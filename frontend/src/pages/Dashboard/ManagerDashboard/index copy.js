import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link, useNavigate } from 'react-router-dom';
import './../index.css'
import Analytics from "./Analytics";

import siteLogo from '../../../assets/images/logo.png';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Resource from '../../../assets/images/resource-allocation.png';
import PostingJob from '../../../assets/images/posting.png';
import Matching from '../../../assets/images/matching.png';


import WritingHand from '../../../assets/images/WritingHand.svg';
import Memo from '../../../assets/images/Memo.svg';
import PuzzlePiece from '../../../assets/images/PuzzlePiece.svg';
import IncomingEnvelope2 from '../../../assets/images/IncomingEnvelope2.svg';
import BiPass from '../../../assets/images/bi_pass.svg';


import Medal from '../../../assets/images/Medal.png';
import SweetAlert from 'react-bootstrap-sweetalert';

import Person from '../../../assets/images/Person.svg';
import userDataHook from "../../../userDataHook";
import { useProfile } from '../../../ProfileContext';
import { Skeleton } from 'primereact/skeleton';

import ViewChart from './viewchart';


const ManagerDashboard = () => {

  const {theme, profileName} = useProfile();
  const userData = userDataHook();
  const TOKEN  = localStorage.getItem('token');
  const User = JSON.parse(localStorage.getItem('userData'));
  const UserId = (User.user_type==='subuser')?User.admin_id:User._id;
  const RoleViewApplicants = (User.user_type==='subuser')?JSON.parse(User.role).view_applicants:true;
  const Roles = JSON.parse(localStorage.getItem('Roles'));

  const [activeSections, setActiveSections] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [stepTitle, setStepTitle] = useState('');
  const [approvalModal, setApprovalModal] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [views, setViews] = useState([]);
  const [tviews, setTViews] = useState(0);
  const [analytics, setAnalytics] = useState({});
  const [checkCompany, setCheckCompany] = useState('');
  const navigate = useNavigate();

  const sections = User?.user_type==='subuser'?[
    { icon: Memo, text: 'Publish a job post', activitieStatus: User?.job_published, hide:true },
    { icon: PuzzlePiece, text: 'Check your matches', activitieStatus: User?.job_matched, hide:true  },
    { icon: IncomingEnvelope2, text: 'Contact first candidate', activitieStatus: User?.contact_candidate_completed,hide:false }
  ]:[
    {
      icon: WritingHand,
      text: 'Company Profile',
      activitieStatus: User?.company_completed,
      hide:false,
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <p class="src_desc"> The Company Profile section helps showcase who you are as a business and what makes working at your company special. In this section, you’ll answer questions about your company’s culture, values, purpose, and what life is like at your workplace. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Candidates rely on this information to decide if your company is the right fit for their first job. Sharing your company’s story, mission, and values helps potential employees understand if they’ll thrive in your environment. A well-crafted profile attracts the right candidates and sets the tone for a positive working relationship from day one. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> What’s Next? </h2>
              <ul class="">
                <li> <b>Tell Your Story:</b> Highlight the values that drive your company and what makes your team unique. </li>
                <li> <b>Share Your Culture:</b> Provide a glimpse into daily life at your company—what your team stands for and how they grow together. </li>
                <li> <b>Attract the Right Candidates:</b> This information helps job seekers understand if your workplace is a good fit for them, improving the chances of finding motivated and aligned employees. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to build your profile and attract your next great hire? </h2>
              <p class="src_desc"> Click <b>Continue</b> to get started! </p>
          </div>
        </div>`,
    },
    {
      icon: Person,
      text: 'Personality Assessment',
      activitieStatus: User?.personality_assessment_complete_status,
      hide:false,
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <p class="src_desc"> This quick 5-question assessment helps us better understand your management style and work preferences. The insights gained from this assessment are one of the many tools we use to match you with first-time job seekers whose personalities and strengths align with your leadership approach and workplace environment. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Finding the right employees isn’t just about qualifications—it’s about creating a productive and positive work dynamic. This assessment helps us match candidates with managers and teams where they’re more likely to feel supported, comfortable, and motivated to grow. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> What’s Next? </h2>
              <ul class="">
                <li> <b>Complete the Assessment:</b> Answer five short questions to help us understand your management style and preferences. </li>
                <li> <b>Get Matched:</b> We’ll use your results and other matching points to recommend candidates whose strengths complement your leadership style. </li>
                <li> <b>Create a Strong Start:</b> Better matches lead to stronger teams, smoother onboarding, and more engaged employees. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to discover your perfect match? </h2>
              <p class="src_desc"> Click <b>Continue</b> to begin the assessment! </p>
          </div>
        </div>`,
    },
    {
      icon: Memo,
      text: 'Publish a Job Post',
      activitieStatus: User?.job_published,
      hide:true,
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <p class="src_desc"> We’re here to make your job posting experience simple, effective, and rewarding, with tools designed to highlight every detail that makes your opportunity unique and appealing to top talent.</p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> <b>General Information:</b> Start by adding essential details to your job post. Share your company’s vision and values to set the stage for potential candidates. </li>
                <li> <b>Job Details:</b> Define the role’s responsibilities, working conditions, and key deliverables. This section ensures candidates fully understand the position’s scope and expectations. </li>
                <li> <b>Pay Structure and Range:</b> Specify pay structure and salary ranges to attract the right level of experience and skill, enhancing transparency and trust. </li>
                <li> <b>Job Description:</b> Craft a compelling job description that speaks directly to candidates, highlighting what makes this role and your team unique. </li>
                <li> <b>Job Preferences:</b> Indicate any additional requirements or preferences—such as skills, experience, or availability—to help ensure a precise fit. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It’s Different </h2>
              <p class="src_desc"> With our platform, you’re not just posting a job—you’re telling a story. Our system matches your job post to candidates based on skills, personality, and workplace fit, helping to build strong, productive teams from day one. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to Post Your Job? </h2>
              <p class="src_desc"> Get started now to create a job listing that brings in the best candidates for your team. Click <b>Continue</b> to publish your job and find your perfect hire! </p>
          </div>
        </div>
      `,
    },
    {
      icon: PuzzlePiece,
      text: 'Check Your Matches',
      activitieStatus: User?.job_matched,
      hide:true
    },
    {
      icon: IncomingEnvelope2,
      text: 'Contact First Candidate',
      activitieStatus: User?.contact_candidate_completed,
      hide:false
    }
  ];

  const handleSectionClick = (element) => {

    setActiveSections(prevActiveSections => {
      const updatedSet = new Set(prevActiveSections);
      if (updatedSet.has(activeSectionIndex)) {
        updatedSet.delete(activeSectionIndex);
      } else {
        updatedSet.add(activeSectionIndex);
      }
      return updatedSet;
    });

    setShowModal(false);

    switch (element) {
      case "Get approval": setApprovalModal(false); break;
      case "Company Profile": navigate('/company-profile'); break;
      case "Publish a Job Post": navigate('/post-job'); break;
      case "Check Your Matches": navigate('/select-job'); break;
      case "Contact First Candidate": navigate('/select-job'); break;
      case "Personality Assessment": navigate('/employers-assessments'); break;
    }
  };

  const completeAllProcess = () => {
    setShowBadgesModal(false);
  }

  useEffect(() => {
    const newProgress = (activeTab / sections.length) * 100;
    setProgress(newProgress);
  }, [activeSections, activeTab]);

  useEffect(() => {
    const activeTabs = sections.filter(section => section.activitieStatus).length;
    setActiveTab(activeTabs);
  }, [sections]);

  const handleOpenModal = (index) => {
    handleCloseModal();

    setActiveSectionIndex(index);
    setShowModal(true);
    //setShowAlert(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowCompleteModal(false);
    setApprovalModal(false);
  };

  const handleShowBadges = () => {
    setShowCompleteModal(false);  // Close the complete modal
  };

  const fetchApplicants = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?employer=${UserId}&limit=5`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setApplicants(result.data)
      }
    })
    .catch((error) => console.error(error.message));
  }

  const fetchOpeningJobs = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-company-jobs?active=true&user=${UserId}&limit=5`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setJobs(result.data);
      }
    })
    .catch((error) => console.error(error.message))
    .finally(() => setLoadingSkeleton(false));

  }

  const fetchViews = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-job-views?employer=${UserId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setViews(result.dailyCounts);
        setTViews(result.totalCount);
      }
    })
    .catch((error) => console.error(error.message));

  }

  const fetchAnalytics = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-analytics?employer=${UserId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      setAnalytics(result.data);
    })
    .catch((error) => console.error(error.message));
  }

  const firstInactiveSection = sections.find(section => !section.activitieStatus);
  const firstInactiveIndex = sections.findIndex(section => !section.activitieStatus);

  useEffect(() => {
    fetchApplicants();
    fetchOpeningJobs();
    fetchViews();
    fetchAnalytics();
  },[])

  useEffect(() => {

    if(userData?.user_type == 'manager' && !userData?.company_completed){
      navigate('/company-profile')
    }

    if(userData){
      const showModal = sessionStorage.getItem('showCompleteModal') === 'true';
      setStepTitle(sessionStorage.getItem('step_title'));
      setCheckCompany(sessionStorage.getItem('company_completed'));

      setTimeout(() => {
        if(showModal){
          if (sessionStorage.getItem('company_completed') === 'notcompleted' && sessionStorage.getItem('step_title') === 'Company Profile') {
            setShowCompleteModal(true);
          }else{
            if(firstInactiveSection){
              setActiveSectionIndex(firstInactiveIndex);
              setShowModal(true);
            }
          }
          sessionStorage.removeItem('showCompleteModal'); // Clear to prevent future triggers
          sessionStorage.removeItem('company_completed'); // Clear to prevent future triggers
        }
      }, 500); // Adjust the timeout as needed

      // Simulate a fetch request
      setTimeout(() => {
        setLoadingSkeleton(false);
      }, 2000); // Adjust the timeout as needed
    }

  }, [userData]);

  return (
    <>
      <div className="dashboard_page manager_dashboard_page common_background_block">
        <div className="dashboard_content_block">

          <div className='dcb_left_side_content'>

            {userData?.user_type!=='subuser' && <div className='dcb_block'>
              {firstInactiveSection && <h5 className='sub_text'> {loadingSkeleton ? <Skeleton width="200px" /> : "GETTING STARTED" } </h5>}
              <h1 className='d_title'>
                {loadingSkeleton ? <Skeleton width="100%" height='40px' /> : `
                  Hi ${profileName},
                  ${userData?.user_type!=='subuser' && firstInactiveSection?"let’s finish setting up your account.":""}`
                }
                {/* {!firstInactiveSection && <span>Congratulations! <img style={{width: '18px'}} src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXekvZLLJ1yPgYSqwHr8wWAvhqDaJPUiJhNqApr8jBx3e_bb2koKzJjIdeXJaeM7pUH4MTkBugg7TZgdsei7kg81AY7Mmrz5m2VYfyomzrJdvHbINY3sEU201uaWufezKYdc-VlRaOKaLkYejyUdFaQbIrJj?key=A-6-sAfeWVJZ7f00MwfaZQ" /> You've completed all sections. Click on any section again to edit; otherwise, enjoy making new connections!</span>} */}
              </h1>

              <div className='dlist_block'>
                <ul>
                  {sections.map((section, index) => (
                    loadingSkeleton ?
                    <li key={index}>
                      <Skeleton width="125px" height='36px' className={index % 2 === 0 ? 'even' : 'odd'} />
                    </li>
                    :
                    (<li key={index} className={section.hide?'d-none':''}>
                      <Link
                        className={section.activitieStatus ? 'active' : ''}
                        onClick={() => handleOpenModal(index)}
                      >
                        <span>{section.text}</span>
                      </Link>
                    </li>)
                  ))}
                </ul>
              </div>

              <div className='progress-bar-block'> {loadingSkeleton ? <Skeleton width="100%" height='6px' /> : <ProgressBar now={progress} /> } </div>

            </div>}

            {/*  */}
            <div className="recent_linking_block">
                <Row>
                  <Col lg={3} md={4} sm={6}>
                    <div className='rlb_list'>
                      <Link to="/post-job" className=''>
                        <span className='ae_content'>
                          {loadingSkeleton ? <Skeleton width="80%" height='24px' /> : <span className='ae_p'> Publish a Job Post </span> }
                          {loadingSkeleton ? <Skeleton width="24px" height='24px' /> : <img src={PostingJob} alt="" /> }
                        </span>
                      </Link>
                    </div>
                  </Col>
                  <Col lg={3} md={4} sm={6}>
                    <div className='rlb_list'>
                        <Link to="/select-job" className=''>
                          <span className='ae_content'>
                            {loadingSkeleton ? <Skeleton width="80%" height='24px' /> : <span className='ae_p'> Check Your Matches </span> }
                            {loadingSkeleton ? <Skeleton width="24px" height='24px' /> : <img src={Matching} alt="" /> }
                          </span>
                        </Link>
                      </div>
                  </Col>
                  <Col lg={3} md={4} sm={6}>
                    <div className='rlb_list'>
                        <Link to="/resources" className=''>
                          <span className='ae_content'>
                           {loadingSkeleton ? <Skeleton width="80%" height='24px' /> : <span className='ae_p'>  Resources  </span> }
                           {loadingSkeleton ? <Skeleton width="24px" height='24px' /> : <img src={Resource} alt="" /> }
                          </span>
                        </Link>
                      </div>
                  </Col>
                  <Col lg={3} md={4} sm={6}>
                    <div className='rlb_list'>
                        <Link to="/subscription" className=''>
                          <span className='ae_content'>
                            {loadingSkeleton ? <Skeleton width="80%" height='24px' /> : <span className='ae_p'>  Subscription  </span> }
                            {loadingSkeleton ? <Skeleton width="24px" height='24px' /> : <img src={BiPass} alt="" /> }
                          </span>
                        </Link>
                      </div>
                  </Col>
                </Row>
            </div>

            <Analytics analytics={analytics} job="" loadingSkeleton={loadingSkeleton} />

            {<div className="recent_block">
              {loadingSkeleton ? <Skeleton width="250px" height='24px' className='m-auto' /> : <h1 className="rtitle">Job posting views ({tviews})</h1> }
              {views.length > 0 && <ViewChart data={views} />}
            </div>}

          </div>

          <div className='dcb_right_side_content'>
            {/*  */}
            {RoleViewApplicants && applicants.length > 0 && <div className="recent_block">
              {loadingSkeleton ? <Skeleton width="250px" height='24px' className='m-auto mb-3' /> : <h1 className="rtitle">New applicants</h1>}

              <ul className='application_list'>
                {
                  applicants.map((value, index) => (
                    <li key={index}>
                      <Link to={`/candidate-info/${value.candidate_id}/${value.job_id}`}>
                      {value.user_info.image && <div className='user_img'>
                        {loadingSkeleton ? <Skeleton width="100%" height='100%' borderRadius="100%" /> : <img src={value.user_info.image} alt="" /> }
                        </div>}
                        <div className='info'>
                          {loadingSkeleton ? <Skeleton width="40%" height='20px' className='mb-1' /> : <p className="uname"> {value.user_info.first_name} {value.user_info.last_name} </p> }
                          {loadingSkeleton ? <Skeleton width="80%" height='16px' /> : <p className="upost"> {value.job_info.job_position} </p> }
                        </div>
                      </Link>
                    </li>
                  ))
                }
              </ul>

              <div>
              {loadingSkeleton ? <Skeleton width="100%" height='46px' borderRadius="50px" /> :
                <Link to='/applicants' className="btn see_all_btn" > See all </Link>
              }
              </div>

            </div>}

            {/*  */}
            {jobs.length > 0 && <div className="recent_block job_openings_blok mb-2">
              {loadingSkeleton ? <Skeleton width="250px" height='24px' className='m-auto mb-3' /> : <h1 className="rtitle">Job openings</h1>}


              <ul className='application_list'>
                {
                  jobs.map((value, index) => (
                    <li key={index}>
                      <Link to={`/job-details/${value.id}`} className='p-0'>
                        <div className='info'>
                        {loadingSkeleton ? <Skeleton width="40%" height='20px' className='mb-1' /> : <p className="uname"> {value.job_position} </p> }
                        {loadingSkeleton ? <Skeleton width="80%" height='16px' /> :  <p className="upost"> {value.applied_count} Candidates </p> }
                        </div>
                      </Link>
                    </li>
                  ))
                }
              </ul>

              <div>
                {loadingSkeleton ? <Skeleton width="100%" height='46px' borderRadius="50px" /> :
                  <Link to="/jobs" className="btn see_all_btn"> See all </Link>
                }
              </div>
            </div>}
          </div>

        </div>
      </div>

      {/*  */}
      <SweetAlert
        show={showAlert}
        warning
        confirmBtnText="Okay"
        title="This is part of next milestone"
        onConfirm={() => setShowAlert(false)}
        focusCancelBtn
        >
      </SweetAlert>

      {/* Modal block */}
      <Modal className={`dashboard_modals ${theme}`} show={approvalModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          {/* <div className='icons'>
            <img src={sections[0]?.icon} alt="" />
          </div> */}
        </Modal.Header>
        <Modal.Body>
          <div className='modal_content'>
            <h1 className='heading'>You cannot access this functionality until verified by the administrator </h1>
            <p>verification process may take up to 3 business days</p>
            <button className='btn continue_btn' onClick={() => handleSectionClick(sections[activeSectionIndex]?.text)}>Continue</button>
          </div>
        </Modal.Body>
      </Modal>

      {/*  */}
      <Modal className={`dashboard_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <div className='icons'>
            <img src={sections[activeSectionIndex]?.icon} alt="" />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal_content'>
            <h1 className='heading'>{sections[activeSectionIndex]?.text}</h1>
            <div className='' dangerouslySetInnerHTML={{ __html: sections[activeSectionIndex]?.description }} />
            <button className='btn continue_btn' onClick={() => handleSectionClick(sections[activeSectionIndex]?.text)}>Continue</button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Complete Modal */}
      <Modal className={`dashboard_modals comleted_modal ${theme}`} show={showCompleteModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <div className='icons'>
            <img src={checkCompany && checkCompany !== 'notcompleted'?Medal:siteLogo} alt="" />
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className='modal_content'>
            {
              checkCompany && checkCompany === 'notcompleted'?
              <h1 className='heading'>Welcome to My First Job!</h1>
              :<h1 className='heading'>{stepTitle} Completed!</h1>
            }

            {
              checkCompany && checkCompany === 'notcompleted' &&
              <div>
                <div className="make_resume_content_block">
                  <div className="make_resume_content">
                    <p className="src_desc"> We’re excited to have you join us on My First Job, the platform that’s changing the way employers and first-time job seekers connect. Our mission is to help you find the right candidates, foster growth, and build stronger teams from the start. </p>
                  </div>
                  <div className="make_resume_content">
                    <h2 className="mrc_title"> How It Works </h2>
                      <ul className="">
                        <li> <b>Create Your Company Profile:</b> Share what makes your company special—your values, culture, and mission. This will help candidates determine whether your workplace is the right fit for them. </li>
                        <li> <b>Get Matched with Candidates:</b> Our platform uses smart matching to pair your team with candidates whose strengths and personalities align with your needs. </li>
                        <li> <b>One-Click Job Applications:</b> Candidates use their profiles to apply directly to your jobs with ease. No more complicated processes—just fast and focused applications. </li>
                        <li> <b>Develop Skills on the Go:</b> Through our built-in LMS, centered around soft skill development, candidates earn badges and level up their soft skills—giving you a stronger, more prepared workforce. </li>
                      </ul>
                  </div>
                  <div className="make_resume_content">
                    <h2 className="mrc_title"> Why It’s Different </h2>
                      <p className="src_desc"> Unlike traditional job boards, My First Job is designed to focus on <b>people, not just resumes</b>. Our smart matching system ensures that your new hires align with your company’s mission and values from day one, resulting in better onboarding experiences and more engaged employees.</p>
                  </div>
                  <div className="make_resume_content">
                    <h2 className="mrc_title"> <b>Ready to discover your perfect match?</b> </h2>
                      <p className="src_desc"> Click <b>Continue</b> to get started and find the perfect match for your company! </p>
                  </div>
                </div>
              </div>
            }

            {firstInactiveSection && (
              <>
                <button className='btn continue_btn' onClick={()=>{handleOpenModal(firstInactiveIndex)}}>Continue To {firstInactiveSection.text}</button>
              </>
            )}

            <button className='btn continue_btn' onClick={handleCloseModal}>Close</button>
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default ManagerDashboard;
