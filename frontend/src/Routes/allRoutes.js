import React from "react";
import { Navigate } from "react-router-dom";

/** Routes */

import Login from '../pages/Authentication/login';
import ForgotPassword from '../pages/Authentication/ForgotPassword/index';

import Dashboard from '../pages/Dashboard/index';
import MyApplication from '../pages/Dashboard/MyApplication';
import PersonalDetail from '../pages/Dashboard/personalDetail/PersonalDetail';

import Chat from '../pages/Chat/Chat';
import AddYourChild from '../pages/Dashboard/YourChild/AddYourChild';
import MemberInfo from '../pages/Dashboard/YourChild/MemberInfo';
import MemberDetails from '../pages/Dashboard/YourChild/MemberDetails';



import ManageRole from '../pages/Dashboard/ManageRole/ManageRole';
import AddRole from '../pages/Dashboard/ManageRole/AddRole';

import ManageSubUser from '../pages/Dashboard/ManageRole/ManageSubUser';
import AddSubUser from '../pages/Dashboard/ManageRole/AddSubUser';
import CompanyProfile from '../pages/Dashboard/ManagerDashboard/CompanyProfile';

import Subscription from "../pages/Dashboard/Subscription/Index";

import ObjectivesAndSummary from '../pages/Dashboard/ObjectivesAndSummary/ObjectivesAndSummary';
import SkillsAssessment from '../pages/Dashboard/SkillsAssessment/SkillsAssessment';
import VolunteerExperience from '../pages/Dashboard/VolunteerExperience/VolunteerExperience';
import Education from '../pages/Dashboard/Education/Education';
import Awards from '../pages/Dashboard/AwardsandAchievements/Awards';
import Certifications from '../pages/Dashboard/CertificationsandTraining/Certifications';

import WorkExperience from '../pages/Dashboard/WorkExperience/WorkExperience';
import References from '../pages/Dashboard/References/References';
import Hobbies from '../pages/Dashboard/Hobbies/Hobbies';
import Extracurricular from '../pages/Dashboard/ExtracurricularActivities/Extracurricular';

import Jobs from '../pages/Dashboard/Jobs/Jobs';
import MatchedJob from '../pages/Dashboard/Jobs/MatchedJob';
import JobDetail from '../pages/Dashboard/Jobs/JobDetail';

/*  */
import JobPreferences from '../pages/Dashboard/Jobs/JobPreferences';

import Candidates from '../pages/Dashboard/Candidates/Candidates';
import SelectJob from '../pages/Dashboard/Candidates/SelectJob';
import CandidateInfo from '../pages/Dashboard/Candidates/CandidateInfo';
import Applicants from '../pages/Dashboard/Candidates/Applicants';

import CompanyDetail from '../pages/Dashboard/Company/CompanyDetail';

import JobOpenings from '../pages/Dashboard/JobOpenings/index';
import PostJob from '../pages/Dashboard/JobOpenings/PostJob';
import JobReview from '../pages/Dashboard/JobOpenings/JobReview';
import JobDetails from '../pages/Dashboard/JobOpenings/JobDetails';


/*  */

import DefaultResume from '../pages/Dashboard/Resume/DefaultResume';
import ClassicResume from '../pages/Dashboard/Resume/ClassicResume';
import DarkResume from '../pages/Dashboard/Resume/DarkResume';
import Resume from '../pages/Dashboard/Resume/Resume';
import ModernEdge from '../pages/Dashboard/Resume/ModernEdge';


/*  */

import PersonalityProfile from '../pages/Aassessments/PersonalityProfile/Index';
import EmployersAassessments from '../pages/Aassessments/EmployersAassessments/Index';
import EmployeesAassessments from '../pages/Aassessments/EmployeesAassessments/Index';


/* 1st milestone */
import Wallet from '../pages/Wallet/index';
import Package from '../pages/Wallet/package';


// import ParentWallet from '../pages/ParentWallet/index';
// import CreditPackages from '../pages/ParentWallet/CreditPackages';
// import StudentCreditPackages from '../pages/Wallet/CreditPackages';

/* 2nd milestone */

import LearningPath from '../pages/LearningPath/index';
import LearningPathDetail from '../pages/LearningPath/LearningPathDetail';
import SkillDetail from '../pages/LearningPath/SkillDetail';
import MyLearning from '../pages/LearningPath/MyLearning';
import MySkills from '../pages/LearningPath/MySkill';
import MySkillDetail from '../pages/LearningPath/MySkillDetail';
import AssessmentDetail from '../pages/LearningPath/AssessmentDetail';


/* 3rd milestone */

import Leaderboard from '../pages/Leaderboard/index';
import Error404 from '../pages/Error/Error404';

import GuidentCounsellor from "../pages/Aassessments/GuidentCounsellor/index";

import Rewards from "../pages/Rewards/Index";
import RewardDetail from "../pages/Rewards/RewardDetail";
import RewardOrders from "../pages/Rewards/RewardOrders";
import ProgressDashboard from "../pages/ProgressDashboard/Index";

import Result from "../pages/Result/Index";


/** -----  */
import Resources from "../pages/Resources/Resources";
import ResourceDetail from "../pages/Resources/ResourceDetail";


import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import ScrollerChecker from '../pages/Chat/ScrollerChecker';

import Checkout from '../pages/Checkout/Index';
import CheckoutResponse from '../pages/Checkout/Response';

/* new page route */

import LearningPathNew from '../pages/LearningPathNew/index';



//After login

