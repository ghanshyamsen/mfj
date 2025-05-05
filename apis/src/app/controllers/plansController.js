const multer = require("multer");
const PlanModel = require("../../models/plans");

const User = require("../../models/user");
const { unlink } = require('node:fs/promises');
const fs = require('fs');
const mongoose = require('mongoose');

class Plans {

  async get(req, res) {

    try{

      const { key } = req.params;
      const { plan_for } = req.query;

      if(key){

        const get = await PlanModel.findById(key);

        return res.status(200).json({status: 'success', data: get});

      }else{

        const getPlans = async () => {

          const plans = await PlanModel.find({plan_for:plan_for}, 'plan_name plan_title plan_price plan_for updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const plan of plans) {
            defaultValues.push({
              s_no: idx,
              id: plan._id,
              name: plan.plan_name,
              for: ucfirst(plan.plan_for),
              title: plan.plan_title,
              price: plan?.plan_price,
              updated: new Date(plan.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getPlans().then(defaultValues => {
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

      const create = await PlanModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Plan created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;


      const plan = await PlanModel.findById(key);

      if(!plan){
        return res.status(200).json({ status:false, message:"No plan found." });
      }

      const update = await PlanModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Plan updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await PlanModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Plan deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }


}


module.exports = Plans;
