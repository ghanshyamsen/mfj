const hCatModel = require("../../models/hobbiescategory");


class HobbiesCategory {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getCategory = await hCatModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getCategory._id,
          title: getCategory.title,
          updated: new Date(getCategory.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getCategories = await hCatModel.find({}, 'title status, updatedAt').then(function(categories){

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

      const create = await hCatModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Hobbies category created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await hCatModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Hobbies category updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await hCatModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Hobbies category deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = HobbiesCategory;
