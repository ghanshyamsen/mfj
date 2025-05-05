
const mongoose = require('mongoose');

const SkillModel = require("../../models/lmsskill");
const LearningPathModel = require("../../models/learningpath");
const PurchaseModules = require("../../models/purchasemodules");
const MaterialModel = require("../../models/learningmaterial");
const AssessmentModel = require("../../models/learningassessment");
const CompletedModel = require("../../models/completedchapters");
const LevelModel = require("../../models/levels");
const UserModel = require("../../models/user");
const GoalModel = require("../../models/goals");
const RankModel = require("../../models/ranks");
const ReviewModel = require("../../models/lmsreview");
const PlanModel = require("../../models/plans");
const AppliedJob = require("../../models/jobapplied");



const { unlink } = require('node:fs/promises');
const fs = require('fs');

class Learning {

    async getplans(req, res){

        try {

            const userId = req.user.userId;

            const user = await UserModel.findById(userId).select('purchased_plan');

            const { keys } = req.query;
            const find = keys
            ? {
                $and: [
                  { plan_key: { $nin: user?.purchased_plan || [] } },  // Check if the plan_key is not in the purchased_plan
                  { plan_key: { $in: keys.split(',') } }  // Check if the plan_key is in the provided keys
                ]
              }
            : {};
            const getplans = await PlanModel.find(find,'plan_key plan_name plan_title plan_price plan_price_text plan_description');

            return res.status(200).json({status:true, data:getplans });

        } catch (error) {
            return res.status(200).json({status:false, message:err.message });
        }
    }

