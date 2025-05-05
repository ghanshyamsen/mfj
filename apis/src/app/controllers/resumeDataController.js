const SkillModel = require("../../models/skills");
const skillsAssessment = require("../../models/skillsAssessment");
const SchoolModel = require("../../models/schools");
const AcademicModel = require("../../models/academic");
const CourseworkModel = require("../../models/coursework");
const ActivitieModel = require("../../models/activities");
const VolunteerSkillModel = require("../../models/volunteerskills");
const HobbiesModel = require("../../models/hobbies");
const hCatModel = require("../../models/hobbiescategory");
const aCatModel = require("../../models/activitiecategory");

class ResumeData {

  async getskills(req, res) {

    try{

      const getSkills = await SkillModel.find({}, 'title image updatedAt').then(function(skills){

        const defaultValues = [];

        let idx = 1;
        skills.forEach((skill) => {
          defaultValues.push({
            s_no: idx,
            id: skill._id,
            title: skill.title,
            image: (skill.image)?process.env.MEDIA_URL+'skills/'+skill.image:"",
            updated: new Date(skill.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          })
          idx++;
        });

        return defaultValues;
      });

      if(getSkills){
        return res.status(200).json({status:"S", data:getSkills});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async getvolunteerskills(req, res) {

    try{

      const getSkills = await VolunteerSkillModel.find({}, 'title image updatedAt').then(function(skills){
        const defaultValues = [];
        let idx = 1;
        skills.forEach((skill) => {
          defaultValues.push({
            s_no: idx,
            id: skill._id,
            title: skill.title,
            image: (skill.image)?process.env.MEDIA_URL+'skills/'+skill.image:"",
            updated: new Date(skill.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          })
          idx++;
        });

        return defaultValues;
      });

      if(getSkills){
        return res.status(200).json({status:"S", data:getSkills});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async getskillsassessment(req, res) {

    try{

      const getSkills = await SkillModel.find({}, 'title');

      const skillMap = await getSkills.reduce((acc, skill) => {
        acc[skill._id.toString()] = skill; // Ensure _id is converted to a string
        return acc;
      }, {});

      const getAssessment = await skillsAssessment.find({}).then(function(assessment){

        const defaultValues = [];

        let idx = 1;
        assessment.forEach((obj) => {

          const options = [
            {
              option:obj.option_a,
              point:obj.points_a,
              option_value:"a",
              skills: obj.skill_a.map(id => skillMap[id]),
            },
            {
              option:obj.option_b,
              point:obj.points_b,
              option_value:"b",
              skills: obj.skill_b.map(id => skillMap[id])
            },
            {
              option:obj.option_c,
              point:obj.points_c,
              option_value:"c",
              skills: obj.skill_c.map(id => skillMap[id])
            },
            {
              option:obj.option_d,
              point:obj.points_d,
              option_value:"d",
              skills: obj.skill_d.map(id => skillMap[id])
            }
          ];

          defaultValues.push({
            s_no: idx,
            id: obj._id,
            question: obj.question,
            options:options
          })
          idx++;

        });

        return defaultValues;

      });

      if(getAssessment){
        return res.status(200).json({status:"S", data:getAssessment});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async getschools(req, res) {

    try{

      const searchTerm = (req.query.keyword)? { title: { $regex: new RegExp(req.query.keyword, 'i') } }:{};

      const getSchools = await SchoolModel.find(searchTerm, 'title updatedAt').then(function(schools){

        const defaultValues = [];

        let idx = 1;
        schools.forEach((school) => {
          defaultValues.push({
            s_no: idx,
            id: school._id,
            title: school.title,
            updated: new Date(school.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          })
          idx++;
        });

        return defaultValues;
      });

      if(getSchools){
        return res.status(200).json({status:"S", data:getSchools});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async getacademic(req, res) {

    try{

      const getAcademic = await AcademicModel.find({}, 'title updatedAt').then(function(academics){

        const defaultValues = [];

        let idx = 1;
        academics.forEach((academic) => {
          defaultValues.push({
            s_no: idx,
            id: academic._id,
            title: academic.title,
            updated: new Date(academic.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          })
          idx++;
        });

        return defaultValues;
      });

      if(getAcademic){
        return res.status(200).json({status:"S", data:getAcademic});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async getcoursework(req, res) {

    try{

      const getCoursework = await CourseworkModel.find({}, 'title updatedAt').then(function(courseworks){

        const defaultValues = [];

        let idx = 1;
        courseworks.forEach((coursework) => {
          defaultValues.push({
            s_no: idx,
            id: coursework._id,
            title: coursework.title,
            updated: new Date(coursework.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          })
          idx++;
        });

        return defaultValues;
      });

      if(getCoursework){
        return res.status(200).json({status:"S", data:getCoursework});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async getactivities(req, res) {

    try{


      const aCat = await aCatModel.find({}, 'title');

      const allActivities = [];

      for (let cat of aCat) {

        try {
          const activities = await ActivitieModel.find({category:cat._id}, 'title image updatedAt');

          const defaultValues = [];

          let idx = 1;
          activities.forEach((activitie) => {
            defaultValues.push({
              s_no: idx,
              id: activitie._id,
              title: activitie.title,
              image: activitie.image ? `${process.env.MEDIA_URL}activitie/${activitie.image}` : "",
              updated: new Date(activitie.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          allActivities.push({
            title: cat.title,
            activities: defaultValues
          });

        } catch (error) {
          console.error(`Error fetching hobbies for category ${cat._id}: `, error);
          return res.status(500).json({ status: "F", message: "Error fetching hobbies." });
        }

      }

      if(allActivities.length > 0){
        return res.status(200).json({status:"S", data:allActivities});
      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }

    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

  async gethobbies(req, res) {
    try {
      const hCat = await hCatModel.find({}, 'title');

      const allHobbies = [];

      for (let cat of hCat) {
        try {
          const hobbies = await HobbiesModel.find({ category: cat._id }, 'title image updatedAt');
          const defaultValues = [];

          hobbies.forEach((hobbie, idx) => {
            defaultValues.push({
              s_no: idx + 1,
              id: hobbie._id,
              title: hobbie.title,
              image: hobbie.image ? `${process.env.MEDIA_URL}hobbies/${hobbie.image}` : "",
              updated: new Date(hobbie.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            });
          });

          allHobbies.push({
            title: cat.title,
            hobbies: defaultValues
          });

        } catch (error) {
          console.error(`Error fetching hobbies for category ${cat._id}: `, error);
          return res.status(500).json({ status: "F", message: "Error fetching hobbies." });
        }
      }

      if (allHobbies.length > 0) {
        return res.status(200).json({ status: "S", data: allHobbies });
      } else {
        return res.status(200).json({ status: "F", message: "No Record Exist." });
      }

    } catch (err) {
      return res.status(500).json({ status: "F", message: err.message });
    }

  }
}


module.exports = ResumeData;
