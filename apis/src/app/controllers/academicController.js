const AcademicModel = require("../../models/academic");


class Academic {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getAcademic = await AcademicModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getAcademic._id,
          title: getAcademic.title,
          updated: new Date(getAcademic.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getAcademic = await AcademicModel.find({}, 'title updatedAt').then(function(academics){

          const defaultValues = [];

          let idx = 1;
          academics.forEach((academic) => {
            defaultValues.push({
              s_no: idx,
              id: academic._id,
              title: academic.title,
              updated: new Date(academic.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getAcademic });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await AcademicModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Academic created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await AcademicModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Academic updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }


  async delete(req, res) {
    try{

      const { key } = req.params;

      await AcademicModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Academic deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Academic;
