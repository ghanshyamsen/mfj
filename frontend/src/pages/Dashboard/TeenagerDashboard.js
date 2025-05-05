import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link, useNavigate } from 'react-router-dom';

import './index.css'

import siteLogo from '../../assets/images/logo.png';

import Briefcase from '../../assets/images/Briefcase.svg';
import Books from '../../assets/images/Books.svg';
import Pencil from '../../assets/images/pencil.png';
import Person from '../../assets/images/Person.svg';
import IncomingEnvelope from '../../assets/images/IncomingEnvelope.svg';
import GraduationCap from '../../assets/images/GraduationCap.svg';

import ManLiftingWeights from '../../assets/images/ManLiftingWeights.svg';
import OfficeBuilding from '../../assets/images/OfficeBuilding.svg';
import SportsMedal from '../../assets/images/SportsMedal.svg';
import CheckMark from '../../assets/images/award_start.png';
import LightBulb from '../../assets/images/LightBulb.svg';
import Handshake from '../../assets/images/Handshake.svg';
import Medal from '../../assets/images/Medal2.png';
import Medal1 from '../../assets/images/Medal.png';
import SweetAlert from 'react-bootstrap-sweetalert';

import DefaultResume from '../../assets/images/156.png';
import ClassicResume from '../../assets/images/157.png';
import DarkResume from '../../assets/images/158.png';

import Resume4 from '../../assets/images/resume4.png';
import Resume5 from '../../assets/images/resume5.png';
import Resume6 from '../../assets/images/resume6.png';
import Resume7 from '../../assets/images/resume7.png';
import Resume8 from '../../assets/images/resume8.png';
import Resume9 from '../../assets/images/resume9.png';
import Resume10 from '../../assets/images/resume10.png';

import Coin from '../../assets/images/coin.png';
import Share from '../../assets/images/mynaui_share.svg';
import JobSearch from '../../assets/images/hugeicons_job-search.svg';
import JobLink from '../../assets/images/hugeicons_job-link.svg';
import HiredJob from '../../assets/images/hugeicons_new-job.svg';
import Learn from '../../assets/images/Maskgroup.svg';
import Copy from '../../assets/images/lucide_copy.svg';
import Rewards from '../../assets/images/rewards.png';
import RewardOrders from '../../assets/images/rewardsorder.png';


import { Skeleton } from 'primereact/skeleton';

import userDataHook from "../../userDataHook";
import userStatusHook from "../../userStatusHook";
import { useProfile } from '../../ProfileContext';
import Badges from './Badges';
import PurchaseModel from '../../BuyCreditModal';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';


