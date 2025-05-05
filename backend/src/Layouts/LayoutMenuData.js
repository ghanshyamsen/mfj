import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isObjective, setIsObjective] = useState(false);
  const [isSkills, setIsSkills] = useState(false);
  const [isEducation, setIsEducation] = useState(false);
  const [isActivitie, setIsActivitie] = useState(false);
  const [isHobbies, setIsHobbies] = useState(false);
  const [isFaqs, setIsFaqs] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isJobs, setIsJobs] = useState(false);
  const [isMessageTemplate, setIsMessageTemplate] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const [isCareer, setIsCareer] = useState(false);
  const [isPersonalityAassessments, setIsPersonalityAassessments] = useState(false);
  const [isResources, setIsResources] = useState(false);
  const [isWallets, setIsWallets] = useState(false);
  const [isLms, setIsLms] = useState(false);
  const [isPorduct, setIsProduct] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Objective") {
      setIsObjective(false);
    }
    if (iscurrentState !== "Skills") {
      setIsSkills(false);
    }
    if (iscurrentState !== "Education") {
      setIsEducation(false);
    }
    if (iscurrentState !== "Activitie") {
      setIsActivitie(false);
    }
    if (iscurrentState !== "Hobbies") {
      setIsHobbies(false);
    }
    if (iscurrentState !== "Faqs") {
      setIsFaqs(false);
    }
    if (iscurrentState !== "Tutorial") {
      setIsTutorial(false);
    }
    if (iscurrentState !== "User") {
      setIsUser(false);
    }
    if (iscurrentState !== "Jobs") {
      setIsJobs(false);
    }
    if (iscurrentState !== "MessageTemplate") {
      setIsMessageTemplate(false);
    }
    if (iscurrentState !== "Static") {
      setIsStatic(false);
    }
    if (iscurrentState !== "Careers") {
      setIsCareer(false);
    }
    if (iscurrentState !== "Personality Assessments") {
      setIsPersonalityAassessments(false);
    }
    if (iscurrentState !== "Resources") {
      setIsResources(false);
    }
    if (iscurrentState !== "Wallets") {
      setIsWallets(false);
    }
    if (iscurrentState !== "LMS") {
      setIsLms(false);
    }
    if (iscurrentState !== "Product") {
      setIsProduct(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isObjective,
    isSkills,
    isEducation,
    isActivitie,
    isHobbies,
    isFaqs,
    isTutorial,
    isUser,
    isJobs,
    isStatic,
    isCareer,
    isPersonalityAassessments,
    isResources,
    isWallets,
    isLms,
    isMessageTemplate,
    isPorduct
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "siteconfig",
      label: "Site Config",
      icon: "ri-tools-line",
      link: "/site-configuration",
    },
    /* {
            id: "statics",
            label: "Static",
            icon: "ri-pages-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsStatic(!isStatic);
                setIscurrentState('Static');
                updateIconSidebar(e);
            },
            stateVariables: isStatic,
            subItems: [
                {
                    id: "emails",
                    label: "Email templates",
                    link: "/email-list",
                    parentId: "statics",
                }
            ]
        }, */
    {
      id: "faqs",
      label: "Faq's",
      icon: "ri-question-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsFaqs(!isFaqs);
        setIscurrentState("Faqs");
        updateIconSidebar(e);
      },
      stateVariables: isFaqs,
      subItems: [
        {
          id: "faqcatlist",
          label: "Faq Category",
          link: "/faq-category/master-list",
          parentId: "faqs",
        },
        {
          id: "faqlist",
          label: "Faq's",
          link: "/faq/master-list",
          parentId: "faqs",
        },
      ],
    },
    {
      id: "tutorials",
      label: "Tutorials",
      icon: "las la-chalkboard-teacher",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsTutorial(!isTutorial);
        setIscurrentState("Tutorial");
        updateIconSidebar(e);
      },
      stateVariables: isTutorial,
      subItems: [
        {
          id: "tutorialcatlist",
          label: "Tutorial Category",
          link: "/tutorial-category/master-list",
          parentId: "tutorials",
        },
        {
          id: "tutoriallist",
          label: "Tutorial List",
          link: "/tutorial/master-list",
          parentId: "tutorials",
        },
      ],
    },
    {
      id: "users",
      label: "Users",
      icon: "las la-users",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsUser(!isUser);
        setIscurrentState("User");
        updateIconSidebar(e);
      },
      stateVariables: isUser,
      subItems: [
        {
          id: "teenager",
          label: "Students",
          link: "/users/teenager",
          parentId: "users",
        },
        {
          id: "manager",
          label: "Employers",
          link: "/users/manager",
          parentId: "users",
        },
        {
          id: "parents",
          label: "Parents",
          link: "/users/parents",
          parentId: "users",
        },
      ],
    },
    {
      id: "objective",
      label: "Objective & Summary",
      icon: "ri-questionnaire-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsObjective(!isObjective);
        setIscurrentState("Objective");
        updateIconSidebar(e);
      },
      stateVariables: isObjective,
      subItems: [
        {
          id: "question",
          label: "Questions",
          link: "/objective-questions",
          parentId: "objective",
        },
      ],
    },
    {
      id: "skills",
      label: "Manage Skills",
      icon: "las la-tools",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsSkills(!isSkills);
        setIscurrentState("Skills");
        updateIconSidebar(e);
      },
      stateVariables: isSkills,
      subItems: [
        {
          id: "masterlist",
          label: "Master List",
          link: "/skills/master-list",
          parentId: "skills",
        },
        {
          id: "skillsassessmentlist",
          label: "Skills Assessment",
          link: "/skills/assessment-list",
          parentId: "skills",
        },
        {
          id: "volunteerskill",
          label: "Volunteer Skills",
          link: "/skills/volunteer-list",
          parentId: "skills",
        },
      ],
    },
    /* {
            id: "education",
            label: "Manage Education Data",
            icon: "las la-graduation-cap",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsEducation(!isEducation);
                setIscurrentState('Education');
                updateIconSidebar(e);
            },
            stateVariables: isEducation,
            subItems: [
                {
                    id: "schoollist",
                    label: "School List",
                    link: "/education/school-list",
                    parentId: "education",
                },
                {
                    id: "academiclist",
                    label: "Academic List",
                    link: "/education/academic-list",
                    parentId: "education",
                },
                {
                    id: "courseworklist",
                    label: "Coursework List",
                    link: "/education/coursework-list",
                    parentId: "education",
                }
            ]
        }, */
    {
      id: "exactivities",
      label: "Extracurricular Activities",
      icon: "bx bx-run",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsActivitie(!isActivitie);
        setIscurrentState("Activitie");
        updateIconSidebar(e);
      },
      stateVariables: isActivitie,
      subItems: [
        {
          id: "activitiecategory",
          label: "Activity Category",
          link: "/activitie-category/master-list",
          parentId: "exactivities",
        },
        {
          id: "activitielist",
          label: "Activity List",
          link: "/activitie/master-list",
          parentId: "exactivities",
        },
      ],
    },
    {
      id: "hobbies",
      label: "Hobbies & Interest",
      icon: "las la-chess",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsHobbies(!isHobbies);
        setIscurrentState("Hobbies");
        updateIconSidebar(e);
      },
      stateVariables: isHobbies,
      subItems: [
        {
          id: "hobbiescategory",
          label: "Hobbies Category",
          link: "/hobbies-category/master-list",
          parentId: "hobbies",
        },
        {
          id: "hobbieslist",
          label: "Hobbies List",
          link: "/hobbies/master-list",
          parentId: "hobbies",
        },
      ],
    },
    {
      id: "jobs",
      label: "Jobs",
      icon: "ri-briefcase-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsJobs(!isJobs);
        setIscurrentState("Jobs");
        updateIconSidebar(e);
      },
      stateVariables: isJobs,
      subItems: [
        {
          id: "jobcategory",
          label: "Job Category",
          link: "/job/category",
          parentId: "jobs",
        },
        {
          id: "jobsuggestions",
          label: "Job Suggestions",
          link: "/job/suggestions",
          parentId: "jobs",
        },
        {
          id: "joblist",
          label: "Job List",
          link: "/job/master-list",
          parentId: "jobs",
        },
      ],
    },
    {
      id: "careers",
      label: "Careers & Starter Jobs",
      icon: "ri-briefcase-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsCareer(!isCareer);
        setIscurrentState("Careers");
        updateIconSidebar(e);
      },
      stateVariables: isCareer,
      subItems: [
        {
          id: "careerlist",
          label: "Career List",
          link: "/career/master-list",
          parentId: "careers",
        },
        {
          id: "stjoblist",
          label: "Starter Jobs",
          link: "/starter-jobs",
          parentId: "careers",
        },
      ],
    },
    {
      id: "personalityaassessments",
      label: "Assessments",
      icon: "ri-file-list-3-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsPersonalityAassessments(!isPersonalityAassessments);
        setIscurrentState("Personality Assessments");
        updateIconSidebar(e);
      },
      stateVariables: isPersonalityAassessments,
      subItems: [
        {
          id: "personalityprofile",
          label: "Personality Profile",
          link: "/personality-profile",
          parentId: "personalityaassessments",
        },
        {
          id: "employersaassessments",
          label: "Employers Assessments",
          link: "/employers-assessments",
          parentId: "personalityaassessments",
        },
        {
          id: "employeesaassessments",
          label: "Employees Assessments",
          link: "/employees-assessments",
          parentId: "personalityaassessments",
        },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      icon: "ri-picture-in-picture-exit-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsResources(!isResources);
        setIscurrentState("Resources");
        updateIconSidebar(e);
      },
      stateVariables: isResources,
      subItems: [
        {
          id: "resourcecontent",
          label: "Article Categories",
          link: "/article-category/list",
          parentId: "resources",
        },
        {
          id: "resourcecontent",
          label: "Articles",
          link: "/articles/list",
          parentId: "resources",
        },
      ],
    },
    {
      id: "wallets",
      label: "Wallets",
      icon: "ri-wallet-2-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsWallets(!isWallets);
        setIscurrentState("Wallets");
        updateIconSidebar(e);
      },
      stateVariables: isWallets,
      subItems: [
        {
          id: "stuplans",
          label: "Student Plans",
          link: "/plan/list/student",
          parentId: "wallets",
        },
        {
          id: "empplans",
          label: "Employer Plans",
          link: "/plan/list/employer",
          parentId: "wallets",
        },
        {
          id: "packages",
          label: "Packages",
          link: "/package/list",
          parentId: "wallets",
        },
        {
          id: "transaction",
          icon: "ri-exchange-dollar-line",
          label: "Transactions",
          link: "/transaction/list",
          parentId: "wallets",
        },
        {
          id: "moduletransaction",
          icon: "ri-exchange-dollar-line",
          label: "LMS Transactions",
          link: "/module-txn/list",
          parentId: "wallets",
        },
        {
          id: "plantransaction",
          icon: "ri-exchange-dollar-line",
          label: "Plan Transactions",
          link: "/plan-txn/list",
          parentId: "wallets",
        },
        {
          id: "jobtransaction",
          icon: "ri-exchange-dollar-line",
          label: "Job Transactions",
          link: "/job-txn/list",
          parentId: "wallets",
        },

      ],
    },
    {
      id: "lms",
      label: "LMS",
      icon: "bx bx-code-block",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsLms(!isLms);
        setIscurrentState("LMS");
        updateIconSidebar(e);
      },
      stateVariables: isLms,
      subItems: [
        {
          id: "levels",
          label: "Levels",
          link: "/level/list",
          parentId: "lms",
        },
        {
          id: "lmsskills",
          label: "Skills",
          link: "/lms/skill/list",
          parentId: "lms",
        },
        {
          id: "learningpath",
          label: "Learning Path",
          link: "/lms/learning-path/list",
          parentId: "lms",
        },
        {
          id: "skillmaterial",
          label: "Skills Materials",
          link: "/lms/learning-material/list",
          parentId: "lms",
        },
        {
          id: "skillassessments",
          label: "Skill Assessments",
          link: "/lms/skill-assessment/list",
          parentId: "lms",
        },
        {
          id: "ranks",
          label: "Ranks",
          link: "/rank/list",
          parentId: "lms",
        },
        {
          id: "reviews",
          label: "Reviews",
          link: "/lms/review/list",
          parentId: "lms",
        },
      ],
    },
    {
      id: "messagetemplete",
      label: "Messaging",
      icon: "ri-chat-1-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsMessageTemplate(!isMessageTemplate);
        setIscurrentState("MessageTemplate");
        updateIconSidebar(e);
      },
      stateVariables: isMessageTemplate,
      subItems: [
        {
          id: "template",
          label: "Template",
          link: "/messages/list",
          parentId: "messagetemplete",
        },
        {
          id: "badge",
          label: "Badge",
          link: "/messages/Badge/list",
          parentId: "messagetemplete",
        },
      ],
    },
    {
      id: "products",
      label: "Products",
      icon: "ri-product-hunt-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsProduct(!isPorduct);
        setIscurrentState("Product");
        updateIconSidebar(e);
      },
      stateVariables: isPorduct,
      subItems: [
        {
          id: "procategory",
          label: "Category",
          link: "/product/category/list",
          parentId: "products",
        },
        {
          id: "product",
          label: "List",
          link: "/product/list",
          parentId: "products",
        },
        {
          id: "protransaction",
          icon: "ri-exchange-dollar-line",
          label: "Transactions",
          link: "/product/txn",
          parentId: "products",
        },
      ],
    }

  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
