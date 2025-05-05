const User = require("../../models/user");
const Jobs = require("../../models/jobs");
const EmpReviewModel = require("../../models/employerreviews");
const Role = require("../../models/roles");
const AppliedJob = require("../../models/jobapplied");
const ChatRoomModel = require("../../models/chatroom");
const AssignBadgeModel = require("../../models/assignbadges");
const PurchaseModules = require("../../models/purchasemodules");
const GoalModel = require("../../models/goals");

const bcrypt = require("bcrypt");
const { unlink } = require('node:fs/promises');
const fs = require('fs');
const axios = require('axios');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


function isValidUrl(string) {
  try {
      new URL(string);
      return true;
  } catch (err) {
      return false;
  }
}

class Profile {

  async get(req, res) {

    try {

      const user = await User.findOne({_id: req.params.key, user_deleted:false}).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches plan_name').lean();


      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid request or your account was deleted." });
      }

      if(!user.status){
        return res.status(200).json({ status:"F", message: "Your account has been deactivated by an administrator. Please contact support for further assistance." });
      }

      const image_upload = (user.profile_image?true:false);
      const image_company_upload = (user.company_logo?true:false);

      user.profile_image =  process.env.MEDIA_URL+'avtar/'+(user.profile_image?user.profile_image:'default-user.png');
      user.company_logo = process.env.MEDIA_URL+'avtar/'+(user.company_logo?user.company_logo:'default-user.png');

      if(user.role){
        const role = await Role.findById(user.role||'');
        if(!role){
          user.role = '';
        }else{
          user.role = JSON.stringify(role);
        }
      }

      if(user.user_type === 'subuser'){
        const admin_user = await User.findOne({_id: user.admin_id, user_deleted:false},'subscription_status plan_key subscription_next_payment_date').populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches').lean();
        user.plan_id = admin_user.plan_id;
        user.subscription_status = admin_user.subscription_status;
        user.subscription_next_payment_date = admin_user.subscription_next_payment_date;
        user.plan_key = admin_user.plan_key;
      }


      await User.findOneAndUpdate(
        { _id: req.params.key },
        { $set: {user_last_online_at: new Date()} },
        { new: true }
      );

      return res.status(200).json({
        status: "success",
        data: {
          ...user,
          image_upload:image_upload,
          image_company_upload:image_company_upload,
          documents_path: `${process.env.MEDIA_URL}documents/`
        }
      });

    } catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async update(req, res) {
    try {


      const userId = req.user.userId;


      const user = await User.findById(req.params.key);

      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid Request" });
      }


      const postData = req.body;

      if(postData.email){
        postData.email = postData.email.toLowerCase();
      }

      // Find the user by email
      if(postData.email){
        let email = postData.email;
        var c_user = await User.findOne({ email, user_deleted:false, _id: { $ne: req.params.key }  });

        if(c_user){
          return res.status(200).json({ status:"F", message: "This email is already associated with another account. Please try a different email." });
        }
      }

      if(postData.phone_number){
        let phone_number = postData.phone_number;
        var c_user = await User.findOne({ phone_number, user_deleted:false, _id: { $ne: req.params.key } });

        if(c_user){
          return res.status(200).json({ status:"F", message: "This phone number is already associated with another account. Please try a different phone number." });
        }
      }


      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.key },
        { $set: postData },
        { new: true }
      );

      const image_upload = (updatedUser.profile_image?true:false);
      const image_company_upload = (updatedUser.company_logo?true:false);

      updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');
      updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');

      if(updatedUser.role){
        const role = await Role.findById(updatedUser.role||'');

        if(!role){
          updatedUser.role = '';
        }else{
          updatedUser.role = JSON.stringify(role);
        }
      }

      if (updatedUser) {

        await AppliedJob.updateMany(
          { candidate_id: updatedUser._id }, // Filter criteria
          {
            $set: {
              "user_info.first_name": updatedUser.first_name,
              "user_info.last_name": updatedUser.last_name
            }
          }
        );

        return res.status(200).json({
          status: "success",
          message: "Profile updated successfully",
          data: {
            ...updatedUser._doc,
            image_upload:image_upload,
            image_company_upload:image_company_upload,
            documents_path: `${process.env.MEDIA_URL}documents/`
          }
        });

      } else {
        return res.status(200).json({ status:"F", message: "Failed to update profile" });
      }
    } catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async resetpassword(req, res) {
    try {
      const user = await User.findById(req.params.key);
      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid Request" });
      }

      const { current_password, password, confirm_password } = req.body;

      const isPasswordValid = await bcrypt.compare(current_password, user.password);

      if (!isPasswordValid) {
        return res.status(200).json({ status:"F", message: "Invalid current password" });
      }

      if(password!=confirm_password){
        return res.status(200).json({ status:"F", message: "Please ensure that the password and confirm password fields match." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedPassword = await User.findOneAndUpdate(
        { _id: req.params.key },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (updatedPassword) {

        return res.status(200).json({
          status: "success",
          message: "Password updated successfully"
        });

      } else {
        return res.status(200).json({ status:"F", message: "Failed to update password" });
      }
    } catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async profileimage(req, res) {

    try{

      if(req.params.key !== "delete"){
        const user = await User.findById(req.params.key);

        if (!user) {
          return res.status(200).json({ status:"F", message: "Invalid User Request" });
        }

        const { profile_image } = req.body;


        if(profile_image){

          if(isValidUrl(profile_image)){

            // Download the file using Axios
            const response = await axios.get(profile_image, { responseType: 'arraybuffer' });
            const fileBuffer = Buffer.from(response.data);

            // Generate a random filename for the uploaded file (adjust as needed)
            const fileName = `file_${Date.now()}.png`;

            // Save the file using Multer
            const filePath = `uploads/avtar/${fileName}`;
            fs.writeFileSync(filePath, fileBuffer);
            if(user.profile_image && user.profile_image!=""){
              fs.access('uploads/avtar/'+user.profile_image, fs.constants.F_OK, async (err) => {
                if (err) {
                  console.error('File does not exist.');
                } else {
                  await unlink('uploads/avtar/'+user.profile_image);
                }
              });
            }

            await User.findOneAndUpdate(
              { _id: user._id },
              { $set: { profile_image: fileName } },
              { new: true }
            );

          }else{

            if(user.profile_image && user.profile_image!=""){
              try {
                await unlink('uploads/avtar/'+user.profile_image);
              } catch (error) {
                console.error(error.message);
              }
            }

            await User.findOneAndUpdate(
              { _id: user._id },
              { $set: { profile_image: profile_image } },
              { new: true }
            );
          }

          setTimeout(async () =>{

            const updateuser = await User.findById(user._id);

            let image =  process.env.MEDIA_URL+'avtar/'+(updateuser.profile_image?updateuser.profile_image:'user-dummy-img.png');

            await AppliedJob.updateMany(
              { candidate_id: user._id }, // Filter criteria
              {
                $set: {
                  "user_info.image": image
                }
              }
            );

            return res.status(200).json({
              status: "success",
              message: "Your profile picture has been successfully updated",
              image: image
            });



          },1000);
        }else{
          return res.status(200).json({
            status: "F",
            message: "Invalid file request!"
          });
        }

      }else{


        const updateuser = await User.findById(req.user.userId);
        if(updateuser.profile_image && updateuser.profile_image!=""){
          await unlink('uploads/avtar/'+updateuser.profile_image);


          let image =  process.env.MEDIA_URL+'avtar/default-user.png';

          await User.findOneAndUpdate(
            { _id: req.user.userId },
            { $set: { profile_image: "" } },
            { new: true }
          );

          return res.status(200).json({
            status: "success",
            message: "Your profile picture has been removed",
            image: image
          });
        }else{
          return res.status(200).json({
            status: "F"
          });
        }
      }

    }catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async getusersettings(req, res){
    try {

      const { key } = req.params;

      const user = await User.findById(key);

      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid Request" });
      }

      const getStatus = {
        push_notification:user.push_notification,
        career_tips:user.career_tips,
        platform_update:user.platform_update,
        newsletter:user.newsletter,
        communication_setting_one: user.communication_setting_one,
        communication_setting_two: user.communication_setting_two,
        communication_setting_three: user.communication_setting_three,
        communication_setting_four: user.communication_setting_four
      };

      return res.status(200).json({
        status: "success",
        data: getStatus
      });

    }catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async updateusersettings(req, res){
    try {

      const { key } = req.params;

      const user = await User.findById(key);

      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid Request, User not found." });
      }

      const {
        push_notification,
        career_tips,
        platform_update,
        newsletter,
        communication_setting_one,
        communication_setting_two,
        communication_setting_three,
        communication_setting_four
      } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        { _id: key },
        { $set: {
          push_notification,
          career_tips,
          platform_update,
          newsletter,
          communication_setting_one,
          communication_setting_two,
          communication_setting_three,
          communication_setting_four
        } },
        { new: true }
      );

      if (updatedUser) {
        return res.status(200).json({
          status: "success",
          message: "Notify setting updated successfully",
          data: updatedUser,
        });
      } else {
        return res.status(200).json({ status:"F", message: "Failed to update profile" });
      }

    }catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async deleteaccount(req, res) {

    try{

      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid user request" });
      }

      if(user.user_type === 'subuser'){
        return res.status(200).json({ status:"F", message: "You don't have access to perform this action." });
      }

      const postData = {
        user_deleted:true,
        user_deleted_at: Date.now()
      };

      postData.email = user.email+'_deleted';
      postData.phone_number = user.phone_number+'_deleted';

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: postData },
        { new: true }
      );

      if (updatedUser) {

        await ChatRoomModel.updateMany({ users: req.user.userId }, { $set: {
          room_status:'closed'
        }})
        .then(result => {
          console.log("Documents matched:", result.matchedCount);
          console.log("Documents modified:", result.modifiedCount);
        })
        .catch(error => console.error("Error updating documents:", error));

        await User.updateMany({ admin_id: req.user.userId }, { $set: {
          user_deleted:true,
          user_deleted_at: Date.now()
        } })
        .then(result => {
          console.log("Documents matched:", result.matchedCount);
          console.log("Documents modified:", result.modifiedCount);
        })
        .catch(error => console.error("Error updating documents:", error));

        await Jobs.updateMany({ user_id: req.user.userId }, { $set: { job_status: false } })
        .then(result => {
          console.log("Documents matched:", result.matchedCount);
          console.log("Documents modified:", result.modifiedCount);
        })
        .catch(error => console.error("Error updating documents:", error));

        return res.status(200).json({
          status: "success",
          message: "Account deleted successfully"
        });

      } else {
        return res.status(200).json({ status:"F", message: "Failed to delete account" });
      }

    }catch(err){
      return res.status(200).json({ status:"F", message: err.message });
    }
  }

  async getcompany(req, res) {

    try {

      const { key } = req.params;

      const user = await User.findOne({user_type:"manager",_id:key});

      const jobs = await Jobs.find({user_id:key,job_status:true}).lean();

      if(user){

        const result = await EmpReviewModel.aggregate([
          { $match: { employer_id: user._id } },
          { $group: { _id: "$employer_id", averageRating: { $avg: "$rating" } } }
        ]);

        user.company_logo = (user.company_logo?process.env.MEDIA_URL+'avtar/'+user.company_logo:'');

        const defaultValues = [];
        let idx = 1;

        for (const job of jobs) {

          defaultValues.push({
            s_no: idx,
            _id: job._id,
            job_position: job.job_position,
            location: job.location,
            job_type: job.job_type,
            expected_hours: job.expected_hours,
            job_description: job.job_description,
            job_payscale: (((job.job_min_amount?'$'+((job.job_min_amount||0).toLocaleString('en-US')):'')+(job.job_max_amount?'- $'+((job.job_max_amount||0).toLocaleString('en-US')):''))),
            job_pay_type: (job?.job_pay_type === 'Other'?job?.job_pay_type_other:job?.job_pay_type),
            logo: user.company_logo,
          });

          idx++;
        }


        return res.status(200).json({status:true, data: {
          business_type: user.business_type,
          employer_type: user.employer_type,
          business_ein_number: user.business_ein_number,
          location: user.location,
          city: user.city,
          state: user.state,
          zip_code: user.zip_code,
          number_of_employees: user.number_of_employees,
          company_logo: user.company_logo,
          company_purpose: user.company_purpose,
          company_culture: user.company_culture,
          company_values: user.company_values,
          company_life: user.company_life,
          jobs:defaultValues,
          rating: ((result.length > 0)?result[0].averageRating:0)
        }});

      }else{
        return res.status(200).json({status:false, message: "No company found."});
      }

    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }

  }

  async updatecompany(req, res) {

    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(200).json({ status:false, message: "Invalid Request" });
      }

      const postData = req.body;

      if(postData.company_logo){
        if(user.company_logo && user.company_logo!=""){
          try {
            await unlink('uploads/avtar/'+user.company_logo);
          } catch (error) {
            console.error(error.message);
          }

        }
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: postData },
        { new: true }
      );

      updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');
      updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');

      return res.status(200).json({
        status: true,
        message: "Company updated successfully",
        data: updatedUser
      });

    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }

  }

  async deletecompanyimage(req, res) {

    try {
      const userId = req.user.userId;

      const updateuser = await User.findById(req.user.userId);

      let image =  process.env.MEDIA_URL+'avtar/default-user.png';

      if(updateuser.company_logo && updateuser.company_logo!=""){

        await unlink('uploads/avtar/'+updateuser.company_logo);




        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { company_logo: "" } },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          message: "Your profile picture has been removed",
          image: image
        });

      }else{

        return res.status(200).json({
          status: true,
          message: "Your profile picture has been removed",
          image: image
        });

      }
    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }

  }

  async getbadges(req, res) {

    try {

      const { key } = req.params;

      let getBadges = await AssignBadgeModel.aggregate([
        {
          $match: { candidate_id: new mongoose.Types.ObjectId(key) }, // Filter by candidate_id
        },
        {
          $group: {
            _id: "$badge_id", // Group by badge_id
            count: { $sum: 1 }, // Count the number of occurrences of each badge_id
          },
        },
        {
          $lookup: {
            from: "badges", // The name of the collection where badges are stored
            localField: "_id", // The field from AssignBadgeModel
            foreignField: "_id", // The field from the BadgeModel to match
            as: "badge_details", // The resulting array field with badge details
          },
        },
        {
          $unwind: "$badge_details", // Unwind the array to get badge details as objects
        },
        {
          $project: {
            count: 1,
            badge_image: {
              $concat: [process.env.MEDIA_URL, 'badge/', "$badge_details.badge_image"], // Concatenate MEDIA_URL + 'badge/' + badge_image
            },
            badge_name: "$badge_details.title",
          },
        },
      ]);


      const skillBadge = await PurchaseModules.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(key), // Filter by the specific user
            type: { $in: ["skill", "internal"] }, // Only include "skill" and "internal" types
            completed: true, // Only include completed documents
          },
        },
        {
          $group: {
            _id: "$skill", // Group by the skill field
            //count: { $sum: 1 }, // Count occurrences of each skill (optional, adjust as needed)
          },
        },
        {
          $lookup: {
            from: "lmsskills", // The name of the collection where badges are stored
            localField: "_id", // Use `_id` from the previous stage (which contains the skill ID)
            foreignField: "_id", // Match with `_id` in the skills collection
            as: "skilldetail", // The resulting array field with badge details
          },
        },
        {
          $unwind: {
            path: "$skilldetail",
            preserveNullAndEmptyArrays: true, // Keep documents even if `skilldetail` is null
          },
        },
        {
          $project: {
            count: 1, // Include count (optional)
            badge_image: {
              $concat: [process.env.MEDIA_URL, 'lms/skills/', "$skilldetail.skill_badge"], // Construct badge URL
            },
            badge_name: "$skilldetail.title", // Extract title from skill details
          },
        },
      ]);


      const pathBadge = await PurchaseModules.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(key), // Filter by the specific user
            type: { $in: ["path"] }, // Only include "skill" and "internal" types
            completed: true, // Only include completed documents
          },
        },
        {
          $lookup: {
            from: "learningpaths", // The name of the collection where badges are stored
            localField: "path", // The field from AssignBadgeModel
            foreignField: "_id", // The field from the BadgeModel to match
            as: "pathdetail", // The resulting array field with badge details
          },
        },
        {
          $unwind: {
            path: "$pathdetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            count: 1,
            badge_image: {
              $concat: [process.env.MEDIA_URL, 'lms/path/', "$pathdetail.badge"], // Concatenate MEDIA_URL + 'badge/' + badge_image
            },
            badge_name: "$pathdetail.title",
          },
        },
      ]);

      return res.status(200).json({status: true, data:[...getBadges,...skillBadge,...pathBadge]});


    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }
  }

  async getgoals(req, res){

    try {

      const userId = req.user.userId;

      const getgoals = await GoalModel.find({user:userId})
      .populate('reward_path','title')
      .populate('reward_skill','title')
      .populate('reward_level','name')
      .populate('reward_product','title image')
      .populate('teenager','first_name last_name');


      return res.status(200).json({status: true, data:getgoals, path:`${process.env.MEDIA_URL}product/` });

    }catch (error) {
      return res.status(200).json({status: false, message:error.message});
    }

  }

}

module.exports = Profile;
