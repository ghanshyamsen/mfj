const SkillModel = require("../../models/skills");
const { unlink } = require('node:fs/promises');
const fs = require('fs');


class Skills {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getSkill = await SkillModel.findById(key);
        return res.status(200).json({status: 'success', data: {
          id: getSkill._id,
          title: getSkill.title,
          image: getSkill.image,
          updated: new Date(getSkill.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getSkills = await SkillModel.find({}, 'title updatedAt').then(function(skills){

          const defaultValues = [];

          let idx = 1;
          skills.forEach((skill) => {
            defaultValues.push({
              s_no: idx,
              id: skill._id,
              title: skill.title,
              image: skill.image,
              updated: new Date(skill.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          });

          return defaultValues;
        });

        return res.status(200).json({status: 'success', data: getSkills });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;
      const files = req.files;

      for (const key in files) {
        const fileList = files[key];
        fileList.forEach(async (file, index) => {
          if(file.filename){
            postData.image =  file.filename;
          }
        });
      }

      const create = await SkillModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Skill created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;
      const files = req.files;

      const postData = req.body;


      const getSkill = await SkillModel.findById(key);

      if(!getSkill){
        return res.status(200).json({status:false, message:"No skill found."});
      }

      for (const key in files) {
        const fileList = files[key];
        fileList.forEach(async (file, index) => {

          fs.access('uploads/skills/'+getSkill.image, fs.constants.F_OK, async (err) => {
            if (err) {
              console.error('File does not exist.');
            } else {
              await unlink('uploads/skills/'+getSkill.image);
            }
          });
          if(file.filename){
            postData.image =  file.filename;
          }
        });
      }

      const update = await SkillModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Skill updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }


  async delete(req, res) {
    try{

      const { key } = req.params;

      const getSkill = await SkillModel.findById(key);

      if(!getSkill){
        return res.status(200).json({status:false, message:"No volunteer skill found."});
      }

      if(+getSkill.image){
        fs.access('uploads/skills/'+getSkill.image, fs.constants.F_OK, async (err) => {
          if (err) {
            console.error('File does not exist.');
          } else {
            await unlink('uploads/skills/'+getSkill.image);
          }
        });
      }

      await SkillModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Skill deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Skills;