import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const TeenagerDashboard = () => {

  const {theme, profileName} = useProfile();
  const TOKEN = localStorage.getItem('token');
  const userData = userDataHook();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [activeSections, setActiveSections] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [applications, setApplications] = useState([]);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [badges, setBadges] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [stepTitle, setStepTitle] = useState('');
  const [refCode, setRefCode] = useState(userData?._id);

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const configData = JSON.parse(localStorage.getItem('ConfigData'));
  const [User, setUser] = useState(userData||JSON.parse(localStorage.getItem('userData')));
  const [showShare, setShowShare] = useState(false);

  const getResume = () => {
    return userStatusHook();
  }

  const activitie_visible_status = getResume();

  const sections = [
    /* {
      icon: Person,
      text: 'Personal Details',
      activitieStatus: activitie_visible_status?.data?.personal_detail_complete_status,
      link:'/personal-detail',
      description: ``
    }, */
    {
      icon: Pencil,
      text: 'Personal Summary',
      activitieStatus: activitie_visible_status?.data?.objective_complete_status,
      link:'/objectives-summary',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Personal Summary Section </h2>
            <p class="src_desc"> This section will help you craft a strong personal summary for your resume. A well-written personal summary acts as an elevator pitch that highlights your goals and qualifications, helping you stand out to potential employers. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You’ll be guided through a simple process to create a concise and impactful personal summary. </li>
                <li> You’ll answer a few quick questions about your skills, experiences, and career goals. </li>
                <li> We’ll use your answers and some AI to help you create a personal summary that makes a great first impression. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> By the end of this section, you’ll have a personal summary that grabs the attention of employers. This summary will show them that you understand the role you're applying for and how you can contribute to their company. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to create a personal summary that shines? </h2>
              <p class="src_desc"> Click ‘Continue’ to get started! </p>
          </div>
        </div>`,
      payload: {
        objective_complete_status:true
      },
      skip:false
    },
    {
      icon: Briefcase,
      text: 'Job Preferences',
      activitieStatus: activitie_visible_status?.data?.job_prefernces_complete_status,
      link:'/job-preferences',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Job Preferences Section </h2>
            <p class="src_desc"> This section is your chance to tell potential employers about the types of jobs that excite you and why. Even if you’ve never worked before, you probably have an idea of what interests you—whether it's working outdoors, thriving in busy environments like restaurants, or putting your organizational skills to use. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You’ll select from a list of job titles and industries that match your interests. </li>
                <li> If you have specific roles in mind, you can add your own job preferences. </li>
                <li> This section will help us match you to roles where you can shine. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> By the end of this section, you’ll have identified the job roles that feel like the best fit for you, where you can grow, learn, and start building your career path. Think of this as setting the stage for your future work life by highlighting the environments and roles where you believe you'll thrive the most. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to share your job preferences? </h2>
              <p class="src_desc"> Click ‘Continue’ to get started! </p>
          </div>
        </div>
      `,
      payload: {
        job_prefernces_complete_status:true
      },
      skip:false
    },
    {
      icon: OfficeBuilding,
      text: 'Work Experience',
      activitieStatus: activitie_visible_status?.data?.work_experience_status,
      link:'/work-experience',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Work Experience Section </h2>
            <p class="src_desc"> Even if you’ve never held a formal job, this section is still an essential part of your resume and can be adapted to showcase any informal work experience you may have had, such as babysitting, lawn mowing, or helping with a family business. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You can list any work experience, whether paid, unpaid, or informal. </li>
                <li> This section highlights your ability to manage tasks, collaborate with others, and show commitment. </li>
                <li> Employers value your willingness to take on responsibility and your eagerness to contribute. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Your work experience demonstrates valuable qualities like punctuality, teamwork, and problem-solving. Whether formal or informal, it shows employers that you have the skills and mindset to succeed in a job. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to add your work experience? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed or ‘Skip’ if you don’t have prior work experience. </p>
          </div>
        </div>
      `,
      payload: {
        work_experience_status:true
      },
      skipText:`If you don't have any prior work experience, please click 'Skip'`,
      skip:true
    },
    {
      icon: Books,
      text: 'Education',
      activitieStatus: activitie_visible_status?.data?.education_complete_status,
      link:'/education',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Education Section </h2>
            <p class="src_desc"> Your education is a crucial building block for your future career. Employers look at your educational background to understand your level of knowledge and skills in certain areas. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You’ll enter details about your education, including schools attended, courses taken, and any relevant information. </li>
                <li> This section shows employers your commitment to learning and growth, especially if you’re applying for your first job. </li>
                <li> Even without work experience, showcasing your education can highlight your readiness for new challenges. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> For teenagers seeking their first job, your education demonstrates dedication and a willingness to grow. Employers value individuals who take learning seriously, as it indicates you’re ready to invest in yourself and succeed in a job. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to list your education details? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed! </p>
          </div>
        </div>`,
      payload: {
        education_complete_status:true
      },
      skip:false
    },
    {
      icon: CheckMark,
      text: 'Awards and Achievements',
      activitieStatus: activitie_visible_status?.data?.awards_achievments_status,
      link:'/awards-and-achievements',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Awards and Achievements Section </h2>
            <p class="src_desc"> This section is all about showcasing the accomplishments that make you stand out. Whether it’s an award, an extraordinary achievement, or recognition for your hard work, this is your chance to highlight a part of your unique story. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You can list any awards or achievements you've earned in school, sports, volunteering, or hobbies. </li>
                <li> Sharing these accomplishments helps employers see your potential for success and what makes you different from other candidates. </li>
                <li> If you don’t have any awards yet, that’s okay! This section is just one of many ways to show your strengths. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Listing your awards and achievements sets you apart. It demonstrates to employers that you are driven, talented, and committed. These achievements speak volumes about your work ethic and potential for growth in the workplace. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to share your accomplishments? </h2>
              <p class="src_desc"> Click ‘Continue’ to add your achievements or ‘Skip’ if you don’t have anything to list. </p>
          </div>
        </div>
      `,
      payload: {
        awards_achievments_status:true
      },
      skipText: `If you don't have any prior awards or achievements, please click 'Skip'`,
      skip:true
    },
    {
      icon: GraduationCap,
      text: 'Certifications and Training',
      activitieStatus: activitie_visible_status?.data?.certification_status,
      link:'/certification-and-training',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Certifications and Training Section </h2>
            <p class="src_desc"> Certifications and training courses can boost your skills and qualifications, making you stand out as a stronger candidate. Whether you’ve completed formal courses or learned valuable skills, this section is where you can highlight those accomplishments. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> List any certifications or training programs you've completed, no matter how big or small. </li>
                <li> These credentials help show employers that you're committed to continuous learning and growth. </li>
                <li> Even if you don’t have formal certifications yet, you’re showing initiative just by exploring new opportunities to develop yourself. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Including certifications or training on your resume demonstrates your expertise in certain areas and your dedication to professional growth. Some job types may also require specific certifications for the position. These qualifications help set you apart and prove you can contribute to particular roles or industries. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to add your certifications? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed or ‘Skip’ if you don’t have anything to list.  </p>
          </div>
        </div>
      `,
      payload: {
        certification_status:true
      },
      skipText: `If you don't have any prior certifications or training, please click 'Skip'`,
      skip:true
    },
    {
      icon: SportsMedal,
      text: 'Extracurricular Activities',
      activitieStatus: activitie_visible_status?.data?.activitie_complete_status,
      link:'/extracurricular-activities',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Extracurricular Activities Section </h2>
            <p class="src_desc"> Extracurricular activities are a great way to show employers that you're well-rounded and capable of balancing multiple responsibilities. These activities also help demonstrate essential skills like leadership, teamwork, and time management. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You can list any extracurricular activities you’ve participated in, such as clubs, camps, or sports.  </li>
                <li> These activities help show employers that you’re proactive and dedicated to your personal growth. </li>
                <li> Even if you haven’t participated in formal activities, any ongoing commitment or project you’ve been a part of can count! </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Extracurricular activities give you an edge by showing you’ve developed important skills beyond the classroom. Highlighting your involvement in these activities can help employers see that you’re committed, reliable, and able to handle responsibilities. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to showcase your extracurricular activities? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed or ‘Skip’ if you don’t have any activities to list. </p>
          </div>
        </div>
      `,
      payload: {
        activitie_complete_status:true
      },
      skipText: `If you haven't participated in any extracurricular activities, please click 'Skip'`,
      skip:true
    },
    {
      icon: Handshake,
      text: 'Volunteer Experience',
      activitieStatus: activitie_visible_status?.data?.volunteer_complete_status,
      link:'/volunteer-experience',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Volunteer Experience Section </h2>
            <p class="src_desc"> Including volunteer work on your resume demonstrates your commitment to helping others and giving back to your community. It’s a powerful way to show employers the skills and values you’ve gained outside of a traditional job setting. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> List any volunteer work you’ve participated in, whether it’s a one-time event or an ongoing commitment. </li>
                <li> Volunteering shows your character, work ethic, and passion for making a difference. </li>
                <li> Even small acts of service, like helping at a school event or community project, can showcase your initiative and dedication. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Volunteer experience highlights your willingness to go above and beyond, proving that you care about more than just a paycheck. It’s a great way to demonstrate important qualities like teamwork, leadership, and empathy—traits that employers highly value. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to share your volunteer experience? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed or ‘Skip’ if you don’t have any volunteer experience. </p>
          </div>
        </div>
      `,
      payload: {
        volunteer_complete_status:true
      },
      skipText: `If you don't have any prior volunteer experience, please click 'Skip'`,
      skip:true
    },
    {
      icon: LightBulb,
      text: 'Hobbies and Interests',
      activitieStatus: activitie_visible_status?.data?.hobbies_status,
      link:'/hobbies-and-interests',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Hobbies and Interests Section </h2>
            <p class="src_desc"> Your hobbies and interests can tell employers a lot about who you are outside of work. They offer a glimpse into your personality, passions, and what makes you unique. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> List any hobbies or interests that reflect your personality, whether it’s sports, music, reading, gaming, or anything you enjoy. Be open and honest, as your interests are what make you unique. </li>
                <li> Including these details shows that you're well-rounded and can help spark conversations during interviews. </li>
                <li> Don’t underestimate the value of your interests—these can make you a memorable candidate! </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Employers want to get to know the real you, and sharing your hobbies can help them see how you might fit into their team or company culture. Plus, these personal interests can highlight traits like creativity, teamwork, or dedication that translate into the workplace. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to share your hobbies and interests? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed! </p>
          </div>
        </div>
      `,
      payload: {
        hobbies_status:true
      },
      skip:false
    },
    {
      icon: IncomingEnvelope,
      text: 'References',
      activitieStatus: activitie_visible_status?.data?.references_status,
      link:'/references',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the References Section </h2>
            <p class="src_desc"> References are individuals who can vouch for your character, skills, and experience. They provide potential employers with an external perspective on your abilities and can confirm the information on your resume. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> List individuals who can speak to your skills, work ethic, or character, such as teachers, coaches, or past supervisors. </li>
                <li> Make sure to ask their permission before listing them as a reference. </li>
                <li> Including strong references shows that you have a network of support and people who believe in your qualifications. Your goal should be to build this network over time.  </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> References help employers validate your skills and experience. Having a reliable reference shows employers that others trust you, support you, and can attest to the great work you do. It also provides additional credibility to everything you've included in your resume. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to add your references? </h2>
              <p class="src_desc"> Click ‘Continue’ to proceed or ‘Skip’ if you don’t have any references. </p>
          </div>
        </div>
      `,
      payload: {
        references_status:true
      },
      skipText: `If you don't have any references, please click 'Skip'`,
      skip:true
    },
    {
      icon: Person,
      text: 'Personality Assessment',
      activitieStatus: activitie_visible_status?.data?.personality_assessment_complete_status,
      link:'/employees-assessments',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Personality Assessment Section </h2>
            <p class="src_desc"> The Personality Assessment helps you uncover your unique traits, behaviors, and preferences. By understanding your natural strengths and areas for development, you’ll gain valuable insights into how you can grow both personally and professionally. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works </h2>
              <ul class="">
                <li> You'll answer a series of questions designed to evaluate your personality and innate abilities.  </li>
                <li> This assessment helps us match you with job roles and employers that align with your strengths and work-learning styles. </li>
                <li> It’s not about right or wrong answers—it's about understanding what makes you, you. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters </h2>
              <p class="src_desc"> Employers are looking for more than just skills—they want to know who you are as a person. This assessment helps ensure that you're matched with opportunities that suit your personality and allow you to thrive. By recognizing your traits, you can make informed decisions about your career path, leading to a more fulfilling work experience. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to discover more about yourself and how you fit into the working world? </h2>
              <p class="src_desc"> Click ‘Continue’ to begin the assessment! </p>
          </div>
        </div>
      `,
      payload: {
        personality_assessment_complete_status:true
      },
      skip:false
    },
    {
      icon: ManLiftingWeights,
      text: 'Skills',
      activitieStatus: activitie_visible_status?.data?.skills_complete_status,
      link:'/skills-assessment',
      description: `
        <div class="make_resume_content_block">
          <div class="make_resume_content">
            <h2 class="mrc_heading"> Welcome to the Soft Skills Assessment Test! </h2>
            <p class="src_desc"> This short test is designed to help you discover your natural strengths in key soft skills. Soft skills are the abilities that help you communicate, work well with others, and adapt to new situations—skills that are important in your first job and beyond. </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> How It Works  </h2>
              <ul class="">
                <li> You’ll answer 15 questions based on everyday situations you might encounter in your life. </li>
                <li> Each question has four options—just pick the one that best describes how you would respond. </li>
                <li> There are no right or wrong answers. This test is all about understanding what comes naturally to you. </li>
              </ul>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Why It Matters  </h2>
             <p class="src_desc"> By the end of the test, you’ll learn about the top 5 soft skills you already have. Knowing these strengths can help you make the most of them in school, work, and social settings.  </p>
          </div>
          <div class="make_resume_content">
            <h2 class="mrc_title"> Ready to find out what your natural strengths are?  </h2>
             <p class="src_desc"> Click Start to begin the test! </p>
          </div>
        </div>`,
      payload: {
        skills_complete_status:true
      },
      skip:false,
    }
  ];

  localStorage.setItem('personality_assessment',activitie_visible_status?.data?.personality_assessment_complete_status);

  const stableData = useMemo(() => {
    return activitie_visible_status?.data?activitie_visible_status.data.skills_assessment : [];
  }, [activitie_visible_status?.data]);

  useEffect(() => {
    setTimeout(() => {
      fetchResuneBuilder();
    }, 1000);

    getPlans();
  }, []);

  const getPlans = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-plans?keys=life_time_access,all_feature_access`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setPlans(result.data);
      }
    })
    .catch((error) => console.error(error))
    .finally(() => setLoadingSkeleton(false));
  }

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

        if((result?.data && !result?.data?.personal_detail_complete_status)){
          navigate('/personal-detail');
        }

        setBadges(result.data.skills);

      }else{
        navigate('/personal-detail');
      }
    })
    .catch((error) => console.error(error.message))
    .finally(() => setLoading(false));
  }

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
      case 'Job Preferences': navigate('/job-preferences'); break;
      case 'Personal Details': navigate('/personal-detail'); break;
      case 'Personal Summary': navigate('/objectives-summary'); break;
      case 'Skills': navigate('/skills-assessment'); break;
      case 'Extracurricular Activities': navigate('/extracurricular-activities'); break;
      case 'Education': navigate('/education'); break;
      case 'Volunteer Experience': navigate('/volunteer-experience'); break;
      case 'Awards and Achievements': navigate('/awards-and-achievements'); break;
      case 'Certifications and Training': navigate('/certification-and-training'); break;
      case 'Hobbies and Interests': navigate('/hobbies-and-interests'); break;
      case 'References': navigate('/references'); break;
      case 'Work Experience': navigate('/work-experience'); break;
      case 'Personality Assessment': navigate('/employees-assessments'); break;

    }

  };

  const completeAllProcess = () => {
    setShowBadgesModal(false);
    setShowCompleteModal(true);  // Close the complete modal
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
    setShowBadgesModal(false);
    setShowBuyModal(false);
  };

  const handleShowBadges = () => {
    setShowCompleteModal(false);  // Close the complete modal
    if(sessionStorage.getItem('step_title') == 'Skills'){
      setShowBadgesModal(false);   // Open the badges modal
    }
  };

  const GoApplicationList = () => {
    navigate('/my-application');
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'refused':
        return 'refused';
      case 'invited':
        return 'invited';
      default:
        return '';
    }
  };

  const OpenResumeModal = () => {
    setShowResumeModal(true);
  }

  const fetchApplications = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?user=${userData._id}&limit=5`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      setApplications(result.data);
    })
    .catch((error) => console.error(error.message))
    .finally(() => setLoading(false));
  }

  const skipStep = (payload) => {
    if(payload){

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${TOKEN}`);

      const raw = JSON.stringify(payload);

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.status == 'S'){
          sessionStorage.setItem('showCompleteModal', 'true');
          navigate('/');
        }
      })
      .catch((error) => console.error(error.message));
    }
  }

  const firstInactiveSection = sections.find(section => !section.activitieStatus);
  const firstInactiveIndex = sections.findIndex(section => !section.activitieStatus);

  useEffect(() => {
    if(activitie_visible_status.data){

      const showModal = sessionStorage.getItem('showCompleteModal') === 'true';

      setStepTitle(sessionStorage.getItem('step_title'));

      setTimeout(() => {
        if (showModal) {

          if(sessionStorage.getItem('step_title')==='Skills'){
            fetchResuneBuilder();
            setShowBadgesModal(true);
          }else{
            //setShowCompleteModal(true);
            if(sessionStorage.getItem('step_title') !== 'Personal Details' && firstInactiveIndex >= 0){
              setActiveSectionIndex(firstInactiveIndex);
              setShowModal(true);
            }

            if(sessionStorage.getItem('step_title') === 'Personal Details'){
              setShowCompleteModal(true);
            }

          }

          sessionStorage.removeItem('showCompleteModal'); // Clear to prevent future triggers
        }
      },500)
    }
    fetchApplications();
  }, [activitie_visible_status.data]);


  /* dummy data */
  const templates = {
    'default': {
      id: 1,
      key:'default',
      name: 'Default',
      url: '/resume/default',
      img: DefaultResume,
      price: 0,
      purchased:(User?.purchased_templates?.includes('default'))
    },
    'classic': {
      id: 2,
      key:'classic',
      name: 'Classic',
      url: '/resume/classic',
      img: ClassicResume,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('classic'))
    },
    'dark': {
      id: 3,
      key:'dark',
      name: 'Dark',
      url: '/resume/dark',
      img: DarkResume,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('dark'))
    },
    'modernedge': {
      id: 4,
      key:'modernedge',
      name: 'Edge',
      url: '/resume/modernedge',
      img: Resume4,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('modernedge'))
    },
    'vibrantflow': {
      id: 5,
      key:'vibrantflow',
      name: 'Vibrance',
      url: '/resume/vibrantflow',
      img: Resume5,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('vibrantflow'))
    },
    'boldcontrast': {
      id: 6,
      key:'boldcontrast',
      name: 'Contrast',
      url: '/resume/boldcontrast',
      img: Resume6,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('boldcontrast'))
    },
    'creativegrid': {
      id: 7,
      key:'creativegrid',
      name: 'Gridline',
      url: '/resume/creativegrid',
      img: Resume7,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('creativegrid'))
    },
    'professionalyellow': {
      id: 8,
      key:'professionalyellow',
      name: 'Sunrise',
      url: '/resume/professionalyellow',
      img: Resume8,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('professionalyellow'))
    },
    'elegantcurve': {
      id: 9,
      key:'elegantcurve',
      name: 'Curve',
      url: '/resume/elegantcurve',
      img: Resume9,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('elegantcurve'))
    },
    'friendlyprofile': {
      id: 10,
      key:'friendlyprofile',
      name: 'Persona',
      url: '/resume/friendlyprofile',
      img: Resume10,
      price: configData.resume_credit,
      purchased:(User?.purchased_templates?.includes('friendlyprofile'))
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState(templates.default); // Default to the first template
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState({});

  const handleCloseResumeModal = () => {
    setShowResumeModal(false);
  }

  const copyToClipboard = (data, type="Code") => {
    if (navigator.clipboard) {

      navigator.clipboard.writeText(data).then(() => {
        window.showToast(type+" copied to clipboard!", 'success');
      }).catch(console.error);

    } else {

      const textArea = document.createElement('textarea');
      textArea.value = data;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        window.showToast(type+" copied to clipboard!", 'success');
      } catch (err) {
        window.showToast("Failed to copy "+type+": " + err, 'error')
      }

      document.body.removeChild(textArea);
    }
  };

  const handleSelect = () => {
    if (selectedTemplate) {

      if(selectedTemplate.purchased){
        navigate(selectedTemplate.url);
      }else{
        buyModule({
          type:"template",
          id: selectedTemplate.key,
          name:selectedTemplate.name,
          price: selectedTemplate.price
        })
      }

    } else {
      alert("Please select a template first!");
    }
  };

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
        "type": data.type,
        "id": data.id,
        "name": data.name
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

          setShowBuyModal(false);

          localStorage.setItem('userData', JSON.stringify(result.data));
          setUser(result.data);

          window.showToast(result.message,'success');

          if(data.type === 'plan'){
            setLoadingSkeleton(true)
            getPlans();
          }

          if(data.type === 'template'){
            navigate(selectedTemplate.url);
          }

        }else{
          window.showToast(result.message,'error');
          event.target.disabled = false;
        }
    })
    .catch((error) => console.error(error));

  }

  return (
    <>

      <div className="dashboard_page teenager_dashboard_page common_background_block">

        <div className="dashboard_content_block">

          <div className='dcb_left_side_content'>
            {progress < 100 && <div className='dcb_block'>
              <h5 className='sub_text'>  {loading ? <Skeleton width="125px" /> : 'GETTING STARTED' } </h5>
              <h1 className='d_title'>
                {loading ? <Skeleton width="100%" height='40px' /> : `Hi ${profileName}${progress < 100 ? ', let’s finish setting up your account.':''}`}
              </h1>

              <div className='dlist_block'>
                <ul>
                  {sections.map((section, index) => !section.activitieStatus && (
                    loading ?
                    <li key={index}>
                      <Skeleton width="125px" height='36px' className={index % 2 === 0 ? 'even' : 'odd'} />
                    </li>
                    :
                    <li key={index}>
                      <Link
                        onClick={() => handleOpenModal(index)}
                      >
                        <span>{section.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>}

            {/* complete info */}
            {progress > 0 && <div className='dcb_block'>
              <h1 className='d_title'>
                {loading ? <Skeleton width="100%" height='40px' className='mb-2' /> : `${progress < 100 ? 'Completed':`Hi ${profileName},`}`}
                {!firstInactiveSection?.text &&  <span>Congratulations! <img style={{width: '18px'}} src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXekvZLLJ1yPgYSqwHr8wWAvhqDaJPUiJhNqApr8jBx3e_bb2koKzJjIdeXJaeM7pUH4MTkBugg7TZgdsei7kg81AY7Mmrz5m2VYfyomzrJdvHbINY3sEU201uaWufezKYdc-VlRaOKaLkYejyUdFaQbIrJj?key=A-6-sAfeWVJZ7f00MwfaZQ" /> You've completed all sections. Click on any section again to edit; otherwise, enjoy making new connections!</span>}
              </h1>


              <div className='dlist_block'>
                <ul>
                  {sections.map((section, index) => section.activitieStatus && (
                    loading ?
                    <li key={index}>
                      <Skeleton width="125px" height='36px' className={index % 2 === 0 ? 'even' : 'odd'} />
                    </li>:
                    <li key={index}>
                      <Link className={section.activitieStatus ? 'active' : ''} to={section.link}>
                        <span>{section.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='progress-bar-block'> {loading ? <Skeleton width="100%" height='6px' /> : <ProgressBar now={progress} /> } </div>

              {activeTab > 0 && (
                <div className=''>
                    {loading ? <div className="mt-3"> <Skeleton width="100%" height='46px' />  </div> :
                    <button className='btn see_all_btn' onClick={OpenResumeModal}> Select Resume Templete </button> }
                </div>
              )}
            </div>}

            <div className='dcb_linking_block'>
              <ul className=''>
                <li>
                    <Link to="/jobs">
                      {loading ? <Skeleton width="80%" height='24px' /> : <span> View Jobs </span> }
                      {loading ? <Skeleton width="24px" height='24px' className='ms-auto' /> : <img src={JobSearch} alt="" /> }
                    </Link>
                </li>
                <li>
                    <Link to="/my-application">
                      {loading ? <Skeleton width="80%" height='24px' /> : <span> Applied Jobs </span> }
                      {loading ? <Skeleton width="24px" height='24px' className='ms-auto' /> : <img src={JobLink} alt="" /> }
                    </Link>
                </li>
                <li>
                    <Link to="/my-application?st=hired">
                      {loading ? <Skeleton width="80%" height='24px' /> : <span> Hired Jobs </span> }
                      {loading ? <Skeleton width="24px" height='24px' className='ms-auto' /> : <img src={HiredJob} alt="" /> }
                    </Link>
                </li>
                <li>
                    <Link to="/learning-path">
                      {loading ? <Skeleton width="80%" height='24px' /> : <span> Learn </span> }
                      {loading ? <Skeleton width="24px" height='24px' className='ms-auto' /> : <img src={Learn} alt="" /> }
                    </Link>
                </li>
              </ul>
            </div>

            <Badges id={userData?._id} />
          </div>

          {/*  */}
          <div className='dcb_right_side_content'>
            <div className='dcbrsc_block avai_balance_block'>
              {loading ? <Skeleton width="80%" height='24px' className='mb-2' /> : <h2 className='av_title'> Available Balance </h2> }
              <div className='d-flex align-items-center justify-content-between'>
                {loading ? <Skeleton width="87px" height='26px' /> : <p className='mb-0 my_coin'> <img src={Coin} alt="" /> {userData?.user_credit?.toLocaleString('en')} </p> }
                {loading ? <Skeleton width="160px" height='33px' borderRadius="50px" /> : <Link className='btn new_common_btn' to='/packages'> Purchase Credits </Link> }
              </div>
            </div>

            {/*  */}
            {loading ?
              <div className='dcbrsc_block refer_friend_block'>
                <Skeleton width="50%" height='24px' className='mb-1' />
                <Skeleton width="100%" height='18px' className='mb-1' />
                <Skeleton width="100%" height='18px' className='mb-1' />
                <Skeleton width="100%" height='18px' className='mb-1' />
                <Skeleton width="100%" height='36px' borderRadius='50px' className='mb-2' />
                <Skeleton width="130px" className='m-auto' height='34px' borderRadius='50px' />
              </div>:
              <div className='dcbrsc_block refer_friend_block'>
                <h2 className='av_title'> Refer a Friend </h2>
                <p className='av_deciption'> Invite your friends to join My First Job & enjoy exclusive rewards together. Share the benefits and make the most of our referral program today! </p>

                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder={refCode}
                    value={refCode}
                    aria-label=""
                    readOnly
                    onChange={(e) => console.log(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={() => copyToClipboard(`${process.env.REACT_APP_URL}/login?ref=${refCode}`,'Link')}> <img src={Copy} alt="copy" /> Refer </Button>
                </InputGroup>

                <button type="button" className='btn share_btn' onClick={()=>{setShowShare(true)}}> <img src={Share} alt="" /> Share </button>

                {showShare && <div className="d-flex justify-content-center mt-2 social_icon_block" >
                  <EmailShareButton className="mx-1" url={`${process.env.REACT_APP_URL}/login?ref=${refCode}`}  >
                    <EmailIcon size={32} round={true}/>
                  </EmailShareButton>

                  <FacebookShareButton className="mx-1" url={`${process.env.REACT_APP_URL}/login?ref=${refCode}`}  >
                    <FacebookIcon size={32} round={true}/>
                  </FacebookShareButton>

                  <LinkedinShareButton className="mx-1" url={`${process.env.REACT_APP_URL}/login?ref=${refCode}`}  >
                    <LinkedinIcon size={32} round={true}/>
                  </LinkedinShareButton>

                  <TelegramShareButton className="mx-1" url={`${process.env.REACT_APP_URL}/login?ref=${refCode}`}  >
                    <TelegramIcon size={32} round={true}/>
                  </TelegramShareButton>

                  <WhatsappShareButton className="mx-1" url={`${process.env.REACT_APP_URL}/login?ref=${refCode}`}  >
                    <WhatsappIcon size={32} round={true}/>
                  </WhatsappShareButton>
                </div>}
              </div>
            }

            {/* Recent applications block */}
            {applications && applications.length > 0 && <div className="recent_block">
              <h1 className="rtitle"> {loading ? <Skeleton width="246px" height='2rem'/> : 'Recent applications' } </h1>
              <div className="recent_ul">
                <ul>
                  {applications.map((application, index) => (
                    (loading ?
                      <li key={index}>
                        <div className="icon"><Skeleton  shape="circle" size="3rem" /> </div>
                        <div className="rul_content">
                          <h4> <Skeleton width="100%" /> </h4>
                          <p> <Skeleton width="100%" /> </p>
                        </div>
                        <div className="status_text"> <Skeleton width="100%" /> </div>
                      </li>:
                      <li key={index}>
                        <Link to={`/job-detail/${application.job_id}`}>
                          <div className="icon"> {application.job_info.logo && <img src={application.job_info.logo} alt={`${application.job_info.job_position} Icon`} />} </div>
                          <div className="rul_content">
                            <h4>{application.job_info.job_position}</h4>
                            <p>{application.job_info.orgnaization}</p>
                          </div>
                          <div className={`status_text ${getStatusClass(application.status)}`}>
                            {application.status==='Invited'?'Hired':(application.status ==='Pending'?'In Review':'Not Hired')}
                          </div>
                        </Link>
                      </li>
                    )
                  ))}
                </ul>
                <div>
                  {loading ?
                    <Skeleton width="100%" height='50px' borderRadius='50px'/>:
                    <button className="btn see_all_btn" onClick={GoApplicationList}> See All </button>
                  }
                </div>
              </div>
            </div>}

            <div className='rewards_links_block'>

              <div className='reward_box'>
                {loading ?
                    <div className='d-flex'><Skeleton width="24px" height='24px' className='me-1 mb-3' /> <Skeleton width="70%" height='26px' /></div> :
                    <p className='reward_title'> <img src={Rewards} alt="copy" /> Reward Store </p>
                }
                  {loading ? <Skeleton width="120px" height='33px' borderRadius="50px" /> : <Link to="/products" className='btn new_common_btn'> View Store </Link> }
              </div>

              <div className='reward_box'>
                  {loading ?
                    <div className='d-flex'> <Skeleton width="24px" height='24px' className='me-1 mb-3' /> <Skeleton width="80%" height='26px' /> </div> :
                    <p className='reward_title'> <img src={RewardOrders} alt="copy" /> Reward Orders </p>
                  }
                  {loading ? <Skeleton width="120px" height='33px' borderRadius="50px" /> :  <Link to="/product-orders" className='btn new_common_btn'> View Orders </Link> }
              </div>

            </div>

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
        focusCancelBtn>
      </SweetAlert>

      {/* Modal block */}
      <Modal className={`dashboard_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <div className='icons'>
          {loading ? <Skeleton  shape="circle" size="4rem" /> :
            <img src={sections[activeSectionIndex]?.icon} alt="" /> }
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal_content'>
            {/* <h1 className='heading'> {loading ? <Skeleton width="100%" height='2rem' /> : `${sections[activeSectionIndex]?.text}` } </h1> */}
            {/* <h3 className=''>
              {loading ?
                <>
                  <Skeleton width="100%" className='mb-1' /><Skeleton width="100%"  className='mb-1'/>
                </>
                :
                (sections[activeSectionIndex]?.description && `Why is this section important for a resume?`)
              }
            </h3> */}
            <div className=''>
            {loading ?
              <>
                <Skeleton width="100%" className='mb-1' /><Skeleton width="100%"  className='mb-1'/>
                <Skeleton width="100%"  className='mb-1' /><Skeleton width="100%"  className='mb-1'/>
              </>
              :
              <div className='' dangerouslySetInnerHTML={{ __html: sections[activeSectionIndex]?.description }} />
            }
            </div>



            {loading ?
              <div className="mt-3"> <Skeleton width="100%" height='46px' />  </div>
            :
              <button className='btn continue_btn' onClick={() => handleSectionClick(sections[activeSectionIndex]?.text)}>{sections[activeSectionIndex]?.text =='Skills'?'Start':'Continue'}</button>
            }

            {
              (!sections[activeSectionIndex]?.activitieStatus && sections[activeSectionIndex]?.skip) &&
              <>
                <button className='btn continue_btn' onClick={()=>{skipStep(sections[activeSectionIndex]?.payload)}}>Skip</button>
                <small>{sections[activeSectionIndex]?.skipText}</small>
              </>
            }
          </div>
        </Modal.Body>
      </Modal>

      {/* Complete Modal */}
      <Modal className={`dashboard_modals comleted_modal ${theme}`} show={showCompleteModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <div className='icons'>
            <img src={stepTitle!=='Personal Details'?Medal:siteLogo} alt="" />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal_content'>

            {firstInactiveSection && stepTitle!=='Personal Details' && <h1 className='heading'>{`${stepTitle} Completed!`}</h1>}

            {!firstInactiveSection && <h1 className='heading'>Congratulations! Your Resume is Complete!</h1>}

            {stepTitle==='Personal Details' &&
              <div className="make_resume_content_block">
                <div className="make_resume_content">
                  <h2 className="mrc_heading">  Welcome to My First Job! </h2>
                  <p className="src_desc"> You're about to embark on an exciting journey toward landing your first job. This platform is designed to help you unlock opportunities tailored to your personality, needs, and preferences. </p>
                </div>
                <div className="make_resume_content">
                  <h2 className="mrc_title">  How It Works </h2>
                    <ul className="">
                      <li> Create a standout resume using our easy-to-follow tools.</li>
                      <li> Connect directly with employers looking for someone just like you.</li>
                      <li> Level up and explore interactive modules that build real-world soft skills.</li>
                    </ul>
                </div>
                <div className="make_resume_content">
                  <h2 className="mrc_title"> Why It Matters </h2>
                    <p className="src_desc"> By the end of your journey, you'll be equipped with the skills and confidence to apply for your first job and stand out to employers. Let’s pave the path to your first job together and make your dreams a reality! </p>
                </div>
                <div className="make_resume_content">
                  <h2 className="mrc_title"> Ready to get started? </h2>
                    <p className="src_desc"> Click 'Start Building Resume' to begin! </p>
                </div>
              </div>
            }

            {!firstInactiveSection && (
              <div>
                <div className="make_resume_content_block">
                  <div className="make_resume_content">
                    <p className="src_desc"> You’ve successfully completed your resume, and now it’s time to take the next exciting step. Your resume doubles as your profile, and it’s your key to applying for jobs with just one click. But that's not all—your profile helps match you with employers looking for someone with your unique skills and strengths.</p>
                  </div>
                  <div className="make_resume_content">
                    <h2 className="mrc_title">  What’s Next? </h2>
                      <ul className="">
                        <li> <b>Choose Your Layout:</b> Select a layout that best showcases your resume, highlighting your skills and achievements.</li>
                        <li> <b>Edit Anytime:</b> Once you've picked your layout, you can edit or update your information whenever needed. </li>
                        <li> <b>Get Matched:</b> With your profile ready, use our one-click “Get Matched” feature to connect with employers and find a job where you’ll feel comfortable, grow, and learn. </li>
                      </ul>
                  </div>
                  <div className="make_resume_content">
                    <h2 className="mrc_title"> Keep Building Your Skills </h2>
                      <p className="src_desc"> Your journey doesn’t stop here. Our platform includes an LMS (Learning Management System) designed to help you level up and earn new soft skills. There are 60 crucial soft skill badges to explore, each helping you become an even stronger candidate as you grow. </p>
                  </div>
                  <div className="make_resume_content">
                    <h2 className="mrc_title"> Ready to Dive In? </h2>
                      <p className="src_desc"> Click <b>‘Continue’</b> to finalize your resume layout, explore your profile, and start matching with employers for your first job! </p>
                  </div>
                </div>

                <button className='btn continue_btn' onClick={handleCloseModal}>Continue</button>
              </div>
            )}


            {firstInactiveSection && (
              <>
                <button className='btn continue_btn' onClick={()=>{handleOpenModal(firstInactiveIndex)}}>{stepTitle==='Personal Details'?`Start Building Resume`:`Continue To ${firstInactiveSection.text}`}</button>
              </>
            )}

            <button className='btn continue_btn' onClick={handleCloseModal}>Close</button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Objectives Modal */}
      <Modal className={`dashboard_modals Badges_modal comleted_modal ${theme}`} show={showBadgesModal} onHide={completeAllProcess} backdrop="static">
        <Modal.Header closeButton>
          <div className='icons'>
            <img src={Medal1} alt="" />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal_content'>
            <h1 className='heading'>Congratulations! You just earned your first 5 badges!</h1>
            <p className='description'> These badges showcase your top soft skills. Keep growing, level up your abilities, and unlock new opportunities ahead. </p>
            <div className='dlist_block'>
              <ul>
                {badges.map((bsection, index) => (
                  <li key={index}>
                    <Link className="" >
                      {bsection.image && <img src={bsection.image} alt="" />}
                      <span>{bsection.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <button className='btn continue_btn' onClick={completeAllProcess}>Save and Continue</button>
          </div>
        </Modal.Body>
      </Modal>

      {/* resume modal */}
      <Modal className={`dashboard_modals resume_modal ${theme}`} show={showResumeModal} onHide={handleCloseResumeModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Choose Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modal_content'>
                  <div className="resume_modal_contnet">
                  {Object.values(templates).map((template) => (
                    <div key={template.id} className="template-card">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          value={template.url}
                          checked={selectedTemplate.key === template.key}
                          onChange={() => { setSelectedTemplate(template) }}
                        />
                        <img src={template.img} alt={template.name} />
                        <div className="template_desc">
                          <span className="template_name">{template.name}</span>

                          {!template.purchased && template.price > 0 &&
                            <>
                              <span className="checkmark"></span>
                              <span className="template_price">
                                <img src={Coin} alt="coin" />
                                {template.price}
                              </span>
                            </>
                          }

                        </div>
                      </label>
                    </div>
                  ))}
                    </div>
                {/* Select Button */}
                {(selectedTemplate) && (
                  <div className="btnrow">
                    <button className="btn continue_btn" onClick={handleSelect}> Select </button>
                  </div>
                )}


                <div className="access_card_block mt-3">
                  <Row>
                    {
                      plans.map((value, index) => (
                          <Col sm={6} key={index}>
                              {loadingSkeleton ?
                                  <div className="lmsacc_card">
                                      <Skeleton width="10rem" height="1rem" className='mb-1' />
                                      <Skeleton width="10rem" height="1rem" className='mb-1' />
                                      <Skeleton width="10rem" height="1rem" className='mb-1' />

                                  </div>
                              :
                                  <div className={`lmsacc_card ${value.plan_key}`}>
                                      <h2 className='lmsacc_title'> {value.plan_name} </h2>
                                      <p className='lms_desc'> {value.plan_title} </p>
                                      <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> {value?.plan_price} </span> {value?.plan_price_text} </p>
                                      <div className='m-content' dangerouslySetInnerHTML={{ __html: (value.plan_description||'') }}></div>
                                      {/* <ul>
                                          <li>Includes Course Module</li>
                                          <li>Includes Full Learning Level</li>
                                          <li>Includes All Levels</li>
                                      </ul> */}
                                      <button type='button' className='btn assecc_btn' onClick={(e) => {
                                          buyModule({
                                              type:"plan",
                                              id: value._id,
                                              name:value.plan_name,
                                              price: value?.plan_price
                                          })
                                      }}> Get {value.plan_name} </button>
                                  </div>
                              }
                          </Col>
                      ))
                    }
                  </Row>
                </div>

                {/* Show the Purchase Modal if a paid template is selected */}
                {/* {showBuyModal && (
                  <BuyCreditModal showModal={showBuyModal} handleClose={handleCloseModal} purchaseModules={purchaseModules} />
                )} */}

            </div>
        </Modal.Body>
      </Modal>

      <PurchaseModel showModal={showBuyModal} setShowModal={setShowBuyModal} purchaseModules={purchaseModules} purchaseData={purchaseData} User={User}/>
    </>
  );
};

export default TeenagerDashboard;
