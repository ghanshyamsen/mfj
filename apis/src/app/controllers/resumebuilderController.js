const ResumeModel = require("../../models/resume");
const User = require("../../models/user");
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
const StarterJob = require("../../models/starterjobs");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class ResumeBuilder {

  constructor() {
    this.get = this.get.bind(this);
    this.getsortskills = this.getsortskills.bind(this);
    this.getSkills = this.getSkills.bind(this);
    this.gethobbies = this.gethobbies.bind(this);
    this.getVolunteerExperience = this.getVolunteerExperience.bind(this);
    this.getExtracurricularActivities = this.getExtracurricularActivities.bind(this);
    this.getStarterJobs = this.getStarterJobs.bind(this);
  }

  async get(req, res, next, extra=false) {

    try{

      const { key } = req.params;

      const userId = (key?key:req.user.userId);

      let resumes = await ResumeModel.findOne({
        user_id: userId,
      });

      if(resumes){



        const is_user = await User.findOne({_id:userId, user_deleted:false});

        if(!is_user){
          return res.status(200).json({status:false, message:"This applicant is no longer available."});
        }

        const sortted = await this.getsortskills(resumes.skills_assessment);

        const resumeData = {
          user_info:{
            name: `${resumes.first_name} ${resumes.last_name}`,
            phone_number:resumes.phone_number,
            email:resumes.email,
            location:resumes.location,
            pronouns:resumes.pronouns,
            image:process.env.MEDIA_URL+(resumes.image?`resume/${resumes.image}`:'avtar/default-user.png')
          },
          objective_summary:resumes.objective_summary,
          references:resumes.references,
          skills: await this.getSkills(sortted),
          education: await this.getsortlist(resumes.education),
          hobbies: await this.gethobbies(resumes.hobbies),
          certification: await this.getsortlist(resumes.certification),
          awards_achievments: await this.getsortlist(resumes.awards_achievments),
          volunteer_experience: await this.getVolunteerExperience(resumes.volunteer_experience),
          extracurricular_activities: await this.getExtracurricularActivities(resumes.extracurricular_activities),
          work_experience: resumes.work_experience,
          skills_complete_status: resumes.skills_complete_status,
          education_complete_status: resumes.education_complete_status,
          activitie_complete_status: resumes.activitie_complete_status,
          volunteer_complete_status: resumes.volunteer_complete_status,
          awards_achievments_status: resumes.awards_achievments_status,
          work_experience_status: resumes.work_experience_status,
          certification_status: resumes.certification_status,
          hobbies_status: resumes.hobbies_status,
          references_status: resumes.references_status,
          personal_detail_complete_status: resumes.personal_detail_complete_status,
          job_prefernces_complete_status: resumes.job_prefernces_complete_status,
          job_prefernces: resumes.job_prefernces,
          objective_complete_status: resumes.objective_complete_status,
          personality_profile: resumes.personality_profile,
          personality_profile_complete_status: resumes.personality_profile_complete_status,
          personality_assessment: resumes.personality_assessment,
          personality_assessment_complete_status: resumes.personality_assessment_complete_status,
          resume_theame: resumes?.resume_theame,
          starter_jobs: await this.getStarterJobs(resumes.personality_profile)
        }

        if(extra){
          return resumeData;
        }

        return res.status(200).json({status:true, data:resumeData});

      }else{
        return res.status(200).json({status:false, message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:true, message:err.message });
    }
  }

  async getsortskills(list){

    // Step 1: Aggregate points and collect IDs for each skill
    const skillData = {};

    // Function to update skill data
    const updateSkillData = (skill) => {
        if (!skillData[skill.title]) {
            skillData[skill.title] = { points: 0, id: skill._id };
        }
        skillData[skill.title].points += skill.point;
    };

    // Iterate over skills_assessment
    list.forEach(item => {
        if (item.skills) {
            item.skills.forEach(skill => {
                updateSkillData(skill);
            });
        } else {
            // Handle cases where skills might not be present
        }
    });

    // Step 2: Convert the aggregated data into an array and sort
    const sortedSkills = Object.entries(skillData)
        .map(([title, { points, id }]) => ({ title, points, id }))
        .sort((a, b) => b.points - a.points);

    // Step 3: Output the sorted skills
    const sortted = sortedSkills.slice(0, 5);

    return sortted;
  }

  async getsortlist(list){
    return list.map(group =>
      group.reduce((acc, { question_tag, answer }) => {
        acc[question_tag] = answer;
        return acc;
      }, {})
    );
  }

  async getSkills(list) {
    const defaultValues = [];

    for (let item of list) {
      const skill = await SkillModel.findOne({ _id: item.id }, 'title image');

      defaultValues.push({
        name: item.title,
        image: skill && skill.image ? `${process.env.MEDIA_URL}skills/${skill.image}` : "",
      });
    }

    return defaultValues;
  }

  async getExtracurricularActivities(list) {
    const defaultValues = [];

    for (let item of list) {
      for (let answer of item.answer) {
        for (let activitie of answer.activities) {
          if(activitie.id){
            try {
              const getActivitie = await ActivitieModel.findOne({ _id: activitie.id }, 'image');

              defaultValues.push({
                name: activitie.title,
                image: getActivitie && getActivitie.image ? `${process.env.MEDIA_URL}activitie/${getActivitie.image}` : "",
              });
            } catch (error) {

            }
          }

        }
      }
    }

    return defaultValues;
  }

  async gethobbies(list) {
    const defaultValues = [];

    for (let item of list) {
      for (let answer of item.answer) {
        for (let hobbie of answer.hobbies) {
          if(hobbie.id){
            try {

              const getHobby = await HobbiesModel.findOne({ _id: hobbie.id }, 'image');

              defaultValues.push({
                name: hobbie.title,
                image: getHobby && getHobby.image ? `${process.env.MEDIA_URL}hobbies/${getHobby.image}` : ""
              });

            }catch(error){

            }
          }
        }
      }
    }

    return defaultValues;
  }

  async getVolunteerExperience(data){
    return extractInfoByQuestionTag(data).map(group => {
      return group.reduce((acc, obj) => {
        return { ...acc, ...obj };
      }, {});
    });
  };

  async getStarterJobs(data) {

    // Step 1: Count occurrences of each type
    const typeCounts = data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Filter types that have multiple occurrences and sort by descending count
    const typesWithMultipleOccurrences = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .map(([type]) => type); // Extract the type

    // Step 3: Convert string types to ObjectId
    const objectIdTypes = typesWithMultipleOccurrences.map(type => new ObjectId(type));

    if (typesWithMultipleOccurrences.length > 0) {
      // Total number of records to return
      const totalLimit = 20;


      // Calculate how many jobs to fetch per personality_type
      const totalOccurrences = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);

      const limitPerType = objectIdTypes.map(type => {
        const typeCount = typeCounts[type.toString()] || 0;
        // Calculate how many records to return based on the ratio
        return Math.ceil((typeCount / totalOccurrences) * totalLimit);
      });

      // Aggregation pipeline
      const Jobs = await StarterJob.aggregate([
        // Step 1: Match the personality_type
        {
          $match: {
            personality_type: { $in: objectIdTypes }
          }
        },
        // Step 2: Add sortOrder based on personality_type array
        {
          $addFields: {
            sortOrder: {
              $indexOfArray: [objectIdTypes, "$personality_type"]
            }
          }
        },
        // Step 3: Group by personality_type and count the occurrences
        {
          $group: {
            _id: "$personality_type",
            jobs: { $push: "$$ROOT" },
            count: { $sum: 1 } // Count how many jobs per personality_type
          }
        },
        // Step 4: Sort groups by count to prioritize types with higher ratio
        {
          $sort: { count: -1 } // Sort descending by the count of jobs
        },
        // Step 5: Apply the ratio-based limit per group
        {
          $project: {
            jobs: { $slice: ["$jobs", { $arrayElemAt: [limitPerType, { $indexOfArray: [objectIdTypes, "$_id"] }] }] }
          }
        },
        // Step 6: Unwind jobs back into individual records
        {
          $unwind: "$jobs"
        },
        // Step 7: Replace the root to get back to job-level documents
        {
          $replaceRoot: { newRoot: "$jobs" }
        },
        // Step 8: Sort by the original personality type order or any other field if needed
        {
          $sort: { sortOrder: 1 } // Sort by original personality_type order
        },
        // Step 9: Lookup (populate) the personality_type collection to get the title
        {
          $lookup: {
            from: 'personalitytypes', // Collection name for personality types
            localField: 'personality_type',
            foreignField: '_id',
            as: 'personalityTypeInfo'
          }
        },
        // Step 10: Unwind personalityTypeInfo since it's an array
        {
          $unwind: {
            path: "$personalityTypeInfo",
            preserveNullAndEmptyArrays: true // In case there's no match
          }
        },
        // Step 11: Lookup (populate) the career collection to get the career title
        {
          $lookup: {
            from: 'careers', // Collection name for careers
            localField: 'career_id',
            foreignField: '_id',
            as: 'careerInfo'
          }
        },
        // Step 12: Unwind careerInfo since it's an array
        {
          $unwind: {
            path: "$careerInfo",
            preserveNullAndEmptyArrays: true // In case there's no match
          }
        },
        // Step 13: Limit the total number of results to 10
        {
          $limit: totalLimit // Set the final limit to 10
        },
        // Step 14: Project to include only the necessary fields
        {
          $project: {
            job_title: 1,
            personality_traits: 1,
            soft_skills: 1,
            required_skills: 1,
            typical_career_path: 1,
            personality_type: "$personalityTypeInfo.title", // Include the personality type title
            career_title: "$careerInfo.title", // Include the career title
            other_fields_you_need: 1 // Add any other fields you need
          }
        }
      ]);







      return Jobs;
    }

    return [];
  }


}

const extractInfoByQuestionTag = (data) => {
  return data.map(section => {
    return section.map(item => {
        const infoObject = {};
        item.info.forEach(infoItem => {
            infoObject[infoItem.question_tag] = infoItem.answer;
        });
        return infoObject;
    });
  });
}





module.exports = ResumeBuilder;
