/* eslint-disable array-callback-return */
const multer = require("multer");
const HobbiesModel = require("../../models/hobbies");
const hCatModel = require("../../models/hobbiescategory");
const { unlink } = require('node:fs/promises');
const fs = require('fs');

class Hobbies {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getSkill = await HobbiesModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getSkill._id,
          title: getSkill.title,
          image: getSkill.image,
          category: (getSkill.category?getSkill.category:''),
          updated: new Date(getSkill.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getHobbies = async () => {
          const hobbies = await HobbiesModel.find({}, 'title image category updatedAt');
          const defaultValues = [];
          let idx = 1;

          for (const hobbie of hobbies) {

            const hCat = await hCatModel.findById(hobbie.category);

            defaultValues.push({
              s_no: idx,
              id: hobbie._id,
              title: hobbie.title,
              image: hobbie.image,
              category: (hCat?hCat.title:''),
              updated: new Date(hobbie.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }
          return defaultValues;
        };

        getHobbies().then(defaultValues => {
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

      const create = await HobbiesModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Hobbies created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;
      const postData = req.body;
      const files = req.files;

      const getSkill = await HobbiesModel.findById(key);

      if(!getSkill){
        return res.status(200).json({status:false, message:"No hobbies skill found."});
      }

      for (const key in files) {
        const fileList = files[key];
        fileList.forEach(async (file, index) => {

          fs.access('uploads/hobbies/'+getSkill.image, fs.constants.F_OK, async (err) => {
            if (err) {
              console.error('File does not exist.');
            } else {
              await unlink('uploads/hobbies/'+getSkill.image);
            }
          });
          if(file.filename){
            postData.image =  file.filename;
          }
        });
      }

      const update = await HobbiesModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Hobbies updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      const getSkill = await HobbiesModel.findById(key);

      if(!getSkill){
        return res.status(200).json({status:false, message:"No hobbies found."});
      }

      fs.access('uploads/hobbies/'+getSkill.image, fs.constants.F_OK, async (err) => {
        if (err) {
          console.error('File does not exist.');
        } else {
          await unlink('uploads/hobbies/'+getSkill.image);
        }
      });

      await HobbiesModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Hobbies deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Hobbies;
