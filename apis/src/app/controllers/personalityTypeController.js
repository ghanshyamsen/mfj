/* eslint-disable array-callback-return */
const PersonalityTypeModel = require("../../models/personalitytype");

class PersonalityType{

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await PersonalityTypeModel.findById(key);

        return res.status(200).json({status: true, data: get });

      }else{

        const getType = async () => {

          const get = await PersonalityTypeModel.find({}, 'title');

          const defaultValues = [];
          let idx = 1;

          for (const type of get) {
            defaultValues.push({
              id: type._id,
              title: type.title
            })
            idx++;
          }

          return defaultValues;
        };

        getType().then(defaultValues => {
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

      const create = await PersonalityTypeModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Type created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;
      const postData = req.body;

      const update = await PersonalityTypeModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Type updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await PersonalityTypeModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Type deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = PersonalityType;
