import React from "react";
import { Navigate } from "react-router-dom";

/** Routes */
//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";

import PasswordReset from "../pages/Authentication/PasswordReset";

//After login
import DashboardCrm from "../pages/Dashboard";
import Config from "../pages/SiteConfig/Config";

// Users
import User from "../pages/Users/User";
import ViewUser from "../pages/Users/ViewUser";

//Objective & Summary
import ObjectiveQuestion from "../pages/Objective/objective";
import EditObjectiveQuestion from "../pages/Objective/editObjective";

//Skills
import MasterList from "../pages/Skills/MasterList";
import ManageSkill from "../pages/Skills/ManageSkill";

//Volunteer Skills
import VolunteerList from "../pages/Skills/VolunteerSkillList";
import ManageVolunteerSkill from "../pages/Skills/ManageVolunteerSkill";

//Skills Assessment
import MasterAssessmentList from "../pages/SkillsAssessment/AssessmentList";
import ManageSkillsAssessment from "../pages/SkillsAssessment/ManageAssessment";

//Education Master Data
import SchoolList from "../pages/Education/SchoolList";
import ManageSchool from "../pages/Education/ManageSchool";
import AcademicList from "../pages/Education/AcademicList";
import ManageAcademic from "../pages/Education/ManageAcademic";
import CourseworkList from "../pages/Education/CourseworkList";
import ManageCoursework from "../pages/Education/ManageCoursework";

//Activities Category
import ActivitiesCategory from "../pages/ActivitieCategory/CategoryList";
import ManageActivitiesCategory from "../pages/ActivitieCategory/ManageCategory";

//Manage Extracurricular Activities
import ActivitieList from "../pages/ExtracurricularActivities/ActivitieList";
import ManageActivitie from "../pages/ExtracurricularActivities/ManageActivitie";

//Hobbies Category
import HobbiesCategory from "../pages/HobbiesCategory/CategoryList";
import ManageHobbiesCategory from "../pages/HobbiesCategory/ManageCategory";

//Hobbies & Interest
import HobbiesList from "../pages/Hobbies/HobbiesList";
import ManageHobbies from "../pages/Hobbies/ManageHobbies";

//Faq Category
import FCatList from "../pages/FaqCategory/CategoryList";
import ManageFCat from "../pages/FaqCategory/ManageCategory";

//Faq's
import FaqList from "../pages/Faqs/FaqList";
import ManageFaq from "../pages/Faqs/ManageFaq";

//Faq Category
import TCatList from "../pages/TutorialCategory/CategoryList";
import ManageTCat from "../pages/TutorialCategory/ManageCategory";

//Tutorials
import TutorialList from "../pages/Tutorial/TutorialList";
import ManageTutorial from "../pages/Tutorial/ManageTutorial";

//Jobs
import JobList from "../pages/Jobs/JobList";
import ManageJob from "../pages/Jobs/ManageJob";
import ViewJob from "../pages/Jobs/ViewJob";

// Job Suggestions
import JobSuggestions from "../pages/JobSuggestions/JobList";
import ManageSuggestion from "../pages/JobSuggestions/ManageSuggestion";

//Emails
import EmailList from "../pages/Static/EmailList";
import ManageEmail from "../pages/Static/ManageEmail";

// User Profile
import UserProfile from "../pages/Profile/user-profile";

//Careers
import CareerList from "../pages/Careers/CareerList";
import ManageCareer from "../pages/Careers/ManageCareer";

//Starter Job
import StarterJobList from "../pages/StarterJobs/JobList";
import ManageStarterJob from "../pages/StarterJobs/ManageJob";

//Employers Aassessments
import EmployersAassessmentsList from "../pages/EmployersAassessments/List";
import ManageEmployersAassessments from "../pages/EmployersAassessments/Manage";

//Employees Aassessments
import EmployeesAassessmentsList from "../pages/EmployeesAassessments/List";
import ManageEmployeesAassessments from "../pages/EmployeesAassessments/Manage";

//Employees Aassessments
import PersonalityProfileList from "../pages/PersonalityProfile/List";
import ManagePersonalityProfile from "../pages/PersonalityProfile/Manage";

//Resources
import ArticleCategory from "../pages/Resources/CategoryList";
import ManageArticleCategory from "../pages/Resources/ManageCategory";

import ArticleList from "../pages/Resources/List";
import ManageArticle from "../pages/Resources/Manage";

import PackageList from "../pages/Packages/List";
import ManagePackage from "../pages/Packages/Manage";

import TxnList from "../pages/Txn/List";
import ModuleTxnList from "../pages/Txn/Module";

