const User = require("../../models/user");
const JobModel = require("../../models/jobs");
const ResumeModel = require("../../models/resume");
const ejs = require('ejs');
const path = require('path');


class Users  {

  async get(req, res) {

    try{
      const { key, type } = req.params;

      if(key && (!type || type === undefined)){
        const getUsers = await User.findById(key);

        const jobCounts =  await JobModel.countDocuments({user_id:key});
        // const resumes = await ResumeModel.findOne({
        //   user_id: key,
        // });

        let payload = {
          ...getUsers._doc,  // Spread the original user document to ensure all fields are included
          name: (`${ucfirst(getUsers.first_name)} ${ucfirst(getUsers.last_name)}`).trim(),
          profile_image: `${process.env.MEDIA_URL}avtar/${getUsers.profile_image ? getUsers.profile_image : 'default-user.png'}`,
          join_date: new Date(getUsers.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
          job_count:jobCounts
        };
        // Specify the correct path to the 'index.ejs' file
        /* const indexPath = path.join(__dirname+'../../..', 'views', 'index.ejs');
        const html = await ejs.renderFile(indexPath, { user: getUsers, resume: resumes,ipath:process.env.MEDIA_URL }); */


        return res.status(200).json({status: 'success', data:payload});

      }else{

        const getUsers = await User.find({user_type:type,user_deleted:false}, 'first_name last_name email user_type phone_number status signup_type').then(async function(users){

          const defaultValues = [];

          let idx = 1;
          for(let user of users){
            const jobCounts =  await JobModel.countDocuments({user_id:user._id});

            defaultValues.push({
              s_no: idx,
              id: user._id,
              name: (ucfirst(user.first_name)+" "+ucfirst(user.last_name)).trim(),
              signup_type: (user.signup_type).toUpperCase(),
              email: user.email,
              user_type: user.user_type,
              phone_number: user.phone_number,
              status: user.status,
              job_count:jobCounts
            })
            idx++;
          }
          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getUsers });
      }
    }catch(err){
      return res.status(500).json({ message:err.message });
    }

  }

  async update(req, res){
    try{

      const { key } = req.params;
      const PostData = req.body;

      const update = await User.findOneAndUpdate(
        {_id: key},
        {$set: PostData},
        {new: true}
      );

      res.status(200).json({
        status: 'success',
        message: "Updated successfully",
        data: update
      });


    }catch(err){
      res.status(500).json({message:err.message});
    }
  }

  async updatestatus(req, res) {

    try{
      const { id, status } = req.body;

      const update = await User.findOneAndUpdate(
        {_id: id},
        {$set: {
          status
        }},
        {new: true}
      );

      if(update){

        res.status(200).json({
          status: 'success',
          message: "Status updated successfully"
        });

      }else{
        res.status(500).json({message:"Oh No!, Something went wrong."});
      }

    }catch(err){
      res.status(500).json({message:err.message});
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const isDelete = await User.findOneAndDelete({_id: key});

        if(isDelete){

          await ResumeModel.findOneAndDelete({
            user_id: key,
          });

          res.status(200).json({
            status: 'success',
            message: "User deleted successfully"
          });
        }

      }else{
        res.status(404).json({ status: 'error', message: "Invalid request" });
      }


    }catch(err){
      res.status(500).json({message:err.message});
    }
  }

}

module.exports = Users;
