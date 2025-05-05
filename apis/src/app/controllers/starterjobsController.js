/* eslint-disable array-callback-return */
const StarterJob = require("../../models/starterjobs");

class StarterJobs {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const get = await StarterJob.findById(key);

        return res.status(200).json({status: 'success', data: get });

      }else{

        const getJobs = async () => {

          const get = await StarterJob.find({}, 'job_title updatedAt').populate('career_id', 'title');

          const defaultValues = [];
          let idx = 1;

          for (const job of get) {
            defaultValues.push({
              s_no: idx,
              id: job._id,
              title: job.job_title,
              career: job.career_id.title,
              updated: new Date(job.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getJobs().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: 'success', data: defaultValues });
        });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await StarterJob.create(postData);

      return res.status(200).json({status:true, data:create, message:"Jobs created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;
      const postData = req.body;

      const update = await StarterJob.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Jobs updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await StarterJob.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Jobs deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = StarterJobs;
