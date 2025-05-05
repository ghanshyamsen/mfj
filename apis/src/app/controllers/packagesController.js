const mongoose = require('mongoose');

const PackageModel = require("../../models/packages");

class Packages {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await PackageModel.findById(key);

        return res.status(200).json({status: true, data: get});

      }else{

        const getPackage = async () => {

          const packages = await PackageModel.find({}, 'package_name package_credits package_price package_status updatedAt');

          const defaultValues = [];
          let idx = 1;
          for (const value of packages) {

            defaultValues.push({
              s_no: idx,
              id: value._id,
              name: value.package_name,
              credits: value.package_credits.toLocaleString('en'),
              price: '$'+value.package_price.toLocaleString('en'),
              status: value?.package_status,
              updated: new Date(value.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }
          return defaultValues;
        };

        getPackage().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){
    try{

      const postData = req.body;

      const create = await PackageModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Package added successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const payLoad = req.body;

      const update = await PackageModel.findOneAndUpdate(
        {_id: key},
        {$set: payLoad},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Package updated successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:(typeof err.message === 'string'?err.message:'something went wrong.')});
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      await PackageModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Package deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async getpackages(req, res) {

    try {

      const { key } = req.params;

      if(key){

        const getPackage = await PackageModel.findById(key);

        if(!getPackage){
          return res.status(200).json({status: false, message: 'Invalid package request!!' });
        }

        return res.status(200).json({status: true, data: getPackage });

      }else{

        const getPackage = async () => {

          const packages = await PackageModel.find({package_status:true});

          const defaultValues = [];
          let idx = 1;
          for (const value of packages) {

            defaultValues.push({
              ...value._doc,
              package_image: `${process.env.MEDIA_URL}package/${value.package_image}`
            });

            idx++;
          }
          return defaultValues;
        };

        getPackage().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });

      }

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }

  }

}


module.exports = Packages;
