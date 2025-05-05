const User = require("../../models/user");
const JobModel = require("../../models/jobs");
const ResumeModel = require("../../models/resume");
const SCandidents = require("../../models/savedcandidents");
const haversineDistance = require('haversine-distance');

class Company {

  async getcandidates(req, res){

    try{

      const candidates = await User.find({visibility:'public',user_deleted:false,user_type:'teenager'}, ' profile_image first_name last_name ');

      const records = candidates.map(record => {
        record.profile_image = `${process.env.MEDIA_URL}avtar/${record.profile_image ? record.profile_image : 'default-user.png'}`;
        return record;
      });

      return res.status(200).json({status:true, data:records});

    }catch(error){
      return res.status(200).json({status:false, message:error.message});
    }

  }

  async getsavedcandident(req, res){

    try {

      const  { uid, cid } = req.params;

      const candidates = await SCandidents.findOne({user_id:uid,candidate_id:cid});

      return res.status(200).json({status:true, data:candidates});

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }

  }

  async getsavedcandidents(req, res){

    try {

      const  { key } = req.params;

      const getCandidates = async () => {

        const candidates = await SCandidents.find({user_id:key});

        const defaultValues = [];

        for (const candidate of candidates) {

          const user = await User.findOne({_id:candidate.candidate_id},'profile_image first_name last_name ');

          defaultValues.push({
            bid: candidate._id,
            id: user._id,
            name: (user.first_name+' '+user.last_name),
            image: `${process.env.MEDIA_URL}avtar/${user.profile_image ? user.profile_image : 'default-user.png'}`
          });
        }

        return defaultValues;
      };

      getCandidates().then(defaultValues => {
        // You can use defaultValues here if needed
        return res.status(200).json({status: true, data: defaultValues });
      });

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }

  }

  async savedcandidents(req, res){

    try {

      const PostData = req.body;

      const candidates = await SCandidents.create(PostData);

      return res.status(200).json({status:true, data:candidates});

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }

  }

  async deletecandidents(req, res){
    try {

      const  { key } = req.params;

      await SCandidents.findOneAndDelete({_id:key});

      return res.status(200).json({status:true, message:"Remove successfully."});

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }
  }

  async getmatchedcandidates(req, res){

    try {

      const { key } = req.params;

      const job = await JobModel.findOne({_id:key},' job_position location latitude longitude');

      if(job){

        const position = job.job_position;
        const location = job.location;
        const latitude = job.latitude;
        const longitude = job.longitude;

        // Convert distance from miles to meters
        const maxDistance = 10 * 1609.34; // 10 miles in meters

        // Fetch users with their resumes and filter by user_type and location proximity
        const users = await User.aggregate([
          {
            $match: {
              user_type: 'teenager' // Filter users by user_type
            }
          },
          {
            $lookup: {
              from: 'resumes',
              localField: '_id',
              foreignField: 'user_id',
              as: 'resumes'
            }
          },
          { $unwind: "$resumes" }, // Deconstruct resumes array to filter individual resumes
          {
            $project: {
              first_name: 1,
              last_name: 1,
              profile_image: 1,
              resumes: 1
            }
          }
        ]);

        const matchedUsers = users.filter(user => {
          const resume = user.resumes;

          const jobPreferences = resume?.job_prefernces || {};

          // Check if job title matches
          const titleMatch = jobPreferences.job_titles?.includes(job.job_position) || false;

          // Check if job location is within 10 miles
          const locationMatch = jobPreferences.job_locations?.some(location => {
            const jobLocation = {
              latitude: job.latitude,
              longitude: job.longitude
            };

            const resumeLocation = {
              latitude: location.latitude,
              longitude: location.longitude
            };

            // Calculate distance in miles
            const distance = haversineDistance(jobLocation, resumeLocation) / 1609.34; // Convert meters to miles

            return distance <= 10;
          }) || false;

          // Return true if either titleMatch or locationMatch is true
          return titleMatch || locationMatch;
        });

        if(matchedUsers.length > 0){

          const filtered = matchedUsers.map(user => ({
            id: user._id,
            name: (user.first_name+' '+user.last_name),
            first_name:user.first_name,
            last_name:user.last_name,
            profile_image: `${process.env.MEDIA_URL}avtar/${user.profile_image ? user.profile_image : 'default-user.png'}`
          }));

          return res.status(200).json({status:true, data:filtered});

        }else{
          return res.status(200).json({status:false, message:"No matching candidates found."});
        }

      }else{
        return res.status(200).json({status:false, message:"Invalid job request."});
      }


    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }
  }


}


module.exports = Company;
