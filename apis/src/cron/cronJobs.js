const cron = require("node-cron");
const mongoose = require('mongoose');

const SchedulerModel = require("../models/schedulereminder");
const sendEmail = require("../Mail/emailSender");
const UserModel = require("../models/user");
const PurchaseModules = require("../models/purchasemodules");
const CompletedModel = require("../models/completedchapters");
const GoalModel = require("../models/goals");
const OrderModel = require("../models/rewarsdorder");
const Txn = require("../models/transaction");
const ProductModel = require("../models/products");
const RankModel = require("../models/ranks");
const SkillModel = require("../models/lmsskill");
const LearningPathModel = require("../models/learningpath");
const UpdateRankModel = require("../models/updaterank");
const LevelModel = require("../models/levels");
const Reference = require("../models/references");
const SiteConfig = require("../models/siteconfig");

async function sendReminder() {

    try {
      console.log("sendReminder function is running");
      // Fetch reminders that need to be sent (e.g., scheduled for the current time)
      const now = new Date().toISOString();

      const reminders = await SchedulerModel.find({
        date: { $lte: now }, // Find reminders that are due
        status: false // Optional: Filter reminders by status
      });


      // Check if there are any reminders to send
      if (reminders.length === 0) {
        console.log("No reminders to send at this time.");
        return;
      }

      // Loop through each reminder and send it
      for (const reminder of reminders) {
        // Example: Log the reminder message or send it using an email/SMS service
        //console.log(`Sending reminder to ${reminder.message}`);

        const user = await UserModel.findById(reminder.to).select('first_name last_name email');

        console.log(`Reminder:`, reminder.date);

        if(user){

          await sendNotification({
            from: reminder.from,
            to: reminder.to,
            message: reminder.message
          })

          await sendEmail({
            name: `${user?.first_name} ${user?.last_name}`,
            email: user.email,
            message : `
              ${reminder.message}
              <br />
              <br />
              Please feel free to reach out if any further action is required.
              <br />
              Thank you,
              <br />
              My First Job
            `,
            key: "notification_email",
            subject:"Scheduled Reminder Notification"
          });

        }

        // Mark the reminder as sent
        reminder.status = true;
        reminder.sentAt = new Date();
        await reminder.save();

      }

      console.log("All pending reminders have been sent successfully.");
    } catch (error) {
      console.error("Error sending reminders:", error);
    }
}

async function expiredSkill(){

  try{

    console.log("expiredSkill function is running");


    const today = new Date();

    const find = {
        type:"skill",
        $expr: {
            $lt: [
                { $add: ["$createdAt", { $multiply: ["$expiration_period", 24 * 60 * 60 * 1000] }] },
                today
            ]
        },
        completed:false
    };

    const query = PurchaseModules.find(find).populate('skill', 'title');

    const  get = await query;

    if(get){

      let pathIds = [];
      let skillIds = [];
      let completedChapterIds = [];

      for (const doc of get) {

        let userId = doc.user_id;
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


          // Update the user document to remove pathIds and skillIds
          await UserModel.updateOne(
            { _id: doc.user_id },
            {
              $pull: {
                purchased_skills: doc.skill
              }
            }
          );

        // Delete the document
        await doc.deleteOne();
      }

      // Delete related completed_chapters
      if (completedChapterIds.length > 0) {
        await CompletedModel.deleteMany({
          _id: { $in: completedChapterIds }
        });
      }

    }

  }catch (error) {
    console.log("Error expired Skills:", error.message);
  }

}