    async getlevels(req, res) {

        try {

            const userId = req.user.userId;

            const { level } = req.query;

            /* const getLevels = async () => {

                try {

                    var find = {};

                    if(level){
                        find = {...find, order:level}
                    }

                  const query = LevelModel.find(find, 'name price title description order')
                    .sort({ order: 1 })
                    .populate({
                        path: 'paths',
                        match: { status: true },
                        select: 'title thumbnail skills',
                        populate: {
                            path: 'skills',
                            select: 'title thumbnail skill_badge credit_price',
                        },
                    });


                    const levels = await query;

                  const mediaUrl = process.env.MEDIA_URL || '';

                  const result = [];

                  for (const level of levels) {
                    const levelObj = level.toObject(); // prevent mutating mongoose doc

                    if (levelObj.paths) {

                        const ratingStats = await ReviewModel.aggregate([
                            {
                                $match: {
                                    path_id : { $in : levelObj.paths?.map(value => value._id) },               // Filter by the specific path ID
                                    rating: { $gt: 0, $lte: 5 }  // Ensure ratings are within valid range
                                }
                            },
                            {
                                $group: {
                                _id: null,
                                    avgRating: { $avg: "$rating" }, // Calculate the average rating
                                    totalRatings: { $sum: 1 }       // Count the total number of ratings
                                }
                            }
                        ]);

                        levelObj.avgRating = ratingStats[0] ? ratingStats[0].avgRating : 0;
                        levelObj.totalRatings = ratingStats[0] ? ratingStats[0].totalRatings : 0;

                        for (const path of levelObj.paths) {

                            if (path.thumbnail && !path.thumbnail.startsWith('http')) {
                                path.thumbnail = `${mediaUrl}lms/path/${path.thumbnail}`;
                            }

                            if (path.skills) {
                                for (const skill of path.skills) {

                                    // Fetch additional related data
                                    const relatedPaths = await LearningPathModel.find(
                                        { status: true, skills: skill._id },
                                        'title'
                                    ).lean();

                                    const material = await MaterialModel.countDocuments({ skill: skill._id, status: true });

                                    const purchased = await PurchaseModules.countDocuments({skill: skill._id, user: userId});

                                    if (skill.thumbnail && !skill.thumbnail.startsWith('http')) {
                                        skill.thumbnail = `${mediaUrl}lms/skills/${skill.thumbnail}`;
                                        skill.skill_badge = `${mediaUrl}lms/skills/${skill.skill_badge}`;
                                    }

                                    skill.credit_price = skill.credit_price?.toLocaleString('en') || '0';

                                    // Attach fetched data
                                    skill.linkPaths = relatedPaths;
                                    skill.material = material;
                                    skill.purchased = purchased;

                                }
                            }
                        }

                    }

                    result.push(levelObj);
                  }

                  return result;
                } catch (error) {
                  console.error('Error fetching levels:', error);
                  throw error;
                }
            }; */

            const getLevels = async () => {

                try {

                    let find = {};

                    if (level) {
                        find = { ...find, order: level };
                    }

                    const query = LevelModel.find(find, 'name price title description order')
                        .sort({ order: 1 })
                        .populate({
                            path: 'paths',
                            match: { status: true },
                            select: 'title logo skills order',
                            populate: {
                                path: 'skills',
                                select: 'title skill_logo skill_badge credit_price order',
                            },
                        });

                    const levels = await query;
                    const mediaUrl = process.env.MEDIA_URL || '';

                    // Collect all path IDs to fetch ratings in bulk
                    const allPathIds = levels.flatMap(level => level.paths.map(path => path._id));

                    // Fetch ratings data for all paths in bulk
                    const ratingsData = await ReviewModel.aggregate([
                        {
                            $match: {
                                $and: [
                                  {
                                    $or: [
                                      { status: true },
                                      { status: "true" },     // handles string
                                      { status: 1 }           // handles number (if used)
                                    ]
                                  },
                                  {
                                    path_id: { $in: allPathIds },
                                    rating: { $gt: 0, $lte: 5 }
                                  }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: "$path_id",
                                avgRating: { $avg: "$rating" },
                                totalRatings: { $sum: 1 },
                            }
                        }
                    ]);

                    // Create a lookup for the ratings data
                    const ratingsLookup = ratingsData.reduce((acc, data) => {
                        acc[data._id] = { avgRating: data.avgRating, totalRatings: data.totalRatings };
                        return acc;
                    }, {});

                    const result = [];
                    var lastPurchased = null;
                    var lastPurchasedSkill = null;
                    for (const level of levels) {

                        const levelObj = level.toObject(); // prevent mutating mongoose doc

                        const purLev = await PurchaseModules.countDocuments({ level: levelObj._id, user: userId });

                        levelObj.purchased = (purLev > 0?true:false);

                        const lastPurchasedCount = await PurchaseModules.countDocuments({ level: (lastPurchased||levelObj._id), user: userId });
                        lastPurchased = levelObj._id;

                        levelObj.locked = levelObj.order!==1 && lastPurchasedCount <= 0?true:false;

                        let totalAvgRating = 0; // Sum of average ratings for all paths
                        let totalRating = 0;
                        let pathCount = 0;      // Total number of paths in the level

                        if (levelObj.paths) {

                            for (const path of levelObj.paths) {

                                if (path.logo && !path.logo.startsWith('http')) {
                                    path.logo = `${mediaUrl}lms/path/${path.logo}`;
                                }

                                // Attach ratings data
                                const pathRatings = ratingsLookup[path._id] || { avgRating: 0, totalRatings: 0 };
                                path.avgRating = pathRatings.avgRating;
                                path.totalRatings = pathRatings.totalRatings;

                                // Sum the average ratings of all paths
                                totalAvgRating += pathRatings.avgRating;
                                totalRating += pathRatings.totalRatings;
                                if(pathRatings.totalRatings > 0){
                                    pathCount++; // Count the path
                                }

                                // Process each skill in parallel
                                for (const skill of path.skills) {
                                    const [materialCount, purchasedCount, lastPurchasedSkillCount] = await Promise.all([
                                        MaterialModel.countDocuments({ skill: skill._id, status: true }),
                                        PurchaseModules.countDocuments({ skill: skill._id, user: userId }),
                                        PurchaseModules.countDocuments({ skill: (lastPurchasedSkill || skill._id), user: userId })
                                    ]);

                                    lastPurchasedSkill = skill._id;

                                    if (skill.skill_logo && !skill.skill_logo.startsWith('http')) {
                                        skill.skill_logo = `${mediaUrl}lms/skills/${skill.skill_logo}`;
                                        skill.skill_badge = `${mediaUrl}lms/skills/${skill.skill_badge}`;
                                    }

                                    skill.credit_price = skill.credit_price?.toLocaleString('en') || '0';
                                    skill.material = materialCount;
                                    skill.purchased = purchasedCount > 0;
                                    skill.locked = skill.order !== 1 && lastPurchasedSkillCount <= 0;
                                }
                            }
                        }

                        // Calculate combined average rating for the level (Sum of avgRatings / Total paths)
                        levelObj.avgRating = pathCount > 0
                        ? totalAvgRating / pathCount
                        : 0; // Avoid division by zero

                        levelObj.totalRatings = totalRating;

                        result.push(levelObj);
                    }

                    return result;

                } catch (error) {
                    console.error('Error fetching levels:', error);
                    throw error;
                }
            };

            getLevels().then(defaultValues => {
                // You can use defaultValues here if needed
                return res.status(200).json({status: true, data: defaultValues });
            });

        } catch (error) {
            return res.status(200).json({status:false, message:err.message });
        }

    }

    async getskill(req, res) {

        try{
            const userId = req.user.userId;

            const { key } = req.params;
            const { limit, offset, page } = req.query;

            if(key){

                if(page && page!== 'detail'){

                    const GetUser = await UserModel.findOne({_id:userId},'purchased_skills purchased_path');

                    const getPath = await PurchaseModules.findOne(
                        {
                            path: { $in: GetUser.purchased_path }, // Ensure path is in the purchased paths
                            user: userId
                        }
                    ).populate({
                        path: 'path', // Populate the `path` field
                        match: { skills: key }, // Check if `skills` contains the key
                        select: 'title skills', // Return only the title and skills fields
                    });

                    const getSkill = await PurchaseModules.findOne(
                        {
                        skill: key,
                        user: userId,
                        type: 'skill'
                        },
                        'type'
                    );

                    if(!GetUser.purchased_skills.includes(key) && !getPath && !getSkill){
                        return res.status(200).json({status:false, message: "You don't have access to this module." });
                    }
                }

                const get = await SkillModel.findOne({_id:key,status:true});

                if(get){

                    const material = await MaterialModel.find({skill: get._id,status:true},'title brief_description thumbnail').sort({order: 1});

                    const assessments = await AssessmentModel.find({skill: get._id,status:true},'title brief_description thumbnail');

                    const completed =  await CompletedModel.find({skill: get._id, user: userId});



                    return res.status(200).json({
                        status: true,
                        data: get,
                        material: material,
                        assessments:assessments,
                        completed: completed,
                        thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                        assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                        skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                        chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                        media_url: `${process.env.MEDIA_URL}`
                    });

                }else{
                    return res.status(200).json({status:false, message: 'Invalid skill request!!' });
                }

            }else{

                const getSkills = async () => {

                    const query = SkillModel.find({status:true}, 'title credit_price skill_logo thumbnail');

                    if(limit){
                        query.limit(limit);
                    }

                    if(offset){
                        query.skip(offset);
                    }

                    const skills = await query;

                    const defaultValues = [];
                    let idx = 1;
                    for (const skill of skills) {

                        const paths = await LearningPathModel.find({status:true, skills: skill._id},'title');

                        const material = await MaterialModel.findOne(
                            { skill:skill._id, status: true }
                        );

                        if(material){
                            defaultValues.push({
                                s_no: idx,
                                id: skill._id,
                                title: skill.title,
                                credit_price: skill.credit_price.toLocaleString('en'),
                                thumbnail: `${process.env.MEDIA_URL}lms/skills/${skill.skill_logo}`,
                                paths: paths
                            });

                            idx++;
                        }
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

    /** Learning Path */
    async getpath(req, res) {

        try{

            const { key } = req.params;
            const { limit, offset } = req.query;

            if(key){

                const get = await LearningPathModel.findOne({_id:key,status:true}).populate('skills','title skill_badge credit_price');

                if(get){
                    return res.status(200).json({
                        status: true,
                        data: get,
                        thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                        assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                        skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                        chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                        media_url: `${process.env.MEDIA_URL}`
                    });
                }else{
                    return res.status(200).json({status:false, message: 'Invalid path request!!' });
                }

            }else{

                const getPath = async () => {

                    const query =  LearningPathModel.find({status:true}, 'title credit_price skills badge');

                    if(limit){
                        query.limit(limit);
                    }

                    if(offset){
                        query.skip(offset);
                    }


                    const paths = await query;

                    const defaultValues = [];
                    let idx = 1;
                    for (const path of paths) {

                       /*  const ratingStats = await PurchaseModules.aggregate([
                            {
                                $match: {
                                    path_id: {$in:[path._id]}
                                    rating: { $gt: 0, $lte: 5 }
                                }
                            },
                            {
                              $group: {
                                _id: null,
                                avgRating: { $avg: "$rating" }, // Calculate the average rating
                                totalRatings: { $sum: 1 }       // Count the total number of ratings
                              }
                            }
                        ]); */

                        const ratingStats = await ReviewModel.aggregate([
                            {
                                $match: {
                                    $and: [
                                      {
                                        $or: [
                                          { status: true },
                                          { status: "true" },     // handles string
                                          { status: 1 }           // handles number (if used)
                                        ]
                                      },
                                      {
                                        path_id: { $in: [path._id] },
                                        rating: { $gt: 0, $lte: 5 }
                                      }
                                    ]
                                }
                            },
                            {
                                $group: {
                                    _id: "$path_id",
                                    avgRating: { $avg: "$rating" },
                                    totalRatings: { $sum: 1 },
                                }
                            }
                        ]);

                        const avgRating = ratingStats[0] ? ratingStats[0].avgRating : 0;
                        const totalRatings = ratingStats[0] ? ratingStats[0].totalRatings : 0;

                        defaultValues.push({
                            s_no: idx,
                            id: path._id,
                            title: path.title,
                            skills: path.skills.length,
                            thumbnail: `${process.env.MEDIA_URL}lms/path/${path.badge}`,
                            credit_price: path.credit_price.toLocaleString('en'),
                            avg_rating:avgRating,
                            total_ratings: totalRatings
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

    async mylearning(req, res) {

        try {

            const { type, limit, offset, user } = req.query;
            const userId = user?user:req.user.userId;

            let find = { type:type, user:userId  };

            //await removeExpirations(find, userId);

            // Initialize the query with the `find` object
            const query = PurchaseModules.find(find);

            // Populate based on type
            if (type === 'path') {
                query.populate({
                    path: 'path',
                    select: 'title badge',
                    populate: {
                        path: 'skills',
                        select: 'title skill_badge'
                    } // Nested population for `skills` inside `path`
                });
            } else {
                query.populate({
                    path: 'skill',
                    select: 'title skill_badge skill_logo'
                });
            }

            // Apply limit and offset if provided
            if (limit) {
                query.limit(parseInt(limit));
            }

            if (offset) {
                query.skip(parseInt(offset));
            }

            // Execute the query
            let get = await query.exec();

            // If type is 'skill', find paths associated with each skill
            const skillPathsMap = {};

            if (type === 'skill') {
                // Create a map to store skills with their associated paths

                // Loop through each document to get skill IDs
                for (const doc of get) {
                    const skillId = doc.skill?._id;

                    if (skillId && !skillPathsMap[skillId]) {
                        // Find all paths containing this skill
                        const paths = await LearningPathModel.find({ skills: skillId },'title');
                        skillPathsMap[skillId] = paths; // Store paths for this skill in the map
                    }
                }

                // Attach paths to each document in `get` based on skill ID
                get = get.map(doc => {
                    if (doc.skill && skillPathsMap[doc.skill._id]) {
                        // Ensure to convert skill to plain object and attach paths
                        const updatedSkill = {
                            ...doc.skill.toObject(),  // Convert to plain object
                            path: skillPathsMap[doc.skill._id]  // Attach paths to skill
                        };
                        return { ...doc.toObject(), skill: updatedSkill };  // Return a new document with the updated skill
                    }
                    return doc;  // Return unchanged document
                });

            }else{

                // Loop through each document in `get`
                for (const doc of get) {
                    if (doc.path && doc.path.skills) {

                        const getLevel = await LevelModel.findOne({paths:doc.path._id},'name');

                        doc.path._doc.level = getLevel?.name || '';

                        for (const skill of doc.path.skills) {

                            /* const checkSkill = await PurchaseModules.findOne({type: 'skill', user:userId, skill:skill._id, completed:true});
                            const checkInternal = await PurchaseModules.findOne({type: 'internal', user:userId, skill:skill._id});

                            if((checkSkill && !checkInternal)){
                                await PurchaseModules.create({
                                    skill: skill._id,
                                    user:userId,
                                    type:'internal',
                                    completed_chapters: checkSkill?.completed_chapters,
                                    total_chapters_count: checkSkill?.total_chapters_count,
                                    completed_count: checkSkill?.completed_count,
                                    completed: checkSkill.completed
                                });
                            }

                            if((!checkSkill && !checkInternal)){
                                await PurchaseModules.create({
                                    skill: skill._id,
                                    user:userId,
                                    type:'internal',
                                    completed_chapters: [],
                                    total_chapters_count: 0,
                                    completed_count: 0,
                                    completed: false
                                });
                            } */

                            const internalDocuments = await PurchaseModules.find(
                                { type: 'skill', skill: skill._id, user:userId },
                                'completed'
                            ).exec();

                            // Modify the skill document directly
                            skill._doc.completed = internalDocuments.some(doc => doc.completed);
                        }
                    }
                }
            }

            return res.status(200).json({
                status: true,
                data: get,
                thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                media_url: `${process.env.MEDIA_URL}`
            });

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }
    }

    async pathreview(req, res){

        try {

            const { key } = req.params;
            const { rating, review } = req.body;

            const mypath = await PurchaseModules.findById(key);

            if(mypath){

                const userId = req.user.userId;

                if(rating < 1 || rating > 5){
                    return res.status(200).json({ status: false, message: 'Rating must be greater than 0 and less than 5.' });
                }

                await PurchaseModules.findOneAndUpdate(
                    {_id:mypath._id},
                    {$set: { rating: rating }},
                    {new: true}
                );

                await ReviewModel.create({
                    path_id: mypath.path,
                    user_id: userId,
                    rating: rating,
                    review: review
                });

                return res.status(200).json({ status: true, message: 'Rating submitted successfully.' });

            }else{
                return res.status(200).json({ status: false, message: 'Invalid path request!!' });
            }

        } catch (error) {
            return res.status(200).json({ status: false, message: error.message });
        }

    }

    async getmaterial(req, res) {

        try {
            const userId = req.user.userId;

            const { key } = req.params;

            const material = await MaterialModel.findOne(
                { _id: key, status: true }
            ).populate({
                path: 'skill',
                match: { status: true },
                select: 'title status' // Fetch only the 'title' and 'status' fields
            });

            if(!material){
                return res.status(200).json({status:false, message: 'Invalid skill learning request!!' });
            }

            const GetUser = await UserModel.findOne({_id:userId},'purchased_skills purchased_path');

            const getPath = await PurchaseModules.findOne(
                {
                  path: { $in: GetUser.purchased_path }, // Ensure path is in the purchased paths
                  user: userId
                }
            ).populate({
                path: 'path', // Populate the `path` field
                match: { skills: material.skill._id }, // Check if `skills` contains the key
                select: 'title skills', // Return only the title and skills fields
            });

            const getSkill = await PurchaseModules.findOne(
                {
                  skill: material.skill._id,
                  user: userId,
                  type: 'skill'
                },
                'type'
            );

            if(!GetUser.purchased_skills.includes(key) && !getPath && !getSkill){
                return res.status(200).json({status:false, message: "You don't have access to this module." });
            }

            const other_material = await MaterialModel.find({skill: material.skill._id},'title').sort({order: 1});
            const other_assessments = await AssessmentModel.find({skill: material.skill._id},'title');


            const completed =  await CompletedModel.findOne({chapter: material._id, user: userId});

            return res.status(200).json({
                status: true,
                data: material,
                other:other_material,
                other_assessments:
                other_assessments,
                completed:(completed?._id?true:false),
                thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                media_url: `${process.env.MEDIA_URL}`
            });

        } catch (error) {
            return res.status(200).json({status:false, message:error.message });
        }

    }

    async getassessment(req, res){

        try {
            const userId = req.user.userId;

            const { key } = req.params;

            const material = await AssessmentModel.findOne(
                { _id: key, status: true },
                'title brief_description description thumbnail questions.question questions.options'
            ).populate({
                path: 'skill',
                match: { status: true },
                select: 'title status' // Fetch only the 'title' and 'status' fields
            });

            if(!material){
                return res.status(200).json({status:false, message: 'Invalid assessment learning request!!' });
            }

            const GetUser = await UserModel.findOne({_id:userId},'purchased_skills purchased_path');

            const getPath = await PurchaseModules.findOne(
                {
                  path: { $in: GetUser.purchased_path }, // Ensure path is in the purchased paths
                  user: userId
                }
            ).populate({
                path: 'path', // Populate the `path` field
                match: { skills: material.skill._id }, // Check if `skills` contains the key
                select: 'title skills', // Return only the title and skills fields
            });

            const getSkill = await PurchaseModules.findOne(
                {
                  skill: material.skill._id,
                  user: userId,
                  type: 'skill'
                },
                'type'
            );

            if(!GetUser.purchased_skills.includes(material.skill._id) && !getPath && !getSkill){
                return res.status(200).json({status:false, message: "You don't have access to this module." });
            }

            const other_material = await MaterialModel.find({skill: material.skill._id},'title').sort({order: 1});
            const other_assessments = await AssessmentModel.find({skill: material.skill._id},'title');

            const completed =  await CompletedModel.findOne({assessment: material._id, user: userId});

            return res.status(200).json({
                status: true,
                data: material,
                other:other_material,
                other_assessments:other_assessments,
                completed:completed,
                thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                media_url: `${process.env.MEDIA_URL}`
            });

        } catch (error) {
            return res.status(200).json({status:false, message:error.message });
        }
    }

    async getresult(req, res) {

        try{

            const { key } = req.params;



        }catch (error) {
            return res.status(200).json({status:false, message:error.message});
        }
    }

    async completedchapter(req, res) {

        try {

            const userId = req.user.userId;

            const PostData = req.body;

            PostData.user = userId;

            const find = PostData.type === 'assessment'?{assessment: PostData.assessment, user: userId}:{chapter: PostData.chapter, user: userId};

            const completedM =  await CompletedModel.findOne(find);

            PostData.assessment_completed = true;

            if(PostData.type === 'assessment'){
                const postAnswer =  PostData?.assessment_answer;
                let getassessment = await AssessmentModel.findById(PostData.assessment);
                let assessment_completed = true;
                getassessment?.questions.map((question, index) => {
                    if(!postAnswer?.[index] || postAnswer?.[index]?.answer?.toLowerCase() !== question.answer?.toLowerCase()){
                        assessment_completed = false;
                    }
                })

                PostData.assessment_completed = assessment_completed;
            }

            const isSaved = completedM?
            await CompletedModel.findOneAndUpdate(
                {_id: completedM._id},
                {$set: PostData},
                {new: true}
            )
            : await CompletedModel.create(PostData);

            if(isSaved){

                const material_count = await MaterialModel.countDocuments({skill: isSaved.skill});
                const assessment_count = await AssessmentModel.countDocuments({skill: isSaved.skill});
                const completedDocs = await CompletedModel.find({ skill: isSaved.skill, user: userId, assessment_completed: true }).select('_id');
                const completedIds = completedDocs.map(doc => doc._id);
                const completed_count =  completedIds.length;

                const checkpurchased = await PurchaseModules.findOne({user:userId, skill:isSaved.skill});
                let totalChpAss = parseInt(material_count) + parseInt(assessment_count);

                let completed = ((totalChpAss === completed_count)?true:false);

                if(checkpurchased){
                    const updated = await PurchaseModules.updateMany(
                        { user: userId, skill: isSaved.skill }, // Match multiple documents
                        {
                            $set: {
                                completed_chapters: completedIds,
                                total_chapters_count: totalChpAss,
                                completed_count: completed_count,
                                completed: completed
                            }
                        },
                        { new: true } // Option does not apply to `updateMany`, use a separate query to fetch the updated documents if needed
                    );
                }

                /* else{
                    await PurchaseModules.create({
                        skill: isSaved.skill,
                        user:userId,
                        type:'internal',
                        completed_chapters: completedIds,
                        total_chapters_count: totalChpAss,
                        completed_count: completed_count,
                        completed: completed
                    });
                } */


                if(completed){

                    const respSkill = await PurchaseModules.aggregate([
                        {
                          $match: {
                            user: new mongoose.Types.ObjectId(userId), // Filter by the specific user
                            type: { $in: ["skill", "internal"] }, // Only include "skill" and "internal" types
                            completed: true, // Only include completed documents
                          },
                        },
                        {
                          $group: {
                            _id: "$skill", // Group by the skill field
                          },
                        },
                        {
                          $count: "uniqueSkillCount", // Count the number of unique skills
                        },
                    ]);


                    const completedSkillCount = respSkill.length > 0 ? respSkill[0].uniqueSkillCount : 0;
                    const completedPathCount = await PurchaseModules.countDocuments({user:userId, type:'path', completed:true});

                    // Assign rank based on completed skills and paths
                    const getRank = await RankModel.findOne({
                        skill_count: { $lte: completedSkillCount },
                        path_count: { $lte: completedPathCount }
                    }).sort({ skill_count: -1, path_count: -1 }); // Sort to get the best rank


                    if(getRank){
                        await UserModel.findOneAndUpdate(
                            {_id: userId},
                            {$set: {rank:(getRank?._id||null)}},
                            {new: true}
                        )
                    }

                    const getPath = await PurchaseModules.find({
                        type: 'path',
                        path: { $ne: null },
                        user: userId
                    }).populate({
                        path: 'path', // Populate the `path` field
                        match: { skills: isSaved.skill }, // Check if `skills` contains the key
                        select: 'title skills', // Return only the title and skills fields,
                    });

                    if(getPath.length > 0){

                        for(const value of getPath){

                            if(value.path?.skills){

                                const internalDocuments = await PurchaseModules.countDocuments({
                                    type: {$in:['internal','skill']},
                                    skill: {$in: value.path.skills },
                                    user:userId,
                                    completed:false
                                });


                                value.completed = ((!internalDocuments)?true:false);
                                await value.save();
                            }
                        }
                    }

                    const getlevels = await PurchaseModules.find({user:userId,type:"level"}).populate('level','name paths');

                    if(getlevels.length > 0){
                        for(const value of getlevels){

                            const cpCount = await PurchaseModules.countDocuments({
                                type: "path",
                                skill: {$in: value.level.paths },
                                user:userId,
                                completed:false
                            });

                            value.completed = ((!cpCount)?true:false);
                            await value.save();

                            if(value.completed){
                                await UserModel.updateOne(
                                    {_id: userId},
                                    {$set: {current_level:value.level._id}},
                                    {new: true}
                                );
                            }
                        }
                    }

                }

                return res.status(200).json({
                    status: true,
                    data: isSaved,
                    completed:completed,
                    thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                    assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                    skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                    chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                    media_url: `${process.env.MEDIA_URL}`
                });
            }else{
                return res.status(200).json({status: false, message:"Something went wrong." });
            }



            if(!completed || (completed && PostData.type === 'assessment')){
            }else{
                return res.status(200).json({status: false, message:"This chapter already completed." });
            }

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }

    async result(req, res){
        try {

            const userId = req.user.userId;
            const { key:Id } = req.params;


            const result  = await PurchaseModules.aggregate([
                { $match: { type: 'path', user: new mongoose.Types.ObjectId(userId) } },
                {
                  $lookup: {
                    from: 'learningpaths', // Replace with the actual collection name for `path`
                    localField: 'path',
                    foreignField: '_id',
                    as: 'path',
                  },
                },
                { $unwind: { path: '$path', preserveNullAndEmptyArrays: true } },
                { $match: { 'path.skills': new mongoose.Types.ObjectId(Id) } },
                {
                  $lookup: {
                    from: 'lmsskills', // Replace with the actual collection name for `skills`
                    localField: 'path.skills',
                    foreignField: '_id',
                    as: 'skills',
                  },
                },
                {
                  $project: {
                    type: 1,
                    user: 1,
                    expiration_period:1,
                    createdAt:1,
                    completed:1,
                    'path.title': 1,
                    'path.badge': 1,
                    'path._id': 1,
                    'skills.title': 1,
                    'skills.skill_badge': 1,
                    'skills._id': 1,
                  },
                },
            ]);
            // Extract the single object
            const getPath = result[0] || null;

            const getSkill = await PurchaseModules.findOne({
                skill: Id,
                user: userId,
                type: 'skill'
            }).populate('skill', 'title skill_badge skill_logo')

            if(getPath){

                if (getPath && getPath.path && Array.isArray(getPath.skills)) {

                    const getLevel = await LevelModel.findOne({paths:getPath.path._id},'name');

                    getPath.path.level = getLevel?.name || '';

                    // Iterate through the skills
                    for (const skill of getPath.skills) {

                        // Fetch `checkSkill` and `checkInternal`
                        /* const checkSkill = await PurchaseModules.findOne({
                            type: 'skill',
                            user: userId,
                            skill: skill._id,
                            completed: true,
                        });

                        const checkInternal = await PurchaseModules.findOne({
                            type: 'internal',
                            user: userId,
                            skill: skill._id,
                        });

                        // Create an 'internal' PurchaseModule if conditions are met
                        if (checkSkill && !checkInternal) {
                            await PurchaseModules.create({
                                skill: skill._id,
                                user: userId,
                                type: 'internal',
                                completed_chapters: checkSkill?.completed_chapters,
                                total_chapters_count: checkSkill?.total_chapters_count,
                                completed_count: checkSkill?.completed_count,
                                completed: checkSkill.completed,
                            });
                        } */

                        // Check for internal documents related to this skill
                        const internalDocuments = await PurchaseModules.find(
                            { type: 'skill', skill: skill._id, user: userId },
                            'completed'
                        ).exec();

                        // Update the skill with `completed` status
                        skill.completed = internalDocuments.some((doc) => doc.completed);
                    }

                    getPath.path.skills = getPath.skills;
                }

                return res.status(200).json({status: true, data:getPath,  type: "path",

                    thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                    assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                    skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                    chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                    media_url: `${process.env.MEDIA_URL}`
                });
            }else{

                if(getSkill){
                    return res.status(200).json({status: true, data:getSkill, type: "skill",

                        thumbnail_path: `${process.env.MEDIA_URL}lms/path/`,
                        assessment_path: `${process.env.MEDIA_URL}lms/assessment/`,
                        skill_path: `${process.env.MEDIA_URL}lms/skills/`,
                        chapter_path: `${process.env.MEDIA_URL}lms/material/`,
                        media_url: `${process.env.MEDIA_URL}`

                    });
                }else{
                    return res.status(200).json({status: false, message: "Invalid request."});
                }
            }

        } catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }
    }

    async checkpurchased(req, res){

        try {

            const userId = req.user.userId;

            const { type, key:Id } = req.params;
            let purchased = false;

            if(type === 'path'){

                const getPath = await PurchaseModules.findOne({
                    type: 'path',
                    path: Id,
                    user: userId
                });

                if((getPath && getPath.path)){
                    purchased = true;
                }

            }else if(type === 'skill'){

                const result  = await PurchaseModules.aggregate([
                    { $match: { type: 'path', user: new mongoose.Types.ObjectId(userId) } },
                    {
                      $lookup: {
                        from: 'learningpaths', // Replace with the actual collection name for `path`
                        localField: 'path',
                        foreignField: '_id',
                        as: 'path',
                      },
                    },
                    { $unwind: { path: '$path', preserveNullAndEmptyArrays: true } },
                    { $match: { 'path.skills': new mongoose.Types.ObjectId(Id) } },
                    {
                      $lookup: {
                        from: 'lmsskills', // Replace with the actual collection name for `skills`
                        localField: 'path.skills',
                        foreignField: '_id',
                        as: 'skills',
                      },
                    },
                    {
                      $project: {
                        type: 1,
                        user: 1,
                        'path.title': 1,
                        'path.badge': 1,
                        'path._id': 1,
                        'skills.title': 1,
                        'skills.skill_badge': 1,
                        'skills._id': 1,
                      },
                    },
                ]);

                console.log(result);
                // Extract the single object
                const getPath = result[0] || null;

                const getSkill = await PurchaseModules.countDocuments({
                    skill: Id,
                    user: userId,
                    type: { $in:['skill','internal']}
                });

                if(getPath || getSkill){
                    purchased = true;
                }
            }else if(type === 'level'){

            }

            return res.status(200).json({status: true, purchased:purchased});

        } catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }

    }

    async getgolas(req, res){

        try {

            const userId = req.user.userId;

            const getgolas = await GoalModel.find({teenager:userId, completed:false})
            .populate('reward_path','title')
            .populate('reward_skill','title')
            .populate('reward_level','name')
            .populate('reward_product','title image');


            return res.status(200).json({status: true, data:getgolas, path:`${process.env.MEDIA_URL}product/` });

        }catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }
    }

    async getleaderboard(req, res){

        try{

            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Start of the current month
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); // End of the current month

            const result = await PurchaseModules.aggregate([
                {
                  $match: {
                    completed: true, // Only include completed modules
                    type: { $in: ["internal", "path", "skill"] }, // Filter for specific types
                    updatedAt: {
                      $gte: startOfMonth, // Filter for updatedAt within the current month
                      $lte: endOfMonth,
                    },
                  },
                },
                {
                  $group: {
                    _id: "$user", // Group by user
                    uniqueSkills: {
                      $addToSet: {
                        $cond: [
                          { $in: ["$type", ["internal", "skill"]] }, // Only include "internal" or "skill" types
                          "$skill", // Collect unique skill keys
                          null, // Exclude others
                        ],
                      },
                    },
                    pathCount: {
                      $sum: {
                        $cond: [{ $eq: ["$type", "path"] }, 1, 0], // Count paths
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    skillCount: {
                      $size: {
                        $filter: {
                          input: "$uniqueSkills", // Process uniqueSkills array
                          as: "skill",
                          cond: { $ne: ["$$skill", null] }, // Exclude null values
                        },
                      },
                    },
                  },
                },
                {
                  $lookup: {
                    from: "users", // Join with the users collection
                    localField: "_id", // Match by user ID
                    foreignField: "_id",
                    as: "userInfo",
                  },
                },
                {
                  $unwind: {
                    path: "$userInfo", // Unwind the userInfo array
                    preserveNullAndEmptyArrays: true, // Keep documents even if userInfo is missing
                  },
                },
                {
                  $lookup: {
                    from: "ranks", // Join with the ranks collection
                    localField: "userInfo.rank", // Match by rank ID
                    foreignField: "_id",
                    as: "rankInfo",
                  },
                },
                {
                  $unwind: {
                    path: "$rankInfo", // Unwind the rankInfo array
                    preserveNullAndEmptyArrays: true, // Keep documents even if rankInfo is missing
                  },
                },
                {
                  $project: {
                    _id: 1, // Exclude the _id field
                    user: "$_id", // Rename _id to user
                    skillCount: 1, // Include skillCount
                    pathCount: 1, // Include pathCount
                    createdAt: 1,
                    "userInfo.first_name": 1,
                    "userInfo.last_name": 1,
                    "userInfo.profile_image": {
                      $cond: {
                        if: { $ifNull: ["$userInfo.profile_image", false] }, // If profile image exists
                        then: { $concat: [process.env.MEDIA_URL + "avtar/", "$userInfo.profile_image"] },
                        else: { $concat: [process.env.MEDIA_URL + "avtar/", "default-user.png"] },
                      },
                    },
                    "rankInfo.image": {
                      $cond: {
                        if: { $ifNull: ["$rankInfo.image", false] }, // If rank image exists
                        then: { $concat: [process.env.MEDIA_URL + "rank/", "$rankInfo.image"] },
                        else: "",
                      },
                    },
                  },
                },
                {
                    $sort: {
                        skillCount: -1,   // Primary sort by skillCount (descending)
                        pathCount: -1,    // Secondary sort by pathCount (descending)
                        createdAt: 1,     // Tertiary sort by createdAt (ascending)
                        _id: 1            // Tie-breaker sort by _id (ascending)
                    },
                },
                {
                  $limit: 10, // Limit to the top 10 results
                },
            ]);


            return res.status(200).json({status: true, data:result});

        }catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }
    }

    async getreviews(req, res) {

        try {

            const { path } = req.query;

            let find = {status: true};

            if(path){
                find = {...find, path_id:path};
            }

            const getReview = await ReviewModel.find(find)
            .limit(10)
            .sort({ createdAt: -1, rating: -1 })
            .populate({
                path: 'path_id',
                match: { _id: { $ne: null } },
                select: 'title'
            })
            .populate({
                path: 'user_id',
                match: { _id: { $ne: null } },
                select: 'first_name last_name profile_image',
            });

            const updatedReviews = getReview.map((review) => {
                if (review.user_id) {
                    const defaultImage = 'default-user.png';
                    const currentImage = review.user_id.profile_image || defaultImage;

                    // Check if `profile_image` already contains the base URL
                    if (!currentImage.startsWith(process.env.MEDIA_URL)) {
                        review.user_id.profile_image = `${process.env.MEDIA_URL}avtar/${currentImage}`;
                    }
                }
                return review;
            });

            return res.status(200).json({status: true, data:updatedReviews});

        } catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }
    }

    async getpurchasedmodule(req, res){
        try {

            const { key } = req.params;

            const getlevels = await PurchaseModules.find({user:key,completed:false,type:"level"}).populate('level','name');
            const getpaths = await PurchaseModules.find({user:key,completed:false,type:"path"}).populate('path','title');
            const getskills = await PurchaseModules.find({user:key,completed:false,type:"skill"}).populate('skill','title');

            const levels = getlevels?.map(value => value.level);
            const paths = getpaths?.map(value => value.path);
            const skills = getskills?.map(value => value.skill);


            const appliedJobCount = await AppliedJob.countDocuments({candidate_id:key});


            return res.status(200).json({status: true, data:{levels, paths, skills, appliedcount:appliedJobCount}});

        } catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }
    }
}

const removeExpirations = async (squery, userId) => {
    // Initialize the query with the `find` object

    const today = new Date();

    const find = {
        ...squery,
        $expr: {
            $lt: [
                { $add: ["$createdAt", { $multiply: ["$expiration_period", 24 * 60 * 60 * 1000] }] },
                today
            ]
        },
        completed:false
    };

    const query = PurchaseModules.find(find,'type skill expiration_period');

    // Populate based on type
    if (squery.type === 'path') {
        query.populate({
            path: 'path',
            select: 'title',
            populate: {
                path: 'skills',
                select: 'title'
            } // Nested population for `skills` inside `path`
        });
    } else {
        query.populate('skill', 'title');
    }

    const  get = await query;

    if(get){

        let pathIds = [];
        let skillIds = [];
        let completedChapterIds = [];

        for (const doc of get) {
            if (squery.type === 'path') {
                if (doc.path?.skills?.length) {
                    // Collect path ID
                    pathIds.push(doc.path._id);

                    // Collect skill IDs
                    const skills = doc.path.skills.map(skill => skill._id);
                    skillIds.push(...skills);

                    // Find PurchaseModules to collect completed chapters
                    const purchaseModules = await PurchaseModules.find({
                        type: 'internal',
                        skill: { $in: skills },
                        user: userId
                    });

                    // Collect related completed_chapters IDs
                    purchaseModules.forEach(module => {
                        if (module.completed_chapters?.length > 0) {
                            completedChapterIds.push(...module?.completed_chapters);
                        }
                    });

                    // Delete related PurchaseModules
                    await PurchaseModules.deleteMany({
                        type: 'internal',
                        skill: { $in: skills },
                        user: userId
                    });
                }
            } else {
                // Collect skill ID
                skillIds.push(doc.skill);

                // Find and collect completed_chapters for standalone skill
                const purchaseModules = await PurchaseModules.find({
                    skill: doc.skill,
                    user: userId
                });

                purchaseModules.forEach(module => {
                    if (module.completed_chapters?.length) {
                        completedChapterIds.push(...module.completed_chapters);
                    }
                });

                // Delete related PurchaseModules
                await PurchaseModules.deleteMany({
                    type: 'internal',
                    skill: doc.skill,
                    user: userId
                });
            }

            // Delete the document
            await doc.deleteOne();
        }

        // Delete related completed_chapters
        if (completedChapterIds.length > 0) {
            await CompletedModel.deleteMany({
                _id: { $in: completedChapterIds }
            });
        }

        // Update the user document to remove pathIds and skillIds
        await UserModel.updateOne(
            { _id: userId },
            {
                $pull: {
                    purchased_path: { $in: pathIds },
                    purchased_skills: { $in: skillIds }
                }
            }
        );
    }
}

const getPurchasedStatus = async (data, order, type) => {

    // Check for 'level' type
    if (type === 'level') {
        // Find the level by order
        const level = data.find(level => level.order === order);
        if (level) {
            return level.purchased || null; // If level exists, return its purchased status (or null if it doesn't exist)
        }
    }

    // Check for 'path' type
    if (type === 'path') {
        // Iterate over levels to find the path by order
        for (const level of data) {
            const path = level.paths.find(path => path.order === order);
            if (path) {
                return path.purchased || null; // If path exists, return its purchased status (or null)
            }
        }
    }

    // Check for 'skill' type
    if (type === 'skill') {

        // Iterate over levels and paths to find the skill by order
        for (const level of data) {
            for (const path of level.paths) {
                const skill = path.skills.find(skill => skill.order === order);
                if (skill) {
                    return skill.purchased || null; // If skill exists, return its purchased status (or null)
                }
            }
        }
    }

    // Return null if no matching order is found for the specified type
    return null;
};


// completed_chapters

module.exports = Learning