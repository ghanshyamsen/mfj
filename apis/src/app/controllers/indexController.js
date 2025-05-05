const User = require("../../models/user");
const AcademicModel = require("../../models/academic");
const ActivitieModel = require("../../models/activities");
const CourseworkModel = require("../../models/coursework");
const FaqModel = require("../../models/faq");
const fCatModel = require("../../models/faqcategory");
const HobbiesModel = require("../../models/hobbies");
const objective = require("../../models/objective");
const SchoolModel = require("../../models/schools");
const SkillModel = require("../../models/skills");
const skillsAssessment = require("../../models/skillsAssessment");
const TutorialModel = require("../../models/tutorial");
const tCatModel = require("../../models/tutorialcategory");
const VolunteerSkillModel = require("../../models/volunteerskills");
const hCatModel = require("../../models/hobbiescategory");
const aCatModel = require("../../models/activitiecategory");
const JobModel = require("../../models/jobs");
const JobSuggestionModel = require("../../models/jobsuggestions");
const CareerModel = require("../../models/careers");
const StarterJob = require("../../models/starterjobs");
const PersonalityProfileModel = require("../../models/personalityprofile");
const EmployeesAassessmentsModel = require("../../models/employeesaassessments");
const EmployersAassessmentsModel = require("../../models/employersaassessments");
const ArticleCategoryModel = require("../../models/articlecategory");
const ArticleModel = require("../../models/articles");

class Index  {

