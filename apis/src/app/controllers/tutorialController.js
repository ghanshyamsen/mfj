const TutorialModel = require("../../models/tutorial");
const tCatModel = require("../../models/tutorialcategory");

class Tutorial {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getTutorial = await TutorialModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: getTutorial._id,
          question: getTutorial.question,
          answer: getTutorial.answer,
          category: getTutorial.category,
          updated: new Date(getTutorial.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getTutorial = async () => {
          const tutorials = await TutorialModel.find({}, 'question status category updatedAt');
          const defaultValues = [];
          let idx = 1;

          for (const tutorial of tutorials) {
            const tCat = await tCatModel.findById(tutorial.category);
            defaultValues.push({
              s_no: idx,
              id: tutorial._id,
              question: tutorial.question,
              category: (tCat?tCat.title:''),
              status: tutorial.status,
              updated: new Date(tutorial.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });
            idx++;
          }
          return defaultValues;
        };

        getTutorial().then(defaultValues => {
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

      const create = await TutorialModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Tutorial created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await TutorialModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Tutorial updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      await TutorialModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Tutorial deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async gettutorials(req, res){

    try{

      const { key } = req.params;

      if(key){

        const getTutorial = await TutorialModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: getTutorial._id,
          question: getTutorial.question,
          answer: getTutorial.answer,
          category: getTutorial.category,
          updated: new Date(getTutorial.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getTutorial = async () => {

          const tCat = await tCatModel.find({},'title');
          const defaultValues = [];
          let idx = 1;

          for (const cat of tCat) {

            const tutorials = await TutorialModel.find({category:cat._id}, 'question');

            defaultValues.push({
              s_no: idx,
              id: cat._id,
              title: cat.title,
              tutorial: tutorials
            });

            idx++;
          }

          return defaultValues;
        };

        getTutorial().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: 'success', data: defaultValues });
        });

      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }
}


module.exports = Tutorial;
