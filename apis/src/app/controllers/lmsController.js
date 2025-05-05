
const mongoose = require('mongoose');

const SkillModel = require("../../models/lmsskill");
const LearningPathModel = require("../../models/learningpath");
const MaterialModel = require("../../models/learningmaterial");
const AssessmentModel = require("../../models/learningassessment");
const PurchaseModules = require("../../models/purchasemodules");
const ReviewModel = require("../../models/lmsreview");


const { unlink } = require('node:fs/promises');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const fsx = require("fs-extra");


async function extractZip(zipFilePath, extractToFolder) {
    await fsx.ensureDir(extractToFolder); // Ensure target directory exists

    return new Promise((resolve, reject) => {
      exec(`unzip -o "${zipFilePath}" -d "${extractToFolder}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Extraction failed:", error);
          reject(new Error("ZIP extraction failed"));
        } else {
          console.log("✅ Extraction complete:", stdout);
          resolve(stdout);
        }
      });
    });
}

async function findHtmlFile(folderPath) {
    try {
      const files = await fsx.promises.readdir(folderPath); // ✅ Use fs.promises.readdir()

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = await fsx.promises.stat(filePath); // ✅ Use fs.promises.stat()

        if (stat.isDirectory()) {
          // 🔍 Recursively check subdirectories
          const foundFile = await findHtmlFile(filePath);
          if (foundFile) return foundFile;
        } else if (file === "story.html" || file === "index.html") {
          return filePath; // 🎯 Return the first matching file found
        }
      }

      return null; // 🚫 No matching file found
    } catch (err) {
      console.error("❌ Error searching HTML file:", err);
      return null;
    }
}

class LMS {

    /** Learning Skill */
    async getskill(req, res) {

        try{

            const { key } = req.params;

            if(key){

                const get = await SkillModel.findById(key);

                return res.status(200).json({status: true, data: get });

            }else{

                const getSkills = async () => {

                    const skills = await SkillModel.find({}, 'title credit_price reward_price expiration_period status updatedAt');

                    const defaultValues = [];
                    let idx = 1;
                    for (const skill of skills) {

                        let pcount = await PurchaseModules.countDocuments({skill: skill._id});

                        defaultValues.push({
                            s_no: idx,
                            id: skill._id,
                            title: skill.title,
                            credit_price: skill.credit_price.toLocaleString('en'),
                            reward_price: (skill.reward_price||0).toLocaleString('en'),
                            expiration_period: skill.expiration_period,
                            status: skill.status,
                            updated: new Date(skill.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                            pcount: pcount
                        });

                        idx++;
                    }

                    return defaultValues;
                };

                getSkills().then(defaultValues => {
                    // You can use defaultValues here if needed
                    return res.status(200).json({status: true, data: defaultValues });
                });
            }

        }catch(err){
            return res.status(200).json({status:false, message:err.message });
        }

    }

    async createskill(req, res) {

        try {

            const postData = req.body;

            // Remove entries with empty values for upselling paths
            postData.upselling_path = (postData.upselling_path || []).filter(
                (item) => item && item.path && item.path.trim() !== '' && item.discount !== ''
            );

            // Remove entries with empty values for upselling skills
            postData.upselling_skills = (postData.upselling_skills || []).filter(
                (item) => item && item.skill && item.skill.trim() !== '' && item.discount !== ''
            );

            const create = await SkillModel.create(postData);

            return res.status(200).json({status:true, data:create, message:"Skill created successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    async updateskill(req, res) {

        try{

            const { key } = req.params;

            const postData = req.body;

            const skill = await SkillModel.findById(key);

            if(!skill){
              return res.status(200).json({ status:false, message:"No skill found." });
            }

            if(postData.thumbnail && skill.thumbnail){
              try{
                await unlink('uploads/lms/skills/'+skill.thumbnail);
              }catch(e){
                console.log(e.message);
              }
            }

            if(postData.skill_logo && skill.skill_logo){
                try{
                    await unlink('uploads/lms/skills/'+skill.skill_logo);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(postData.skill_badge && skill.skill_badge){
                try{
                    await unlink('uploads/lms/skills/'+skill.skill_badge);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(postData?.upselling_path){
                // Remove entries with empty values for upselling paths
                postData.upselling_path = (postData.upselling_path || []).filter(
                    (item) => item && item.path && item.path.trim() !== '' && item.discount !== ''
                );
            }

            if(postData?.upselling_skills){
                // Remove entries with empty values for upselling skills
                postData.upselling_skills = (postData.upselling_skills || []).filter(
                    (item) => item && item.skill && item.skill.trim() !== '' && item.discount !== ''
                );
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

    async deleteskill(req, res) {

        try {

            const { key } = req.params;

            const skill = await SkillModel.findById(key);

            if(!skill){
              return res.status(200).json({ status:false, message:"No skill found." });
            }

            let pcount = await PurchaseModules.countDocuments({skill: key});

            if(pcount > 0){
                return res.status(200).json({ status:false, message:"You can't delete this skill." });
            }

            if(skill.thumbnail){
                try{
                    await unlink('uploads/lms/skills/'+skill.thumbnail);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(skill.skill_logo){
                try{
                    await unlink('uploads/lms/skills/'+skill.skill_logo);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(skill.skill_badge){
                try{
                    await unlink('uploads/lms/skills/'+skill.skill_badge);
                }catch(e){
                    console.log(e.message);
                }
            }


            await SkillModel.findOneAndDelete({ _id: key });

            return res.status(200).json({status:true, message:"Skill deleted successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    async getupsellinglist(req, res) {
        try {

            const { key } = req.params;

            let find = {};

            if (key) {
                find._id = { $ne: key };
            }

            const path = await LearningPathModel.find(find, 'title');

            const skills = await SkillModel.find(find, 'title');

            return res.status(200).json({ status: true, path: path, skills:skills });

        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    /** Learning Path */
    async getpath(req, res) {

        try{

            const { key } = req.params;

            if(key){

                const get = await LearningPathModel.findById(key);

                return res.status(200).json({status: true, data: get });

            }else{

                const getPath = async () => {

                    const paths = await LearningPathModel.find({}, 'title credit_price reward_price expiration_period status updatedAt');

                    const defaultValues = [];
                    let idx = 1;
                    for (const path of paths) {

                        let pcount = await PurchaseModules.countDocuments({path: path._id});

                        defaultValues.push({
                            s_no: idx,
                            id: path._id,
                            title: path.title,
                            credit_price: path.credit_price.toLocaleString('en'),
                            reward_price: (path.reward_price||0).toLocaleString('en'),
                            expiration_period: path.expiration_period,
                            status: path.status,
                            updated: new Date(path.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                            pcount: pcount
                        });

                        idx++;
                    }

                    return defaultValues;
                };

                getPath().then(defaultValues => {
                    // You can use defaultValues here if needed
                    return res.status(200).json({status: true, data: defaultValues });
                });
            }

        }catch(err){
            return res.status(200).json({status:false, message:err.message });
        }

    }

    async createpath(req, res) {

        try {

            const postData = req.body;

            // Remove entries with empty values for upselling paths
            postData.upselling_path = (postData.upselling_path || []).filter(
                (item) => item && item.path && item.path.trim() !== '' && item.discount !== ''
            );

            // Remove entries with empty values for upselling skills
            postData.upselling_skills = (postData.upselling_skills || []).filter(
                (item) => item && item.skill && item.skill.trim() !== '' && item.discount !== ''
            );

            if (postData.skills.length > 0) {
                postData.skills = JSON.parse(postData.skills);
            } else {
                postData.skills = []; // Ensure skills is an empty array if not provided
            }

            const create = await LearningPathModel.create(postData);

            return res.status(200).json({status:true, data:create, message:"Path created successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    async updatepath(req, res) {

        try{

            const { key } = req.params;

            const postData = req.body;

            const path = await LearningPathModel.findById(key);

            if(!path){
              return res.status(200).json({ status:false, message:"No path found." });
            }

            if(postData.thumbnail && path.thumbnail){
              try{
                await unlink('uploads/lms/path/'+path.thumbnail);
              }catch(e){
                console.log(e.message);
              }
            }

            if(postData.logo && path.logo){
                try{
                    await unlink('uploads/lms/path/'+path.logo);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(postData.badge && path.badge){
                try{
                    await unlink('uploads/lms/path/'+path.badge);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(postData?.upselling_path){
                // Remove entries with empty values for upselling paths
                postData.upselling_path = (postData.upselling_path || []).filter(
                    (item) => item && item.path && item.path.trim() !== '' && item.discount !== ''
                );
            }

            if(postData?.upselling_skills){
                // Remove entries with empty values for upselling skills
                postData.upselling_skills = (postData.upselling_skills || []).filter(
                    (item) => item && item.skill && item.skill.trim() !== '' && item.discount !== ''
                );
            }


            if(postData?.skills){
                if (postData.skills.length > 0) {
                    postData.skills = JSON.parse(postData.skills);
                } else {
                    postData.skills = []; // Ensure skills is an empty array if not provided
                }
            }

            const update = await LearningPathModel.findOneAndUpdate(
              {_id: key},
              {$set: postData},
              {new: true}
            );

            return res.status(200).json({status:true, data:update, message:"Path updated successfully."});

        }catch(err){

            return res.status(200).json({status:false, message:err.message });
        }
    }

    async deletepath(req, res) {

        try {

            const { key } = req.params;

            const path = await LearningPathModel.findById(key);

            if(!path){
              return res.status(200).json({ status:false, message:"No path found." });
            }

            let pcount = await PurchaseModules.countDocuments({path: path._id});

            if(pcount > 0){
                return res.status(200).json({ status:false, message:"You can't delete this path." });
            }

            if(path.thumbnail){
                try{
                    await unlink('uploads/lms/path/'+path.thumbnail);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(path.logo){
                try{
                    await unlink('uploads/lms/path/'+path.logo);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(path.badge){
                try{
                    await unlink('uploads/lms/path/'+path.badge);
                }catch(e){
                    console.log(e.message);
                }
            }


            await LearningPathModel.findOneAndDelete({ _id: key });

            return res.status(200).json({status:true, message:"Path deleted successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    /** Learning Material */
    async getmaterial(req, res) {

        try {

            const { key } = req.params;
            const { skill } = req.query;


            if(key){

                const get = await MaterialModel.findById(key);

                return res.status(200).json({status: true, data: get });

            }else{

                const getMaterials = async () => {

                    const find = skill?{skill:skill}:{};

                    const materials = await MaterialModel.find(find, 'title status order updatedAt').populate('skill', 'title').sort({order:1});

                    const defaultValues = [];
                    let idx = 1;
                    for (const material of materials) {

                        let pcount = await PurchaseModules.countDocuments({skill: material?.skill?._id});


                        defaultValues.push({
                            s_no: idx,
                            id: material._id,
                            title: material.title,
                            skill: (material?.skill?.title || 'N/A'),
                            status: material.status,
                            order: material.order,
                            updated: new Date(material.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                            pcount: pcount
                        });

                        idx++;
                    }

                    return defaultValues;
                };

                getMaterials().then(defaultValues => {
                    // You can use defaultValues here if needed
                    return res.status(200).json({status: true, data: defaultValues });
                });
            }


        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }
    }

    async creatematerial(req, res) {

        try {

            const postData = req.body;

            if(postData.content_media){
                try{
                    await extractZip(postData.zipFilePath, postData.targetDir);

                    const htmlFile = await findHtmlFile(postData.targetDir);

                    const relativePath = htmlFile.split("/lms/")[1]; // Extract path after 'lms'
                    const finalPath = `lms/${relativePath}`;
                    postData.content_media_path =  finalPath;

                }catch(e){
                    console.log(e.message);
                }
            }

            const getCount = await MaterialModel.countDocuments({skill:postData.skill});

            postData.order = (getCount + 1);

            const create = await MaterialModel.create(postData);

            return res.status(200).json({status:true, data:create, message:"Learning material created successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    async updatematerial(req, res) {

        try{

            const { key } = req.params;

            const postData = req.body;

            const material = await MaterialModel.findById(key);

            if(!material){
              return res.status(200).json({ status:false, message:"No material found." });
            }

            if(postData?.atype === 'order'){

                const newOrder = (postData?.dir === 'up'?material.order-1:material.order+1);

                await MaterialModel.findOneAndUpdate(
                    {order: newOrder, skill:material.skill },
                    {$set: {order: postData?.order}},
                    {new: true}
                );

                material.order = newOrder;
                const update = await material.save();

                return res.status(200).json({status:true, message:"Learning material updated successfully."});
            }else{

                if(postData.thumbnail && material.thumbnail){
                    try{
                        await unlink('uploads/lms/material/'+material.thumbnail);
                    }catch(e){
                        console.log(e.message);
                    }
                }

                if(postData.material_media && material.material_media){
                    try{
                        await unlink('uploads/lms/material/'+material.material_media);
                    }catch(e){
                        console.log(e.message);
                    }
                }

                if(postData.content_media){
                    try{
                        await extractZip(postData.zipFilePath, postData.targetDir);

                        const htmlFile = await findHtmlFile(postData.targetDir);

                        const relativePath = htmlFile.split("/lms/")[1]; // Extract path after 'lms'
                        const finalPath = `lms/${relativePath}`;
                        postData.content_media_path =  finalPath;

                    }catch(e){
                        console.log(e.message);
                    }
                }

                //`lms/material/bundle/${extractFolderName}`
                if(postData.content_media && material.content_media){
                    try{
                        await unlink('uploads/lms/material/'+material.content_media);
                        let flPath = 'uploads/lms/material/bundle/'+path.parse(material.content_media).name;
                        //await unlink('uploads/lms/material/bundle/'+path.parse(material.content_media).name);
                        if (await fsx.pathExists(flPath)) {
                            await fsx.remove(flPath); // ✅ Removes folder and its contents
                            console.log(`✅ Successfully deleted folder: ${flPath}`);
                        } else {
                            console.log(`⚠️ Folder does not exist: ${flPath}`);
                        }
                    }catch(e){
                        console.log(e.message);
                    }
                }

                const update = await MaterialModel.findOneAndUpdate(
                    {_id: key},
                    {$set: postData},
                    {new: true}
                );

                return res.status(200).json({status:true, data:update, message:"Learning material updated successfully."});
            }

        }catch(err){

            return res.status(200).json({status:false, message:err.message });
        }
    }

    async deletematerial(req, res) {

        try {

            const { key } = req.params;

            const material = await MaterialModel.findById(key);

            const skill = material.skill;

            if(!material){
              return res.status(200).json({ status:false, message:"No material found." });
            }

            if(material.thumbnail){
                try{
                    await unlink('uploads/lms/material/'+material.thumbnail);
                }catch(e){
                    console.log(e.message);
                }
            }

            if(material.material_media){
                try{
                  await unlink('uploads/lms/material/'+material.material_media);
                }catch(e){
                  console.log(e.message);
                }
            }

            if(material.content_media){
                try{
                    await unlink('uploads/lms/material/'+material.content_media);
                    let flPath = 'uploads/lms/material/bundle/'+path.parse(material.content_media).name;
                    //await unlink('uploads/lms/material/bundle/'+path.parse(material.content_media).name);
                    if (await fsx.pathExists(flPath)) {
                        await fsx.remove(flPath); // ✅ Removes folder and its contents
                        console.log(`✅ Successfully deleted folder: ${flPath}`);
                    } else {
                        console.log(`⚠️ Folder does not exist: ${flPath}`);
                    }
                }catch(e){
                    console.log(e.message);
                }
            }


            await MaterialModel.findOneAndDelete({ _id: key });

            const items = await MaterialModel.find({skill:skill}).sort({ order: 1 });

            for (let i = 0; i < items.length; i++) {
                items[i].order = i + 1;
                await items[i].save();
            }

            return res.status(200).json({status:true, message:"Learning material deleted successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    /** Learning Assessments */
    async getassessment(req, res) {

        try {

            const { key } = req.params;

            if(key){

                const get = await AssessmentModel.findById(key);

                return res.status(200).json({status: true, data: get });

            }else{

                const getAssessments = async () => {

                    const assessments = await AssessmentModel.find({}, 'title status updatedAt').populate('skill', 'title');

                    const defaultValues = [];
                    let idx = 1;
                    for (const assessment of assessments) {

                        let pcount = await PurchaseModules.countDocuments({skill: assessment?.skill?._id});

                        defaultValues.push({
                            s_no: idx,
                            id: assessment._id,
                            title: assessment.title,
                            skill: (assessment?.skill?.title || 'N/A'),
                            status: assessment.status,
                            updated: new Date(assessment.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                            pcount: pcount
                        });

                        idx++;
                    }

                    return defaultValues;
                };

                getAssessments().then(defaultValues => {
                    // You can use defaultValues here if needed
                    return res.status(200).json({status: true, data: defaultValues });
                });
            }


        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }
    }

    async createassessment(req, res) {

        try {

            const postData = req.body;

            const create = await AssessmentModel.create(postData);

            return res.status(200).json({status:true, data:create, message:"Learning assessment created successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }

    async updateassessment(req, res) {

        try{

            const { key } = req.params;

            const postData = req.body;

            const assessment = await AssessmentModel.findById(key);

            if(!assessment){
              return res.status(200).json({ status:false, message:"No assessment found." });
            }

            if(postData.thumbnail && assessment.thumbnail){
              try{
                await unlink('uploads/lms/assessment/'+assessment.thumbnail);
              }catch(e){
                console.log(e.message);
              }
            }

            const update = await AssessmentModel.findOneAndUpdate(
              {_id: key},
              {$set: postData},
              {new: true}
            );

            return res.status(200).json({status:true, data:update, message:"Learning assessment updated successfully."});

        }catch(err){

            return res.status(200).json({status:false, message:err.message });
        }
    }

    async deleteassessment(req, res) {

        try {

            const { key } = req.params;

            const assessment = await AssessmentModel.findById(key);

            if(!assessment){
              return res.status(200).json({ status:false, message:"No assessment found." });
            }

            if(assessment.thumbnail){
                try{
                    await unlink('uploads/lms/assessment/'+assessment.thumbnail);
                }catch(e){
                    console.log(e.message);
                }
            }

            await AssessmentModel.findOneAndDelete({ _id: key });

            return res.status(200).json({status:true, message:"Learning assessment deleted successfully."});

        } catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }

    }


    /** Revies */
    async updatereview(req, res) {
        try{

            const { key } = req.params;

            const postData = req.body;

            const update = await ReviewModel.findOneAndUpdate(
              {_id: key},
              {$set: postData},
              {new: true}
            );

            return res.status(200).json({status:true, data:update, message:"Status changed successfully."});

        }catch(err){

            return res.status(200).json({status:false, message:err.message });
        }
    }

    async getreviews(req, res) {

        try {

            const reviews = await ReviewModel.find({})
            .sort({ createdAt: -1})
            .populate({
                path: 'path_id',
                match: { _id: { $ne: null } },
                select: 'title'
            })
            .populate({
                path: 'user_id',
                match: { _id: { $ne: null } },
                select: 'first_name last_name',
            });

            const getReviews = async () => {

                const defaultValues = [];
                let idx = 1;
                for (const review of reviews) {

                    defaultValues.push({
                        s_no: idx,
                        id: review._id,
                        path: (review?.path_id?.title||''),
                        name: (review?.user_id?`${review.user_id.first_name} ${review.user_id.last_name}`:''),
                        rating: review.rating,
                        review: review.review,
                        status: review.status,
                        created: new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                    });
                    idx++;
                }

                return defaultValues;
            };

            getReviews().then(defaultValues => {
                // You can use defaultValues here if needed
                return res.status(200).json({status: true, data: defaultValues });
            });


        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }

}

module.exports = LMS