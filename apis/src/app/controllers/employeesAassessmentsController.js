/* eslint-disable array-callback-return */
const EmployeesAassessmentsModel = require("../../models/employeesaassessments");

class EmployeesAassessments{

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const get = await EmployeesAassessmentsModel.findById(key);
        return res.status(200).json({status: true, data: get});
      }else{

        const getValue = async () => {

          const get = await EmployeesAassessmentsModel.find({}, 'question options interpretation_guide updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const value of get) {
            defaultValues.push({
              s_no: idx,
              id: value._id,
              question: value.question,
              options: value.options,
              type: value.interpretation_guide,
              updated: new Date(value.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getValue().then(defaultValues => {
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

      const create = await EmployeesAassessmentsModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Question created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;
      const postData = req.body;

      const update = await EmployeesAassessmentsModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Question updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await EmployeesAassessmentsModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Question deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = EmployeesAassessments;