const authProtectedRoutes = [

  // authentication pages
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/chat", component: <Chat /> },

  { path: "/default-resume", component: <DefaultResume /> },
  { path: "/classic-resume", component: <ClassicResume /> },
  { path: "/dark-resume", component: <DarkResume /> },
  { path: "/modern-edge-resume", component: <ModernEdge /> },

  { path: "/jobs", component: <Jobs /> },

  { path: "/resources", component: <Resources /> }, //manager
  { path: "/resource-detail/:key", component: <ResourceDetail /> }, //manager

  /*  */

  { path: "/wallet", component: <Wallet /> }, //students\parents
  { path: "/packages", component: <Package /> }, //students\parents
  { path: "/checkout/:key", component: <Checkout /> }, //students\parents
  { path: "/checkout-respose", component: <CheckoutResponse /> }, //students\parents


  //{ path: "/parent-wallet", component: <ParentWallet /> }, //parents
  //{ path: "/student-credit-packages", component: <StudentCreditPackages /> }, //students
  //{ path: "/credit-packages", component: <CreditPackages /> },


  { path: "/public-resume/:key/:user", component: <Resume /> }, //students

  { path: "/leaderboard", component: <Leaderboard /> }, //parents
  { path: "/products", component: <Rewards /> }, //parents
  { path: "/product-detail/:name/:key", component: <RewardDetail /> },  //parents
  { path: "/product-orders", component: <RewardOrders /> }, //parents

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },

  { path: "*", component: <Error404 /> }

];

const studentRoutes = [

  { path: "/my-application", component: <MyApplication /> }, //students
  { path: "/personal-detail", component: <PersonalDetail /> }, //students
  { path: "/objectives-summary", component: <ObjectivesAndSummary /> }, //students

  { path: "/awards-and-achievements", component: <Awards /> }, //students
  { path: "/skills-assessment", component: <SkillsAssessment /> }, //students
  { path: "/volunteer-experience", component: <VolunteerExperience /> }, //students
  { path: "/education", component: <Education /> }, //students
  { path: "/certification-and-training", component: <Certifications /> }, //students

  { path: "/work-experience", component: <WorkExperience /> }, //students
  { path: "/references", component: <References /> }, //students
  { path: "/hobbies-and-interests", component: <Hobbies /> }, //students

  { path: "/extracurricular-activities", component: <Extracurricular /> }, //students
  { path: "/matched-jobs", component: <MatchedJob /> }, //students
  { path: "/job-detail/:key", component: <JobDetail /> }, //students
  { path: "/job-preferences", component: <JobPreferences /> }, //students
  { path: "/company-detail/:key", component: <CompanyDetail /> }, //students
  { path: "/resume/:key", component: <Resume /> }, //students

  { path: "/guidance-counselor", component: <GuidentCounsellor /> }, //students
  { path: "/personality-profile", component: <PersonalityProfile /> }, //students
  { path: "/employees-assessments", component: <EmployeesAassessments /> }, //students

  { path: "/learning-path-new", component: <LearningPath /> },
  { path: "/learning-path", component: <LearningPathNew /> },
  { path: "/learning-path-detail/:key", component: <LearningPathDetail /> },
  { path: "/skill-detail/:key", component: <SkillDetail /> },

  { path: "/my-learning", component: <MyLearning /> },
  { path: "/my-skills/:key", component: <MySkills /> },
  { path: "/my-skills-detail/:key", component: <MySkillDetail /> },
  { path: "/my-assessment-detail/:key", component: <AssessmentDetail /> },

  { path: "/result/:key", component: <Result /> }, //parents




];

const parentsRoutes = [

  { path: "/add-your-child", component: <AddYourChild /> }, //parents
  { path: "/member-info/:key", component: <MemberInfo /> }, //parents
  { path: "/member-details/:key", component: <MemberDetails /> }, //parents

  //{ path: "/progress-dashboard", component: <ProgressDashboard /> }, //parents

  { path: "/scroller", component: <ScrollerChecker /> }, //parents
];

const managerRoutes = [

  { path: "/manage-role", component: <ManageRole /> }, //manager
  { path: "/add-role", component: <AddRole /> }, //manager
  { path: "/edit-role/:key", component: <AddRole /> }, //manager
  { path: "/manage-sub-user", component: <ManageSubUser /> }, //manager
  { path: "/add-sub-user", component: <AddSubUser /> }, //manager
  { path: "/edit-sub-user/:key", component: <AddSubUser /> }, //manager
  { path: "/company-profile", component: <CompanyProfile /> }, //manager

  { path: "/select-job", component: <SelectJob /> }, //manager
  { path: "/candidates/:key", component: <Candidates /> }, //manager
  { path: "/candidate-info/:key/:job?", component: <CandidateInfo /> }, //manager
  { path: "/applicants", component: <Applicants /> }, //manager

  { path: "/job-openings", component: <JobOpenings /> }, //manager
  { path: "/post-job/:key?", component: <PostJob /> }, //manager
  { path: "/job-review/:key", component: <JobReview /> }, //manager
  { path: "/job-details/:key", component: <JobDetails /> }, //manager

  { path: "/resume/:key/:user", component: <Resume /> }, //manager
  { path: "/employers-assessments", component: <EmployersAassessments /> }, //manager

  { path: "/subscription", component: <Subscription /> }, //manager

];

const publicRoutes = [
  // Authentication Page
  { path: "/login/:key?", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path:"/linkedin", component: <LinkedInCallback /> },
  { path: "/app-resume/:key/:user", component: <Resume /> }, //students

];

export { authProtectedRoutes, publicRoutes, studentRoutes, parentsRoutes, managerRoutes };
