const CourseworkModel = require("../../models/coursework");


class Coursework {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getCoursework = await CourseworkModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getCoursework._id,
          title: getCoursework.title,
          updated: new Date(getCoursework.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getCoursework = await CourseworkModel.find({}, 'title updatedAt').then(function(courseworks){

          const defaultValues = [];

          let idx = 1;
          courseworks.forEach((coursework) => {
            defaultValues.push({
              s_no: idx,
              id: coursework._id,
              title: coursework.title,
              updated: new Date(coursework.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getCoursework });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await CourseworkModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Coursework created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await CourseworkModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Coursework updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }


  async delete(req, res) {
    try{

      const { key } = req.params;

      await CourseworkModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Coursework deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Coursework;
