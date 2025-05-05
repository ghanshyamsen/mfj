const ArticleCategoryModel = require("../../models/articlecategory");


class ArticleCategory {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await ArticleCategoryModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: get._id,
          title: get.title,
          updated: new Date(get.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getCategories = await ArticleCategoryModel.find({}, 'title status, updatedAt').then(function(categories){

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

      const create = await ArticleCategoryModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Article category created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await ArticleCategoryModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Article category updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await ArticleCategoryModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Article category deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = ArticleCategory;
