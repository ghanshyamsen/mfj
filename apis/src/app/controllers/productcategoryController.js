const ProductCategoryModel = require("../../models/productcategory");


class ProductCategory {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await ProductCategoryModel.findOne({_id:key,deleted_status:false});

        return res.status(200).json({status: 'success', data: {
          id: get._id,
          title: get.title,
          updated: new Date(get.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getCategories = await ProductCategoryModel.find({deleted_status:false}, 'title status, updatedAt').then(function(categories){

          const defaultValues = [];

          let idx = 1;
          categories.forEach((category) => {
            defaultValues.push({
              s_no: idx,
              id: category._id,
              title: category.title,
              status: category.status,
              updated: new Date(category.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getCategories });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await ProductCategoryModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Product category created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await ProductCategoryModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Product category updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await ProductCategoryModel.findOneAndUpdate(
        { _id: key },
        {$set: {deleted_status: true}},
        {new: true}
      );

      return res.status(200).json({status:true, message:"Product category deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async getproductcategory(req, res) {

    try {

      const getCategories = await ProductCategoryModel.find({deleted_status:false}, 'title');

      return res.status(200).json({status: 'success', data: getCategories });

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }

  }

}


module.exports = ProductCategory;