  async dashboard(req, res) {

    try{

      const WidgetsList = [
        {
            'key':"faqcat",
            'label':"Faq Categories",
            'color':"success",
            'icon':"ri-question-line",
            'counter': await fCatModel.countDocuments({}),
            'link':"Go to faq category",
            'url':"/faq-category/master-list",
            'bgcolor':"success"
        },
        {
            'key':"faqs",
            'label':"Faq's",
            'color':"success",
            'icon':"ri-question-line",
            'counter':await FaqModel.countDocuments({}),
            'link':"Go to faq's",
            'url':"/faq/master-list",
            'bgcolor':"success"
        },
        {
            'key':"tutorialcat",
            'label':"Tutorial Categories",
            'color':"warning",
            'icon':"las la-chalkboard-teacher",
            'counter':await tCatModel.countDocuments({}),
            'link':"Go to tutorial categories",
            'url':"/tutorial-category/master-list",
            'bgcolor':"warning"
        },
        {
            'key':"tutorials",
            'label':"Tutorials",
            'color':"warning",
            'icon':"las la-chalkboard-teacher",
            'counter':await TutorialModel.countDocuments({}),
            'link':"Go to tutorial",
            'url':"/tutorial/master-list",
            'bgcolor':"warning"
        },
        {
            'key':"teenager",
            'label':"Students",
            'color':"info",
            'icon':"bx bx-user-circle",
            'counter':await User.countDocuments({user_type: "teenager", user_deleted:false}),
            'link':"Go to students",
            'url':"/users/teenager",
            'bgcolor':"info"
        },
        {
            'key':"manager",
            'label':"Employers",
            'color':"info",
            'icon':"ri-user-2-fill",
            'counter':await User.countDocuments({user_type: "manager", user_deleted:false}),
            'link':"Go to employers",
            'url':"/users/manager",
            'bgcolor':"info"
        },
        {
            'key':"parents",
            'label':"Parents",
            'color':"info",
            'icon':"ri-parent-line",
            'counter':await User.countDocuments({user_type: "parents", user_deleted:false}),
            'link':"Go to parents",
            'url':"/users/parents",
            'bgcolor':"info"
        },
        {
            'key':"objective",
            'label':"Objective & Summary",
            'color':"primary",
            'icon':"ri-questionnaire-line",
            'counter':await objective.countDocuments({}),
            'link':"Go to objective questions",
            'url':"/objective-questions",
            'bgcolor':"primary"
        },
        {
            'key':"skills",
            'label':"Skills",
            'color':"secondary",
            'icon':"las la-tools",
            'counter':await SkillModel.countDocuments({}),
            'link':"Go to skills",
            'url':"/skills/master-list",
            'bgcolor':"secondary"
        },
        {
            'key':"skillassestment",
            'label':"Skills Assessment",
            'color':"secondary",
            'icon':"ri-task-line",
            'counter':await skillsAssessment.countDocuments({}),
            'link':"Go to skills assessment",
            'url':"/skills/assessment-list",
            'bgcolor':"secondary"
        },
        {
            'key':"volunteerskill",
            'label':"Volunteer Skills",
            'color':"secondary",
            'icon':"ri-todo-line",
            'counter':await VolunteerSkillModel.countDocuments({}),
            'link':"Go to volunteer skills",
            'url':"/skills/volunteer-list",
            'bgcolor':"secondary"
        },
        {
            'key':"school",
            'label':"School List",
            'color':"danger",
            'icon':"bx bxs-school",
            'counter':await SchoolModel.countDocuments({}),
            'link':"Go to school list",
            'url':"/education/school-list",
            'bgcolor':"danger"
        },
        {
            'key':"academic",
            'label':"Academic List",
            'color':"danger",
            'icon':"las la-certificate",
            'counter':await AcademicModel.countDocuments({}),
            'link':"Go to academic list",
            'url':"/education/academic-list",
            'bgcolor':"danger"
        },
        {
            'key':"coursework",
            'label':"Coursework List",
            'color':"danger",
            'icon':"las la-graduation-cap",
            'counter':await CourseworkModel.countDocuments({}),
            'link':"Go to coursework list",
            'url':"/education/coursework-list",
            'bgcolor':"danger"
        },
        {
            'key':"extraactivitiescategory",
            'label':"Extracurricular Activities Category",
            'color':"body-secondary",
            'icon':"bx bx-run",
            'counter':await aCatModel.countDocuments({}),
            'link':"Go to extracurricular activities categories",
            'url':"/activitie-category/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"extraactivities",
            'label':"Extracurricular Activities",
            'color':"body-secondary",
            'icon':"bx bx-run",
            'counter':await ActivitieModel.countDocuments({}),
            'link':"Go to extracurricular activities",
            'url':"/activitie/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"hobbiescategories",
            'label':"Hobbies & Interest Categories",
            'color':"body-secondary",
            'icon':"las la-chess",
            'counter':await hCatModel.countDocuments({}),
            'link':"Go to hobbies categories",
            'url':"/hobbies-category/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"hobbies",
            'label':"Hobbies & Interest",
            'color':"body-secondary",
            'icon':"las la-chess",
            'counter':await HobbiesModel.countDocuments({}),
            'link':"Go to hobbies",
            'url':"/hobbies/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"jobs",
            'label':"Jobs",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':await JobModel.countDocuments({}),
            'link':"Go to jobs",
            'url':"/job/master-list",
            'bgcolor':"success"
        },
        {
            'key':"jobsuggestions",
            'label':"Job Suggestions",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':await JobSuggestionModel.countDocuments({}),
            'link':"Go to job suggestions",
            'url':"/job/suggestions",
            'bgcolor':"success"
        },
        {
            'key':"careerlist",
            'label':"Career List",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':await CareerModel.countDocuments({}),
            'link':"Go to career list",
            'url':"/career/master-list",
            'bgcolor':"success"
        },
        {
            'key':"starterjobs",
            'label':"Starter Jobs",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':await StarterJob.countDocuments({}),
            'link':"Go to starter jobs",
            'url':"/starter-jobs",
            'bgcolor':"success"
        },
        {
            'key':"personalityprofile",
            'label':"Personality Profile",
            'color':"success",
            'icon':"ri-file-list-3-line",
            'counter':await PersonalityProfileModel.countDocuments({}),
            'link':"Go to personality profile",
            'url':"/personality-profile",
            'bgcolor':"success"
        },
        {
            'key':"employersassessments",
            'label':"Employers Assessments",
            'color':"success",
            'icon':"ri-file-list-3-line",
            'counter':await EmployersAassessmentsModel.countDocuments({}),
            'link':"Go to employers assessments",
            'url':"/employers-assessments",
            'bgcolor':"success"
        },
        {
            'key':"employeesassessments",
            'label':"Employees Assessments",
            'color':"success",
            'icon':"ri-file-list-3-line",
            'counter':await EmployeesAassessmentsModel.countDocuments({}),
            'link':"Go to employees assessments",
            'url':"/employees-assessments",
            'bgcolor':"success"
        },
        {
            'key':"categorylist",
            'label':"Article Categories",
            'color':"success",
            'icon':"ri-picture-in-picture-exit-line",
            'counter':await ArticleCategoryModel.countDocuments({}),
            'link':"Go to article category",
            'url':"/article-category/list",
            'bgcolor':"success"
        },
        {
            'key':"articleslist",
            'label':"Articles",
            'color':"success",
            'icon':"ri-picture-in-picture-exit-line",
            'counter':await ArticleModel.countDocuments({}),
            'link':"Go to article",
            'url':"/articles/list",
            'bgcolor':"success"
        }
      ];


      return res.status(200).json({ status: true, data: WidgetsList });

    }catch(err){
      return res.status(500).json({ message:err.message });
    }

  }

}

module.exports = Index;
