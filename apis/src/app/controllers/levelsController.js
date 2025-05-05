const multer = require("multer");
const LevelModel = require("../../models/levels");

const User = require("../../models/user");
const { unlink } = require('node:fs/promises');
const fs = require('fs');
const mongoose = require('mongoose');

class Levels {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await LevelModel.findById(key);

        return res.status(200).json({status: 'success', data: get});

      }else{

        const getLevels = async () => {

          const levels = await LevelModel.find({}, 'name title status order updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const level of levels) {
            defaultValues.push({
              s_no: idx,
              id: level._id,
              name: level.name,
              title: level.title,
              order: level?.order,
              updated: new Date(level.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getLevels().then(defaultValues => {
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

      const create = await LevelModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Level created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;


      const level = await LevelModel.findById(key);

      if(!level){
        return res.status(200).json({ status:false, message:"No level found." });
      }

      const update = await LevelModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Level updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await LevelModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Level deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }


}


module.exports = Levels;
