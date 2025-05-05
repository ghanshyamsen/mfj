const objective = require("../../models/objective");

class Objective  {

  async get(req, res) {

    try{
      const { key } = req.params;

      if(key){
        const getObjective = await objective.findById(key);
        return res.status(200).json({status: 'success', data: getObjective });
      }else{

        const getObjective = await objective.find({}).then(function(objectives){

          const defaultValues = [];

          let idx = 1;
          objectives.forEach((obj) => {
            defaultValues.push({
              s_no: idx,
              id: obj._id,
              question: obj.question,
              option_one: obj.option_one,
              option_two: obj.option_two,
              option_three: obj.option_three,
              option_four: obj.option_four,
              summary_one: obj.summary_one,
              summary_two: obj.summary_two,
              summary_three: obj.summary_three,
              summary_four: obj.summary_four
            })
            idx++;
          });

          return defaultValues;

        });

        return res.status(200).json({status: 'success', data: getObjective });
      }


    }catch(err){
      return res.status(500).json({ message:err.message });
    }
  }

  async update(req, res) {
    try {
      const isChecked = await objective.findById(req.params.key);

      if (!isChecked) {
        return res.status(401).json({ message: "Invalid Request" });
      }

      const {
        question,
        option_one,
        option_two,
        option_three,
        option_four,
        summary_one,
        summary_two,
        summary_three,
        summary_four
      } = req.body;

      const updatedObjective = await objective.findOneAndUpdate(
        { _id: req.params.key },
        { $set: {
          question,
          option_one,
          option_two,
          option_three,
          option_four,
          summary_one,
          summary_two,
          summary_three,
          summary_four
        } },
        { new: true }
      );

      if (updatedObjective) {

        return res.status(200).json({
          status: "success",
          message: "Objective updated successfully",
          data: updatedObjective,
        });

      } else {
        return res.status(500).json({ message: "Failed to update objective" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }


}

module.exports = Objective;
