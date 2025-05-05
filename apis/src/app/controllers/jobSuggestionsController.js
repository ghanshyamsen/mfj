const mongoose = require('mongoose');

const JobSuggestionModel = require("../../models/jobsuggestions");
const JobCategoryModel = require("../../models/jobcategory");

class JobSuggestion {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await JobSuggestionModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: get._id,
          job_title: get.job_title,
          job_description: get.job_description,
          job_category: get.job_category,
          updated: new Date(get.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getJobs = async () => {

          const jobs = await JobSuggestionModel.find({}, 'job_title job_description job_status updatedAt').populate('job_category','title');

          const defaultValues = [];
          let idx = 1;
          for (const job of jobs) {

            defaultValues.push({
              s_no: idx,
              id: job._id,
              job_title: job.job_title,
              job_description: job.job_description,
              job_status: (job?.job_status?job?.job_status:false),
              job_category: job?.job_category?.title,
              updated: new Date(job.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

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

      const create = await JobSuggestionModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Job suggestion added successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const payLoad = req.body;

      const update = await JobSuggestionModel.findOneAndUpdate(
        {_id: key},
        {$set: payLoad},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Job suggestion updated successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:(typeof err.message === 'string'?err.message:'something went wrong.') });
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      await JobSuggestionModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Job suggestion deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async findjob(req, res){

    try {

      const { keyword, all } = req.query;

      if(keyword){

        const get = await JobSuggestionModel.find(
          { job_title: new RegExp(keyword, 'i'), job_status:true }, // 'i' for case-insensitive search
          'job_title job_description'
        ).populate('job_category','title').limit(50);

        return res.status(200).json({status:true, data:get });
      }else if(all){

        const get = await JobSuggestionModel.find({ job_status: true }, 'job_title')
        .populate('job_category', 'title')
        .sort({ job_title: 1 }) // Initial sort by job_title as fallback
        .lean(); // Use .lean() for faster execution (returns plain JS objects)

        const sortedResults = get.sort((a, b) => {
          const categoryA = a.job_category?.title?.toLowerCase() || '';
          const categoryB = b.job_category?.title?.toLowerCase() || '';

          // Compare job_category.title
          if (categoryA < categoryB) return -1;
          if (categoryA > categoryB) return 1;

          // If job_category.title is the same, compare job_title
          const jobTitleA = a.job_title?.toLowerCase() || '';
          const jobTitleB = b.job_title?.toLowerCase() || '';
          return jobTitleA.localeCompare(jobTitleB);
        });

        return res.status(200).json({status:true, data:sortedResults });

      }else{
        return res.status(200).json({status:false});
      }

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }

  }

  /** Categories */
  async getcategory(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await JobCategoryModel.findById(key);

        return res.status(200).json({status: true, data: {
          id: get._id,
          title: get.title,
          updated: new Date(get.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getCategories = async () => {

          const categories = await JobCategoryModel.find({}, 'title updatedAt');

          const defaultValues = [];
          let idx = 1;
          for (const cat of categories) {

            defaultValues.push({
              s_no: idx,
              id: cat._id,
              title: cat.title,
              updated: new Date(cat.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }
          return defaultValues;
        };

        getCategories().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async createcategory(req, res){

    try{

      const postData = req.body;

      const create = await JobCategoryModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Job category added successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async updatecategory(req, res) {

    try{

      const { key } = req.params;

      const payLoad = req.body;

      const update = await JobCategoryModel.findOneAndUpdate(
        {_id: key},
        {$set: payLoad},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Job category updated successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:(typeof err.message === 'string'?err.message:'something went wrong.') });
    }
  }

  async deletecategory(req, res) {

    try{

      const { key } = req.params;

      await JobCategoryModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Job category deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

}


module.exports = JobSuggestion;