/*LMS */
import SkillList from "../pages/Lms/Skills/List";
import ManageLmsSkill from "../pages/Lms/Skills/Manage";

import LearningPathList from "../pages/Lms/LearningPath/List";
import ManageLearningPath from "../pages/Lms/LearningPath/Manage";

import LearningMaterialList from "../pages/Lms/SkillMaterials/List";
import ManageLearningMaterial from "../pages/Lms/SkillMaterials/Manage";

import LmsReviewList from "../pages/Lms/Reviews/List";


import SkillAssessmentList from "../pages/Lms/SkillAssessment/List";
import ManageSkillAssessment from "../pages/Lms/SkillAssessment/Manage";

import JobCategoryList from "../pages/JobCategory/List";
import ManageJobCategory from "../pages/JobCategory/Manage";



/*MESSAGE TEMPLATE */
import Template from "../pages/Messaging/Template";
import MessagesList from "../pages/Messaging/MessagesList";
import BadgesList from "../pages/Messaging/BadgesList";
import ManageBadge from "../pages/Messaging/ManageBadge";

//Products
import ProductCategory from "../pages/Products/CategoryList";
import ManageProductCategory from "../pages/Products/ManageCategory";

import ProductList from "../pages/Products/List";
import ManageProduct from "../pages/Products/Manage";

import ProductTxnList from "../pages/Products/TxnList";

import RankList from "../pages/Rank/List";
import ManageRank from "../pages/Rank/Manage";

import LevelList from "../pages/Level/List";
import ManageLevel from "../pages/Level/Manage";

import PlanList from "../pages/Plans/List";
import ManagePlan from "../pages/Plans/Manage";


import JobTxnList from "../pages/Txn/JobTxnList";
import PlanTxnList from "../pages/Txn/PlanTxnList";


