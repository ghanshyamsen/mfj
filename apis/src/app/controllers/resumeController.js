const ResumeModel = require("../../models/resume");
const objective = require("../../models/objective");
const User = require("../../models/user");
const { unlink } = require('node:fs/promises');

const fs = require('fs');
const axios = require('axios');

function isValidUrl(string) {
  try {
      new URL(string);
      return true;
  } catch (err) {
      return false;
  }
}

class Resume {

  async get(req, res) {

    try{

      const { user } = req.query;

      const userId = (user?user:req.user.userId);

      let resumes = await ResumeModel.findOne({
        user_id: userId,
      });

      if(resumes){

        // const ejs = require('ejs');
        // const path = require('path');
        // Specify the correct path to the 'index.ejs' file
        // const indexPath = path.join(__dirname+'../../..', 'views', 'index.ejs');
        // const html = await ejs.renderFile(indexPath, { user: getUser, resume: resumes,ipath:process.env.MEDIA_URL });

        const image_upload = (resumes.image?true:false);
        resumes.image =  process.env.MEDIA_URL+(resumes.image?`resume/${resumes.image}`:'avtar/default-user.png');



        return res.status(200).json({status:"S", data:{
          ...resumes._doc,
          image_upload:image_upload
        }, html:""});

      }else{
        return res.status(200).json({status:"F", message:"No Record Exist."});
      }
    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }
  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const userId = (key?key:req.user.userId);

      let resumes = await ResumeModel.findOne({
        user_id: userId,
      });

      const PostData = req.body;


      if(resumes){

        if(PostData?.generate_summary){

          if(PostData.question_five_ans){
            resumes.question_five_ans = PostData.question_five_ans;
          }

          let getSummary = await generateSummary(resumes);
          if(getSummary && !PostData.objective_summary){
            PostData.objective_summary = getSummary;
          }

        }
      }

      if(isValidUrl(PostData.image)){
        const Image = PostData.image;
        // Download the file using Axios
        const response = await axios.get(Image, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data);

        // Generate a random filename for the uploaded file (adjust as needed)
        const fileName = `file_${Date.now()}.png`;

        // Save the file using Multer
        const filePath = `uploads/resume/${fileName}`;
        fs.writeFileSync(filePath, fileBuffer);

        PostData.image = fileName;
      }

      let SaveData;
      if(resumes){

        SaveData = await ResumeModel.findOneAndUpdate(
          {user_id: userId},
          {$set: PostData},
          {new: true}
        );

        //return res.status(200).json({status:"S", data:SaveData});
      }else{
        PostData.user_id = userId;
        SaveData = await ResumeModel.create(PostData);
      }

      // Updating the image URL
      SaveData = SaveData.toObject();
      SaveData.image = process.env.MEDIA_URL + (SaveData.image ? `resume/${SaveData.image}` : 'avtar/default-user.png');


      return res.status(200).json({status:"S", data:SaveData});

    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }
  }

  async delete(req, res){

    try{

      const userId = req.user.userId;

      let resumes = await ResumeModel.findOne({
        user_id: userId,
      });

      if(resumes){

        if(resumes.image && resumes.image!=""){
          await unlink('uploads/resume/'+resumes.image);

          const updated = await ResumeModel.findOneAndUpdate(
            {user_id: userId},
            {$set: {image:""}},
            {new: true}
          );

          updated.image =  process.env.MEDIA_URL+'avtar/default-user.png';

          return res.status(200).json({status:"S", data:updated});
        }else{
          return res.status(200).json({status:"F"});
        }

      }else{
        return res.status(200).json({status:"F", message:"Invalid request!!"});
      }

    }catch(err){
      return res.status(200).json({status:"F", message:err.message });
    }

  }

}

const generateSummary = async (resumes) =>{
  if(resumes.question_one_ans && resumes.question_two_ans && resumes.question_three_ans && resumes.question_four_ans && resumes.question_five_ans){

    const getObjective = await objective.find({}).then(function(objectives){

      const defaultValues = [];

      let idx = 1;
      objectives.forEach((obj) => {
        defaultValues.push({
          summary_one: obj.summary_one,
          summary_two: obj.summary_two,
          summary_three: obj.summary_three,
          summary_four: obj.summary_four
        })
        idx++;
      });

      return defaultValues;

    });

    // Create an array to store the combined values
    const combinedSentence = [];

    // Loop through the properties in the resume object
    const resume = {
      question_one_ans: resumes.question_one_ans,
      question_two_ans: resumes.question_two_ans,
      question_three_ans: resumes.question_three_ans,
      question_four_ans: resumes.question_four_ans,
      question_five_ans: resumes.question_five_ans
    };
    let i = 0;
    for (const key in resume) {
      if (resume.hasOwnProperty(key) && key.startsWith('question_')) {
        // Extract the question number from the key (e.g., 'question_one_ans' => 'one')
        const questionNumber = resume[key];

        // Find the corresponding objective based on the answer (e.g., 'one' => 'summary_one')
        const objectiveKey = `summary_${questionNumber}`;

        // Find the index of the corresponding objective

        const objectiveIndex = i;

        if (objectiveIndex !== -1) {
          // Add the value from the objective to the combined sentence
          combinedSentence.push(getObjective[objectiveIndex][objectiveKey]);
        }
        i++;
      }
    }

    // Create a sentence by joining the values with spaces
    const sentence = combinedSentence.join(' ');

    return sentence;
  }

  return "";
}

module.exports = Resume;
