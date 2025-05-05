/* eslint-disable array-callback-return */
const CareerModel = require("../../models/careers");

class Career {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const get = await CareerModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: get._id,
          title: get.title,
          updated: new Date(get.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getCareers = async () => {

          const get = await CareerModel.find({}, 'title updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const career of get) {
            defaultValues.push({
              s_no: idx,
              id: career._id,
              title: career.title,
              updated: new Date(career.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getCareers().then(defaultValues => {
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

      const create = await CareerModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Career created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;
      const postData = req.body;

      const update = await CareerModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Career updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await CareerModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Career deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Career;