async function expiredPath(){

  try{

    console.log("expiredPath function is running");

    const today = new Date();

    const find = {
        type:"path",
        $expr: {
          $lt: [
            { $add: ["$createdAt", { $multiply: ["$expiration_period", 24 * 60 * 60 * 1000] }] },
            today
          ]
        },
        completed:false
    };

    const query = PurchaseModules.find(find).populate({
      path: 'path',
      select: 'title',
      populate: {
          path: 'skills',
          select: 'title'
      } // Nested population for `skills` inside `path`
    });

    const  get = await query;

    if(get){

      let pathIds = [];
      let skillIds = [];
      let completedChapterIds = [];

      for (const doc of get) {

        if (doc.path?.skills?.length) {

          let userId = doc.user_id;

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

          // Update the user document to remove pathIds and skillIds
          await UserModel.updateOne(
            { _id: doc.user_id },
            {
              $pull: {
                purchased_path: doc.path._id,
                purchased_skills: { $in: skills }
              }
            }
          );
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

    }

  }catch (error) {
    console.log("Error expired Skills:", error.message);
  }

}

async function completeGoal() {

  try{

    const getgolas = await GoalModel.find({completed:false});

    for (const goal of getgolas) {

      let pmodule;
      switch (goal.reward_for) {
        case 'path':
          pmodule = await PurchaseModules.findOne({path:goal.reward_path, user: goal.teenager, type:'path'}).populate({
            path: 'path', // Populate the `path` field
            select: 'title skills badge', // Return only the title and skills fields
            populate: {
              path: 'skills',
              select: 'title skill_badge'
            }
          });
        break;

        case 'skill':
          pmodule = await PurchaseModules.findOne({skill:goal.reward_skill, user: goal.teenager, type:'skill'});
        break;

        case 'level':
          pmodule = await LevelModel.findOne({skill:goal.reward_level, user: goal.teenager, type:'level'});
        break;

      }

      if(pmodule && pmodule.completed){

        const parent = await UserModel.findOne({_id:goal.user},'user_credit first_name last_name');
        const teen = await UserModel.findOne({_id:goal.teenager, parents_id:goal.user}, 'user_credit first_name last_name');

        if(goal.reward_type === 'product'){

          const product = await ProductModel.findOne({_id:goal.reward_product, status: true});

          if(product){

            await OrderModel.create({
              product: product._id,
              user:teen._id,
              credit: product.price
            });

            goal.completed = true;
            await goal.save();

          }

        }else{

          await Txn.create({
            user:teen._id,
            description: `Rewarded by parent on completed the goal.`,
            credit: goal.reward_credit,
            type:'credit'
          });

          await UserModel.findOneAndUpdate(
            {_id:teen._id},
            {$set: {user_credit:(parseFloat(teen.user_credit||0) + parseFloat(goal.reward_credit))}},
            {new: true}
          );

          goal.completed = true;
          await goal.save();

        }

      }

    }


  }catch (error) {
    console.log(error.message);
  }
}

async function  rewardCredit(){

  try{

    const filter = {
      completed: true,
      type: { $in: ['path', 'skill']},
      $or: [
        { rewarded: false },
        { rewarded: null }
      ]
    };

    const getModuels = await PurchaseModules.find(filter);

    for (const module of getModuels) {

      let get;
      if(module.type === 'skill') {

        get = await SkillModel.findById(module.skill).select('reward_price title');

      }else{
        get = await LearningPathModel.findById(module.path).select('reward_price title');
      }

      const teen = await UserModel.findOne({_id:module.user}, 'user_credit first_name last_name email parents_id');

      await sendNotification({
        from: teen._id,
        to: teen._id,
        message: `Congratulations your have completed the ${module.type} (${get.title}).`
      })

      await sendEmail({
        name: `${teen.first_name} ${teen.last_name}`,
        email: teen.email,
        message : `
          Congratulations your have completed the ${module.type} (${get.title}).
          <br />
          <br />
          Please feel free to reach out if any further action is required.
          <br />
          Thank you,
          <br />
          My First Job
        `,
        key: "notification_email",
        subject:"Achievement Notification"
      });


      if(get && get?.reward_price && get?.reward_price > 0){

        await Txn.create({
          user: teen._id,
          description: `Rewarded on completed ${module.type} (${get.title}).`,
          credit: get?.reward_price,
          type:'credit'
        });

        await UserModel.findOneAndUpdate(
          {_id:teen._id},
          {$set: {user_credit:(parseFloat(teen.user_credit||0) + parseFloat(get?.reward_price))}},
          {new: true}
        );


        await sendNotification({
          from: teen._id,
          to: teen._id,
          message: `Congratulations your are rewarded (${get?.reward_price}) credits on completing the ${module.type} (${get.title}).`
        })

        await sendEmail({
          name: `${teen.first_name} ${teen.last_name}`,
          email: teen.email,
          message : `
            Congratulations your are rewarded (${get?.reward_price}) credits on completing the ${module.type} (${get.title}).
            <br />
            <br />
            Please feel free to reach out if any further action is required.
            <br />
            Thank you,
            <br />
            My First Job
          `,
          key: "notification_email",
          subject:"Reward Notification"
        });

        if(teen.parents_id){
          const parent = await UserModel.findOne({_id:teen.parents_id}, 'first_name last_name email');

          await sendNotification({
            from: parent._id,
            to: parent._id,
            message: `Congratulations your child (${teen.first_name} ${teen.last_name}) completed the ${module.type} (${get.title}).`
          })

          await sendEmail({
            name: `${parent.first_name} ${parent.last_name}`,
            email: parent.email,
            message : `
              Congratulations your child (${teen.first_name} ${teen.last_name}) completed the ${module.type} (${get.title}).
              <br />
              <br />
              Please feel free to reach out if any further action is required.
              <br />
              Thank you,
              <br />
              My First Job
            `,
            key: "notification_email",
            subject:"Child Achievement Notification"
          });
        }

      }

      module.rewarded = true;
      await module.save();
    }

  }catch (error) {
    console.log(error.message);
  }

}

async function assignRank(){

  try {

    const documentCount = await UserModel.countDocuments({user_type:'teenager', rank: null})

    if(documentCount){
      const defaultRank = await RankModel.findOne({default: true}).sort({createdAt: -1});

      if(defaultRank){
        await UserModel.updateMany(
          {user_type:'teenager', rank: null},
          {$set: {rank:defaultRank._id}},
          {new: true}
        );
      }
    }

  } catch (error) {
    console.log(error.message);
  }

}

async function updateRank(){

  try {

    console.log('Start updating ranks for user');

    const documents = await UpdateRankModel.find({status: false});

    if(documents.length > 0){

      for(const document  of documents){

        const skipCount = Number.isInteger(parseInt(document.complete_count))
        ? parseInt(document.complete_count, 10): 0;

        const getUsers = await UserModel.find({user_type:'teenager', user_deleted: false}).limit(50).skip(skipCount);

        for(const user of getUsers){

          const userId = user._id;

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

            console.log('Rank Updated Successfully :', getRank?._id);

            user.rank = (getRank?._id||null)
            await user.save();
          }

        }

        const complete_count = (document.complete_count + getUsers.length);
        document.complete_count = complete_count;
        if(document.total_count === complete_count){
          document.status = true;
        }
        await document.save();
      }

    }

  } catch (error) {
    console.log(error.message);
  }

}

async function referencesDistribute() {

  try {

    console.log('Start references');

    const documents = await Reference.find({reference_status: false}).populate('reference_by','user_credit');

    if(documents.length > 0){

      const siteConfigs = await SiteConfig.findOne({config_key:'reference_credit'}, 'config_key config_type config_name config_value').sort({config_order:1});

      for(const document  of documents){


        if(siteConfigs.config_value > 0){

          const reward = siteConfigs.config_value;

          await Txn.create({
            user:document.reference_by._id,
            description: `Referral signup credit.`,
            credit: reward,
            type:'credit'
          });

          await UserModel.findOneAndUpdate(
            {_id:document.reference_by._id},
            {$set: {user_credit:(parseFloat(document.reference_by.user_credit||0) + parseFloat(reward))}},
            {new: true}
          );
        }

        document.reference_status = true;
        await document.save();
      }

    }

  } catch (error) {
    console.log(error.message);
  }
}


// Schedule the task to run every minute
cron.schedule("* * * * *", () => {

  console.log("Running sendReminder...");

  sendReminder();
  // expiredSkill();
  // expiredPath();
  rewardCredit();
  assignRank();
  updateRank();
  referencesDistribute();
  //completeGoal();
});

// Schedule the cron job to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Running sendReminder...");
    await completeGoal(); // Ensure completeGoal is an async function if it involves asynchronous operations
    console.log("sendReminder completed successfully.");
  } catch (error) {
    console.error("Error in sendReminder:", error);
  }
});

module.exports = { startCronJobs: () => console.log("Cron jobs initialized.") };