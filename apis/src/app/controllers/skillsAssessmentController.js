const skillsAssessment = require("../../models/skillsAssessment");

class SkillsAssessment  {

  async get(req, res) {

    try{
      const { key } = req.params;

      if(key){
        const getAssessment = await skillsAssessment.findById(key);
        return res.status(200).json({status: 'success', data: getAssessment });
      }else{

        const getAssessment = await skillsAssessment.find({}).then(function(assessment){

          const defaultValues = [];

          let idx = 1;
          assessment.forEach((obj) => {
            defaultValues.push({
              s_no: idx,
              id: obj._id,
              question: obj.question,
              updated: new Date(obj.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

            })
            idx++;
          });

          return defaultValues;

        });

        return res.status(200).json({status: 'success', data: getAssessment });
      }


    }catch(err){
      return res.status(500).json({ message:err.message });
    }
  }


  async create(req, res){

    try{

      const postData = req.body;

      const create = await skillsAssessment.create(postData);

      return res.status(200).json({status:true, data:create, message:"Skills assessment created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {
    try {
      const isChecked = await skillsAssessment.findById(req.params.key);

      if (!isChecked) {
        return res.status(401).json({ message: "Invalid Request" });
      }

      const PostData = req.body;

      const updatedAssessment = await skillsAssessment.findOneAndUpdate(
        { _id: req.params.key },
        { $set: PostData},
        { new: true }
      );

      if (updatedAssessment) {

        return res.status(200).json({
          status: "success",
          message: "Skills Assessment updated successfully",
          data: updatedAssessment,
        });

      } else {
        return res.status(500).json({ message: "Failed to update skills assessment" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }


}

module.exports = SkillsAssessment;
