const multer = require("multer");
const ActivitieModel = require("../../models/activities");
const aCatModel = require("../../models/activitiecategory");
const { unlink } = require('node:fs/promises');
const fs = require('fs');


class Activities {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getActivitie = await ActivitieModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getActivitie._id,
          title: getActivitie.title,
          image: getActivitie.image,
          category: getActivitie.category,
          updated: new Date(getActivitie.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getActivitie = async () => {
          const activities = await ActivitieModel.find({}, 'title image category updatedAt');
          const defaultValues = [];
          let idx = 1;

          for (const activitie of activities) {

            const aCat = await aCatModel.findById(activitie.category);

            defaultValues.push({
              s_no: idx,
              id: activitie._id,
              title: activitie.title,
              image: activitie.image,
              category: (aCat?.title||'N/A'),
              updated: new Date(activitie.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }
          return defaultValues;
        };

        getActivitie().then(defaultValues => {
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
      const files = req.files;

      for (const key in files) {
        const fileList = files[key];
        fileList.forEach(async (file, index) => {
          if(file.filename){
            postData.image =  file.filename;
          }
        });
      }

      const create = await ActivitieModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Activity created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;
      const files = req.files;

      const activitie = await ActivitieModel.findById(key);

      if(!activitie){
        return res.status(200).json({status:false, message:"No activities found."});
      }

      for (const key in files) {
        const fileList = files[key];
        fileList.forEach(async (file, index) => {

          fs.access('uploads/activitie/'+activitie.image, fs.constants.F_OK, async (err) => {
            if (err) {
              console.error('File does not exist.');
            } else {
              await unlink('uploads/activitie/'+activitie.image);
            }
          });

          if(file.filename){
            postData.image =  file.filename;
          }
        });
      }


      const update = await ActivitieModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Activity updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await ActivitieModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Activity deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Activities;