const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/site-configuration", component: <Config /> },

  /* Users */
  { path: "/users/:type", component: <User /> },
  { path: "/view-user/:key", component: <ViewUser /> },

  /* Emails */
  { path: "/email-list", component: <EmailList /> },
  { path: "/manage-email/:key", component: <ManageEmail /> },

  /* Objective Question */
  { path: "/objective-questions", component: <ObjectiveQuestion /> },
  {
    path: "/edit-objective-question/:key",
    component: <EditObjectiveQuestion />,
  },

  /* Skills */
  { path: "/skills/master-list", component: <MasterList /> },
  { path: "/skills/manage/:key?", component: <ManageSkill /> },

  /* Volunteer Skills */
  { path: "/skills/volunteer-list", component: <VolunteerList /> },
  {
    path: "/skills/manage-volunteer-skill/:key?",
    component: <ManageVolunteerSkill />,
  },

  /* Skills Assessment */
  { path: "/skills/assessment-list", component: <MasterAssessmentList /> },
  {
    path: "/skills/manage-assessment/:key?",
    component: <ManageSkillsAssessment />,
  },

  /* Education */
  { path: "/education/school-list", component: <SchoolList /> },
  { path: "/education/manage-school/:key?", component: <ManageSchool /> },
  { path: "/education/academic-list", component: <AcademicList /> },
  { path: "/education/manage-academic/:key?", component: <ManageAcademic /> },
  { path: "/education/coursework-list", component: <CourseworkList /> },
  {
    path: "/education/manage-coursework/:key?",
    component: <ManageCoursework />,
  },

  /* Extracurricular Activities */
  {
    path: "/activitie-category/master-list",
    component: <ActivitiesCategory />,
  },
  {
    path: "/activitie-category/manage/:key?",
    component: <ManageActivitiesCategory />,
  },

  /* Extracurricular Activities */
  { path: "/activitie/master-list", component: <ActivitieList /> },
  { path: "/activitie/manage/:key?", component: <ManageActivitie /> },

  /* Hobbies Category */
  { path: "/hobbies-category/master-list", component: <HobbiesCategory /> },
  {
    path: "/hobbies-category/manage/:key?",
    component: <ManageHobbiesCategory />,
  },

  /* Hobbies & Interest */
  { path: "/hobbies/master-list", component: <HobbiesList /> },
  { path: "hobbies/manage/:key?", component: <ManageHobbies /> },

  /* Faq Catgeory */
  { path: "/faq-category/master-list", component: <FCatList /> },
  { path: "/faq-category/manage/:key?", component: <ManageFCat /> },

  /* Faq's */
  { path: "/faq/master-list", component: <FaqList /> },
  { path: "/faq/manage/:key?", component: <ManageFaq /> },

  /* Tutorial Catgeory */
  { path: "/tutorial-category/master-list", component: <TCatList /> },
  { path: "/tutorial-category/manage/:key?", component: <ManageTCat /> },

  /* Tutorials */
  { path: "/tutorial/master-list", component: <TutorialList /> },
  { path: "/tutorial/manage/:key?", component: <ManageTutorial /> },

  /* Jobs */
  { path: "/job/master-list", component: <JobList /> },
  { path: "/job/manage/:key?", component: <ManageJob /> },
  { path: "/job/view/:key", component: <ViewJob /> },

  /* Job Suggestions */
  { path: "/job/suggestions", component: <JobSuggestions /> },
  { path: "/job/manage-suggestion/:key?", component: <ManageSuggestion /> },

  /* Job Suggestions */
  { path: "/job/category", component: <JobCategoryList /> },
  { path: "/job/manage-category/:key?", component: <ManageJobCategory /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  //Careers
  { path: "/career/master-list", component: <CareerList /> },
  { path: "/career/manage/:key?", component: <ManageCareer /> },

  //Starter Jobs
  { path: "/starter-jobs", component: <StarterJobList /> },
  { path: "/starter-jobs/manage/:key?", component: <ManageStarterJob /> },

  //Employers Assessments
  { path: "/employers-assessments", component: <EmployersAassessmentsList /> },
  {
    path: "/employers-assessments/manage/:key?",
    component: <ManageEmployersAassessments />,
  },

  //Employees Assessments
  { path: "/employees-assessments", component: <EmployeesAassessmentsList /> },
  {
    path: "/employees-assessments/manage/:key?",
    component: <ManageEmployeesAassessments />,
  },

  //Personality Profile
  { path: "/personality-profile", component: <PersonalityProfileList /> },
  {
    path: "/personality-profile/manage/:key?",
    component: <ManagePersonalityProfile />,
  },

  //Resources
  { path: "/article-category/list", component: <ArticleCategory /> },
  {
    path: "/article-category/manage/:key?",
    component: <ManageArticleCategory />,
  },
  { path: "/articles/list", component: <ArticleList /> },
  { path: "/articles/manage/:key?", component: <ManageArticle /> },

  /** Product */
  { path: "/product/category/list", component: <ProductCategory /> },
  { path: "/product/category/manage/:key?", component: <ManageProductCategory /> },
  { path: "/product/list", component: <ProductList /> },
  { path: "/product/manage/:key?", component: <ManageProduct /> },
  { path: "/product/txn", component: <ProductTxnList /> },

  //Packages
  { path: "/package/list", component: <PackageList /> },
  { path: "/package/manage/:key?", component: <ManagePackage /> },

  { path: "/plan/list/:key", component: <PlanList /> },
  { path: "/plan/manage/:key", component: <ManagePlan /> },

  //Txn
  { path: "/transaction/list", component: <TxnList /> },
  { path: "/module-txn/list", component: <ModuleTxnList /> },
  { path: "/job-txn/list", component: <JobTxnList /> },
  { path: "/plan-txn/list", component: <PlanTxnList /> },

  //LMS Skills
  { path: "/lms/skill/list", component: <SkillList /> },
  { path: "/lms/skill/manage/:key", component: <ManageLmsSkill /> },

  //LMS Learning Path
  { path: "/lms/learning-path/list", component: <LearningPathList /> },
  { path: "/lms/learning-path/manage/:key", component: <ManageLearningPath /> },

  //LMS Learning Materials
  { path: "/lms/learning-material/list", component: <LearningMaterialList /> },
  {
    path: "/lms/learning-material/manage/:key?",
    component: <ManageLearningMaterial />,
  },

  // LMS Skill Assessments
  { path: "/lms/skill-assessment/list", component: <SkillAssessmentList /> },
  {
    path: "/lms/skill-assessment/manage/:key?",
    component: <ManageSkillAssessment />,
  },

  { path: "/lms/review/list", component: <LmsReviewList /> },


  // Ranks
  { path: "/rank/list", component: <RankList /> },
  { path: "/rank/manage/:key?", component: <ManageRank /> },

  // Level List
  { path: "/level/list", component: <LevelList /> },
  { path: "/level/manage/:key?", component: <ManageLevel /> },

  //MESSAGE template
  { path: "/messages/list", component: <MessagesList /> },
  { path: "/messages/manage/:key?", component: <Template /> },


  //Message badge
  { path: "/messages/badge/list", component: <BadgesList /> },
  { path: "/messages/badge/manage/:key?", component: <ManageBadge /> },



  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },

  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/reset-password/:id", component: <PasswordReset /> },
];

export { authProtectedRoutes, publicRoutes };
