const SchoolModel = require("../../models/schools");


class Schools {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getSchools = await SchoolModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getSchools._id,
          title: getSchools.title,
          updated: new Date(getSchools.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getSchools = await SchoolModel.find({}, 'title updatedAt').then(function(schools){

          const defaultValues = [];

          let idx = 1;
          schools.forEach((school) => {
            defaultValues.push({
              s_no: idx,
              id: school._id,
              title: school.title,
              updated: new Date(school.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getSchools });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await SchoolModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"School created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await SchoolModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"School updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await SchoolModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"School deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Schools;
