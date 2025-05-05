const tCatModel = require("../../models/tutorialcategory");


class TutorialCategory {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getTutorial = await tCatModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getTutorial._id,
          title: getTutorial.title,
          updated: new Date(getTutorial.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getTutorials = await tCatModel.find({}, 'title status, updatedAt').then(function(tutorials){

          const defaultValues = [];

          let idx = 1;
          tutorials.forEach((tutoria) => {
            defaultValues.push({
              s_no: idx,
              id: tutoria._id,
              title: tutoria.title,
              status: tutoria.status,
              updated: new Date(tutoria.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getTutorials });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await tCatModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Tutorial Category created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await tCatModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Tutorial Category updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await tCatModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Tutorial Category deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = TutorialCategory;
