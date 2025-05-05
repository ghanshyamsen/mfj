const multer = require("multer");
const RankModel = require("../../models/ranks");
const UpdateRankModel = require("../../models/updaterank");

const User = require("../../models/user");
const { unlink } = require('node:fs/promises');
const fs = require('fs');
const mongoose = require('mongoose');

class Ranks {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await RankModel.findById(key);

        return res.status(200).json({status: 'success', data: get});

      }else{

        const getRanks = async () => {

          const ranks = await RankModel.find({}, ' title image order default updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const rank of ranks) {
            defaultValues.push({
              s_no: idx,
              id: rank._id,
              title: rank.title,
              image: rank.image ? `${process.env.MEDIA_URL}product/${rank.image}` : "",
              order: rank?.order,
              default: rank?.default,
              updated: new Date(rank.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getRanks().then(defaultValues => {
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

      const create = await RankModel.create(postData);

      const userCounts = await User.countDocuments({user_type:"teenager", user_deleted: false});

      await UpdateRankModel.create({
        rank: create._id,
        total_count: userCounts,
        complete_count: 0
      });

      return res.status(200).json({status:true, data:create, message:"Rank created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;


      const rank = await RankModel.findById(key);

      if(!rank){
        return res.status(200).json({ status:false, message:"No rank found." });
      }

      if(postData.image && rank.image){
        try{
          await unlink('uploads/rank/'+article.image);
        }catch(e){
          console.log(e.message);
        }
      }

      const update = await RankModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );



      if (JSON.stringify(rank) !== JSON.stringify(update)) {

        const userCounts = await User.countDocuments({user_type:"teenager", user_deleted: false});

        await UpdateRankModel.create({
          rank: update._id,
          total_count: userCounts,
          complete_count: 0
        });

      }

      return res.status(200).json({status:true, data:update, message:"Rank updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await RankModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Rank deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }


}


module.exports = Ranks;
