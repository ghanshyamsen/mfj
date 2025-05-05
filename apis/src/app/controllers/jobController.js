const mongoose = require('mongoose');

const JobModel = require("../../models/jobs");
const UserModel = require("../../models/user");
const ResumeModel = require("../../models/resume");
const AppliedJob = require("../../models/jobapplied");
const JobReport = require("../../models/jobreports");
const JobView = require("../../models/jobviews");
const sendEmail = require("../../Mail/emailSender");
const JobSuggestionModel = require("../../models/jobsuggestions");
const JobInvited = require("../../models/jobinvited");
const SkillModel = require("../../models/skills");
const SiteConfig = require("../../models/siteconfig");

class Job {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const getJob = await JobModel.findById(key);
        const user = await UserModel.findById(getJob.user_id).select('first_name last_name');

        return res.status(200).json({status: 'success', data: {
          id: getJob._id,
          job_position: getJob.job_position,
          orgnaization: getJob.orgnaization,
          job_description: getJob.job_description,
          job_min_amount: ((getJob.job_min_amount||0).toLocaleString('en-US')),
          job_max_amount: ((getJob.job_max_amount||0).toLocaleString('en-US')),
          location:getJob.location,
          user_id:getJob.user_id,
          user_name:`${user.first_name} ${user.last_name}`,
          logo:(getJob.logo?`${process.env.MEDIA_URL}job/${getJob.logo}`:""),
          updated: new Date(getJob.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
          ...getJob._doc
        }});

      }else{

        const getJobs = async () => {
          const jobs = await JobModel.find({}, 'job_position orgnaization location logo job_min_amount job_max_amount job_status user_id updatedAt');
          const defaultValues = [];
          let idx = 1;

          for (const job of jobs) {

            const user = await UserModel.findById(job.user_id).select('first_name last_name');

            defaultValues.push({
              s_no: idx,
              id: job._id,
              job_position: job.job_position,
              orgnaization: job.orgnaization,
              location: job.location,
              job_payscale: (((job.job_min_amount?'$'+((job.job_min_amount||0).toLocaleString('en-US')):'')+(job.job_max_amount?'- $'+((job.job_max_amount||0).toLocaleString('en-US')):''))),
              job_status: job.job_status,
              user_id: job.user_id,
              user_name:`${user.first_name} ${user.last_name}`,
              logo:(job.logo?`${process.env.MEDIA_URL}job/${job.logo}`:""),
              updated: new Date(job.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }
          return defaultValues;
        };

        getJobs().then(defaultValues => {
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
      const getUser = await UserModel.findOne({_id: postData.user_id, user_deleted:false},'subscription').populate('plan_id',' plan_analytics plan_boosted plan_job plan_key plan_matches');
      const activeJobCount =  await JobModel.countDocuments({job_status:true,user_id:postData.user_id,paid_job:false});

      if(getUser?.plan_id?.plan_key !== 'enterprise_plan'){
        if(activeJobCount >= getUser?.plan_id?.plan_job){
          if(!postData.checkpaid?.job_paid){
            return res.status(200).json({status:false, message:`You've reached your active job limit and cannot create any more at this time.` });
          }
        }
      }


      if(getUser?.plan_id?.plan_boosted === 'yes'){
        postData.job_boost = true;
      }

      let find = { job_title:new RegExp(postData.job_position, 'i') }
      const jobSuggestion = await JobSuggestionModel.findOne(find);

      if(!jobSuggestion){

        const siteConfigs = await SiteConfig.findOne({config_key:'app_site_mail'}, 'config_key config_type config_name config_value');

        await JobSuggestionModel.create({
          job_title: postData.job_position,
          job_description: postData.job_description,
          job_status: false
        });

        await sendEmail({
          name: `Admin`,
          email: siteConfigs.config_value,
          message : `
              Added a new job suggestion ${postData.job_position}. Please review and update.
              <br />
              <br />
              Thank you,
              <br />
              My First Job
          `,
          key: "notification_email",
          subject:"New Job Suggestion Added Notification"
        });
      }

      const create = await JobModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Job added successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const payLoad = req.body;


      const job = await JobModel.findById(key);

      if (!job) {
        return res.status(200).json({status:false, message:"Invalid Request" });
      }

      const getUser = await UserModel.findOne({_id: job.user_id, user_deleted:false},'subscription').populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches');
      const activeJobCount =  await JobModel.countDocuments({job_status:true,user_id:job.user_id,paid_job:false});

      if(getUser?.plan_id?.plan_key !== 'enterprise_plan' && !payLoad?.action){
        if(!job.paid_job && activeJobCount >= getUser?.plan_id?.plan_job && payLoad.job_status){
          return res.status(200).json({status:false, message:`You've reached your active job limit and cannot create any more at this time.` });
        }
      }

      if(payLoad?.job_position){
        let find = { job_title:new RegExp(payLoad.job_position, 'i') }
        const jobSuggestion = await JobSuggestionModel.findOne(find);

        if(!jobSuggestion){

          const siteConfigs = await SiteConfig.findOne({config_key:'app_site_mail'}, 'config_key config_type config_name config_value');

          await JobSuggestionModel.create({
            job_title: payLoad.job_position,
            job_description: payLoad.job_description,
            job_status: false
          });

          await sendEmail({
            name: `Admin`,
            email: siteConfigs.config_value,
            message : `
                Added a new job suggestion ${payLoad.job_position}. Please review and update.
                <br />
                <br />
                Thank you,
                <br />
                My First Job
            `,
            key: "notification_email",
            subject:"New Job Suggestion Added Notification"
          });
        }

      }

      if(payLoad.logo && job.logo){
        await unlinkFile('uploads/job/',job.logo);
      }

      const update = await JobModel.findOneAndUpdate(
        {_id: key},
        {$set: payLoad},
        {new: true}
      );

      if(update){
        await AppliedJob.updateMany(
          { job_id: key }, // Filter criteria
          {
            $set: {
              "job_info.job_position": update.job_position,
              "job_info.location": update.location,
              "job_info.salary": (((update.job_min_amount?'$'+((update.job_min_amount||0).toLocaleString('en-US')):'')+(update.job_max_amount?'- $'+((update.job_max_amount||0).toLocaleString('en-US')):'')))
            }
          }
        );
      }

      return res.status(200).json({status:true, data:update, message:"Job updated successfully!"});

    }catch(err){
      return res.status(200).json({status:false, message:(typeof err.message === 'string'?err.message:'something went wrong.') });
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      const job = await JobModel.findById(key);

      if (!job) {
        return res.status(200).json({status:false, message:"Invalid Request" });
      }

      if(job.logo){
        await unlinkFile('uploads/job/',job.logo);
      }

      await JobModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Job deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async updatestatus(req, res) {
    try{

      const { id, status } = req.body;

      const update = await JobModel.findOneAndUpdate(
        {_id: id},
        {$set: {job_status: status}},
        {new: true}
      );

      if(update){

        res.status(200).json({
          status: 'success',
          message: "Status updated successfully"
        });

      }else{
        res.status(200).json({message:"Oh No!, Something went wrong."});
      }

    }catch(err){
      return res.status(200).json({status:false, message:(typeof err.message === 'string'?err.message:'something went wrong.') });
    }
  }

  async getjobs(req, res) {

    try {

      const { key, active } = req.params;
      const { keyword, jobtype, location, latitude, longitude, loctype, radius, posted, salary, offset, salary_range, count } = req.query;

      const Id = req.user.userId;

      if(key){

        const job = await JobModel.findOne({_id:key, job_status:true}).populate('user_id','personality_assessment first_name last_name');
        if(job){

          const user = await UserModel.findById(job.user_id);

          const resume = await ResumeModel.findOne({ user_id: Id }, 'user_id job_prefernces job_prefernces_complete_status skills_assessment personality_assessment date_of_birth');

          let percentage = await getMatchedPercent(resume, job, Id);

          if(job && user.status){
            return res.status(200).json({status: true, data: {
                ...job._doc,
                logo:(user.company_logo?`${process.env.MEDIA_URL}avtar/${user.company_logo}`:""),
                orgnaization:user.business_type,
                percentage: percentage.toFixed(2)
              }
            });
          }else{
            return res.status(200).json({status: false, message: "Job not found."});
          }
        }else{
          return res.status(200).json({status: false, message: "This job has been removed or closed by the employer."});
        }

      }else{

        //const resume = await ResumeModel.findOne({ user_id: Id }, ` job_prefernces `);

        const getJobs = async () => {


          {/*

            let find = {
              job_status:true,
              $or: [
                { 'user_id.subscription_status': true },
                { paid_job: true }
              ]
            };

            if(keyword){
              find = {
                ...find,
                $or:[
                  {job_position:new RegExp(keyword, 'i')},
                  {orgnaization:new RegExp(keyword, 'i')},
                  //{location:new RegExp(keyword, 'i')}
                ]
              }
            }

            if (location && !radius) {
              const parts = location.split(",");
              const city = parts[0]?.trim();
              const state = parts[1]?.trim();

              find = {
                ...find,
                $and: [
                  {
                    $or: [
                      ...(city ? [{ location: new RegExp(city, 'i') }] : []),
                      ...(state ? [{ location: new RegExp(state, 'i') }] : [])
                    ]
                  }
                ]
              };
            }

            if(jobtype){
              find = {
                ...find,
                job_type:{$in:jobtype?.split(',')}
              }
            }

            if(loctype){
              find = {
                ...find,
                job_location_type:{$in:loctype?.split(',')}
              }
            }

            if (radius && latitude && longitude) {
              const radiusInRadians = parseInt(radius) / 6378.1; // Earth's radius in km
              //const job_location = resume?.job_prefernces?.job_location;

              find = {
                ...find,
                $and: [
                  {
                    $or: [
                      { job_location_type: "In-person at a precise location" },
                      { job_location_type: "In-person within a limited area" },
                    ],
                  },
                  {
                    "coordinate.coordinates": {
                      $geoWithin: {
                        $centerSphere: [[longitude || 0.0, latitude || 0.0], radiusInRadians],
                      },
                    },
                  },
                ],
              };
            }

            if (salary_range) {
              let salary_arr = salary_range?.split(',').map(Number);  // Convert to numbers

              find = {
                  ...find,
                  $and: [
                      ...(find.$and || []),
                      { job_min_amount: { $gte: salary_arr[0] } },  // Minimum salary >= lower range
                      { job_max_amount: { $lte: salary_arr[1] } }   // Maximum salary <= upper range
                  ]
              };
            }

            if(posted){

              const now = new Date(); // Current date and time
              const date = new Date();
              date.setDate(now.getDate() - parseInt(posted));

              find = { ...find, createdAt: { $gte: date } };
            }

            if (salary) {
              find = {
                ...find,
                job_pay_type:{$in:salary?.split(',')}
              };
            }

            const Query = JobModel.find(find, 'user_id job_type expected_hours job_description job_position orgnaization location logo job_min_amount job_max_amount job_status job_boost updatedAt job_pay_type job_pay_type_other paid_job')
            .populate('user_id','subscription_status')
            .sort({ createdAt: -1 })
            .limit(20)
            .skip(offset);

            //const jobs = await Query;
          */}

          const pipeline = [];

          // Join user collection to access `subscription_status`
          pipeline.push({
            $lookup: {
              from: 'users', // use actual collection name
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          });

          pipeline.push({ $unwind: '$user' });

          const today = new Date();

          // Add all your dynamic match conditions
          const match = {
            job_status: true,
            $and: [
              {
                $or: [
                  { 'user.subscription_status': true },
                  {
                    $and: [
                      { 'user.subscription_status': false },
                      {
                        $or: [
                          { paid_job: true },
                          { 'user.subscription_next_payment_date': { $gte: today } }
                        ]
                      }
                    ]
                  }
                ]
              },
              { 'user.status': true }
            ]
          };

          if (keyword) {
            match.$or = [
              ...(match.$or || []),
              { job_position: new RegExp(keyword, 'i') },
              { orgnaization: new RegExp(keyword, 'i') }
            ];
          }

          if (location && !radius) {
            const parts = location.split(",");
            const city = parts[0]?.trim();
            const state = parts[1]?.trim();

            match.$and = [
              ...(match.$and || []),
              {
                $or: [
                  ...(city ? [{ location: new RegExp(city, 'i') }] : []),
                  ...(state ? [{ location: new RegExp(state, 'i') }] : [])
                ]
              }
            ];
          }

          if (jobtype) {
            match.job_type = { $in: jobtype.split(',') };
          }

          if (loctype) {
            match.job_location_type = { $in: loctype.split(',') };
          }

          if (radius && latitude && longitude) {
            const radiusInRadians = parseInt(radius) / 6378.1;

            match.$and = [
              ...(match.$and || []),
              {
                $or: [
                  { job_location_type: "In-person at a precise location" },
                  { job_location_type: "In-person within a limited area" },
                ]
              },
              {
                "coordinate.coordinates": {
                  $geoWithin: {
                    $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radiusInRadians]
                  }
                }
              }
            ];
          }

          if (salary_range) {
            const [min, max] = salary_range.split(',').map(Number);

            match.$and = [
              ...(match.$and || []),
              { job_min_amount: { $gte: min } },
              { job_max_amount: { $lte: max } }
            ];
          }

          if (posted) {
            const date = new Date();
            date.setDate(date.getDate() - parseInt(posted));
            match.createdAt = { $gte: date };
          }

          if (salary) {
            match.job_pay_type = { $in: salary.split(',') };
          }

          // Add final match
          pipeline.push({ $match: match });

          // Project only needed fields
          pipeline.push({
            $project: {
              user_id: 1,
              job_type: 1,
              expected_hours: 1,
              job_description: 1,
              job_position: 1,
              orgnaization: 1,
              location: 1,
              logo: 1,
              job_min_amount: 1,
              job_max_amount: 1,
              job_status: 1,
              job_boost: 1,
              updatedAt: 1,
              job_pay_type: 1,
              job_pay_type_other: 1,
              paid_job: 1,
              'user.subscription_status': 1
            }
          });

          // Sort, paginate
          pipeline.push({ $sort: { createdAt: -1 } });
          pipeline.push({ $skip: parseInt(offset) });
          pipeline.push({ $limit: 20 });

          const jobs = await JobModel.aggregate(pipeline);


          const defaultValues = [];
          let idx = 1;

          for (const job of jobs) {

            const user = await UserModel.findById(job.user_id);
            defaultValues.push({
              s_no: idx,
              id: job._id,
              job_position: job.job_position,
              orgnaization: (user?user.business_type:''),
              location: job.location,
              job_type: job.job_type,
              expected_hours: job.expected_hours,
              job_description: job.job_description,
              job_payscale: (((job.job_min_amount?'$'+((job.job_min_amount||0).toLocaleString('en-US')):'')+(job.job_max_amount?'- $'+((job.job_max_amount||0).toLocaleString('en-US')):''))),
              job_pay_type: (job?.job_pay_type === 'Other'?job?.job_pay_type_other:job?.job_pay_type),
              job_status: job.job_status,
              logo: (user && user.company_logo?`${process.env.MEDIA_URL}avtar/${user.company_logo}`:""),
              job_boost: job.job_boost,
              updated: new Date(job.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }

          return defaultValues;
        };

        getJobs().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });

      }

    } catch (error) {
      res.status(200).json({status:false, message:error.message});
    }

  }

  async getmatched(req, res){

    try {

      const { keyword, jobtype, location, latitude, longitude, loctype, radius, posted, salary, offset, salary_range } = req.query;
      const { listed } = req.body;

      const Id = req.user.userId;

      const resume = await ResumeModel.findOne({ user_id: Id }, 'user_id job_type expected_hours job_description job_prefernces job_boost job_prefernces_complete_status skills_assessment personality_assessment date_of_birth');

      if(!resume?.job_prefernces_complete_status){
        return res.status(200).json({status: false, message: "Your job preferences is not set, please update job preferences first." });
      }

      const getJobs = async () => {

        const pipeline = [];

        // Join with users collection to access `subscription_status`
        pipeline.push({
          $lookup: {
            from: 'users', // Make sure this matches your actual collection name
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        });
        pipeline.push({ $unwind: '$user' });

        const today = new Date();

        // Start with base match conditions
        const match = {
          job_status: true,
          $and: [
            {
              $or: [
                { 'user.subscription_status': true },
                {
                  $and: [
                    { 'user.subscription_status': false },
                    {
                      $or: [
                        { paid_job: true },
                        { 'user.subscription_next_payment_date': { $gte: today } }
                      ]
                    }
                  ]
                }
              ]
            },
            { 'user.status': true }
          ]
        };

        // Keyword search
        if (keyword) {
          match.$or = [
            ...(match.$or || []),
            { job_position: new RegExp(keyword, 'i') },
            { orgnaization: new RegExp(keyword, 'i') },
            { location: new RegExp(keyword, 'i') }
          ];
        }

        // City/State match if location exists but no radius
        if (location && !radius) {
          const parts = location.split(',');
          const city = parts[0]?.trim();
          const state = parts[1]?.trim();

          if (!match.$and) match.$and = [];

          match.$and.push({
            $or: [
              ...(city ? [{ location: new RegExp(city, 'i') }] : []),
              ...(state ? [{ location: new RegExp(state, 'i') }] : [])
            ]
          });
        }

        // Job type
        if (jobtype) {
          match.job_type = { $in: jobtype.split(',') };
        }

        // Location type
        if (loctype) {
          match.job_location_type = { $in: loctype.split(',') };
        }

        // Radius-based geo filtering
        if (radius && latitude && longitude) {
          const radiusInRadians = parseInt(radius) / 6378.1;

          if (!match.$and) match.$and = [];

          match.$and.push(
            {
              $or: [
                { job_location_type: "In-person at a precise location" },
                { job_location_type: "In-person within a limited area" },
              ]
            },
            {
              "coordinate.coordinates": {
                $geoWithin: {
                  $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radiusInRadians]
                }
              }
            }
          );
        }

        // Salary range
        if (salary_range) {
          const [min, max] = salary_range.split(',').map(Number);
          if (!match.$and) match.$and = [];
          match.$and.push(
            { job_min_amount: { $gte: min } },
            { job_max_amount: { $lte: max } }
          );
        }

        // Posted within N days
        if (posted) {
          const now = new Date();
          const date = new Date();
          date.setDate(now.getDate() - parseInt(posted));
          match.createdAt = { $gte: date };
        }

        // Pay type filter
        if (salary) {
          match.job_pay_type = { $in: salary.split(',') };
        }

        // Exclude listed jobs
        if (listed?.length > 0) {
          match._id = { $nin: listed };
        }

        pipeline.push({ $match: match });

        // Project fields you care about (adjust as needed)
        pipeline.push({
          $project: {
            user_id: 1,
            job_type: 1,
            expected_hours: 1,
            job_description: 1,
            job_position: 1,
            orgnaization: 1,
            location: 1,
            logo: 1,
            job_min_amount: 1,
            job_max_amount: 1,
            job_status: 1,
            job_boost: 1,
            updatedAt: 1,
            job_pay_type: 1,
            job_pay_type_other: 1,
            paid_job: 1,
            matching_preferences: 1,
            required_skills:1,
            'user.personality_assessment': 1
          }
        });

        // Sort & paginate
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: parseInt(offset) });
        pipeline.push({ $limit: parseInt(20) });



        // Execute aggregation
        const jobs = await JobModel.aggregate(pipeline);
        const defaultValues = [];
        let idx = 1;

        for (const job of jobs) {

          let percentage = await getMatchedPercent(resume, job, Id);

          if(percentage >= 50){

            const user = await UserModel.findById(job.user_id);

            defaultValues.push({
              s_no: idx,
              id: job._id,
              job_position: job.job_position,
              orgnaization: (user?user.business_type:''),
              location: job.location,
              job_type: job.job_type,
              expected_hours: job.expected_hours,
              job_description: job.job_description,
              job_payscale: (((job.job_min_amount?'$'+((job.job_min_amount||0).toLocaleString('en-US')):'')+(job.job_max_amount?'- $'+((job.job_max_amount||0).toLocaleString('en-US')):''))),
              job_pay_type: (job?.job_pay_type === 'Other'?job?.job_pay_type_other:job?.job_pay_type),
              job_status: job.job_status,
              logo: (user && user.company_logo?`${process.env.MEDIA_URL}avtar/${user.company_logo}`:""),
              job_boost: job.job_boost,
              updated: new Date(job.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
              percentage: percentage?.toFixed(2)

            });

            idx++;
          }

        }
        defaultValues.sort((a, b) => b.percentage - a.percentage);
        return defaultValues;
      };

      getJobs().then(defaultValues => {
        // You can use defaultValues here if needed
        return res.status(200).json({status: true, data: defaultValues });
      });

    } catch (error) {
      return res.status(200).json({status: false, message: error.message});
    }
  }

  async getmatched__(req, res){

    try {

      const { keyword, offset } = req.query;

      const Id = req.user.userId;

      const resume = await ResumeModel.findOne({ user_id: Id }, 'job_prefernces job_prefernces_complete_status');

      if(!resume?.job_prefernces_complete_status){
        return res.status(200).json({status: true, message: "Your job preferences is not set, please update job preferences first." });
      }

      const job_prefernces = resume?.job_prefernces;
      const job_position = job_prefernces?.job_titles;
      const job_location = job_prefernces.job_location;
      const location_miles = job_prefernces.location_miles;

      const getJobs = async () => {

        let find = { job_status:true };

        if(keyword){
          find = {
            ...find,
            $or:[
              {job_position:new RegExp(keyword, 'i')},
              {orgnaization:new RegExp(keyword, 'i')},
              {location:new RegExp(keyword, 'i')}
            ]
          }
        }

        const Query = JobModel.find(find)
        .sort({ createdAt: -1 })
        .limit(100)
        .skip(offset);


        const jobs = await Query;

        const defaultValues = [];
        let idx = 1;

        for (const job of jobs) {

          let percentage = 0;

          if(percentage >= 50){
            const user = await UserModel.findById(job.user_id);

            defaultValues.push({
              s_no: idx,
              id: job._id,
              job_position: job.job_position,
              orgnaization: (user?user.business_type:''),
              location: job.location,
              job_payscale: (((job.job_min_amount?'$'+((job.job_min_amount||0).toLocaleString('en-US')):'')+(job.job_max_amount?'- $'+((job.job_max_amount||0).toLocaleString('en-US')):''))),
              job_pay_type: (job?.job_pay_type === 'Other'?job?.job_pay_type_other:job?.job_pay_type),
              job_status: job.job_status,
              logo: (user && user.company_logo?`${process.env.MEDIA_URL}avtar/${user.company_logo}`:""),
              updated: new Date(job.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }

        }
        defaultValues.sort((a, b) => b.percentage - a.percentage);
        return defaultValues;
      };

      getJobs().then(defaultValues => {
        // You can use defaultValues here if needed
        return res.status(200).json({status: true, data: defaultValues });
      });

    } catch (error) {
      return res.status(200).json({status: false, message: error.message});
    }
  }

  async getcompanyjobs(req, res) {

    try {

      const { key } = req.params;
      const { active, limit, user, offset, count } = req.query;
      const status = active;
      const userId = (user?user:req.user.userId);

      if(key){

        const job = await JobModel.findOne({_id:key,user_id:userId});
        const user = await UserModel.findById(job.user_id);

        if(job){

          job.logo = (user.company_logo?`${process.env.MEDIA_URL}avtar/${user.company_logo}`:"");
          job.orgnaization = user.business_type;

          return res.status(200).json({status: true, data: job });
        }else{
          return res.status(200).json({status: false, message: "Job not found."});
        }

      }else{

        if(count){
          const jobCount =  await JobModel.countDocuments({job_status:status,user_id:userId,paid_job:false});
          return res.status(200).json({status: true, count: jobCount });
        }

        const getJobs = async () => {

          const query =  JobModel.find({job_status:status,user_id:userId}, 'user_id job_position orgnaization location logo job_min_amount job_max_amount job_status updatedAt').sort({ createdAt: -1 });

          if(offset){
            query.skip(offset);
          }

          if(limit){
            query.limit(limit);
          }


          const jobs = await query;

          const defaultValues = [];
          let idx = 1;

          for (const job of jobs) {

            const jobAppliedCount = await AppliedJob.countDocuments({job_id:job._id});

            defaultValues.push({
              s_no: idx,
              id: job._id,
              job_position: job.job_position,
              applied_count: jobAppliedCount
            });

            idx++;
          }

          return defaultValues;
        };

        getJobs().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });

      }

    } catch (error) {
      res.status(200).json({status:false, message:error.message});
    }

  }

  async getappliedjobs(req, res) {

    try {

      const {employer, job, user, limit, offset} = req.query;

      var userId = req.user.userId;

      if(job && user){

        const is_user = await UserModel.findOne({_id:user, user_deleted:false});

        if(is_user){
          const applied = await AppliedJob.findOne({
            job_id: job,
            candidate_id: user,
            $or: [
              { employer_id: userId },
              { candidate_id: userId }
            ]
          }).sort({ createdAt: -1 });

          if(applied){
            return res.status(200).json({status: true, data: applied});
          }else{
            return res.status(200).json({status: false, message: "Inavlid request!!"});
          }
        }else{
          return res.status(200).json({status: false, message: "This applicant is no longer available."});
        }
      }else if(job){


        const job_info = await JobModel.findOne({_id:job}).populate('user_id','personality_assessment');

        const user = await UserModel.findOne({_id:userId},'personality_assessment_complete_status personality_assessment user_type');

        const applied = AppliedJob.find({job_id: job}).populate('employer_id','company_logo business_type').sort({ createdAt: -1 });

        if (offset && typeof parseInt(offset) === 'number') {
          applied.skip(offset);
        }

        if (limit && typeof parseInt(limit) === 'number') {
          applied.limit(limit);
        }

        const result =  await applied;


        const updatedResult = await Promise.all(
          result.map(async (value) => {
            let per = 0;
            let personality_per = 0;
            let skills_per = 0;

            const resume = await ResumeModel.findOne({ user_id: value.candidate_id }, `
              personality_assessment_complete_status personality_assessment skills_assessment skills_complete_status
              job_prefernces job_prefernces_complete_status date_of_birth user_id
            `);

            /* if (user?.user_type === 'manager' && user?.personality_assessment_complete_status) {

              const matchPercentage = calculateTypeMatchPercentage(
                user.personality_assessment,
                resume?.personality_assessment || [],
                80
              );

              per = matchPercentage.toFixed(2); // Ensure the percentage has the correct format
              personality_per = matchPercentage.toFixed(2);
            }

            if(job_info?.required_skills.length > 0 && resume?.skills_assessment.length > 0){

              const sortted = await getsortskills(resume.skills_assessment);

              const matchPercentage = matchArraysExact(
                job_info.required_skills,
                sortted || [],
                20
              );

              per = (parseFloat(per) + parseFloat(matchPercentage)).toFixed(2);
              skills_per = matchPercentage.toFixed(2);
            } */

            let percentage = await getMatchedPercent(resume, job_info, userId);

            value.job_info.logo = value?.employer_id?.company_logo
              ? `${process.env.MEDIA_URL}avtar/${value.employer_id.company_logo}`
              : "";

            value.job_info.orgnaization = value?.employer_id?.business_type || "";

            return {
              ...value._doc,
              per: percentage?.toFixed(2)+'%',
              per_c:percentage?.toFixed(2),
              skills: (resume?.skills_complete_status||false),
              personality_per:personality_per,
              skills_per:skills_per
            };
          })
        );

        return res.status(200).json({status: true, data: updatedResult});
      }else if(user){

        const is_user = await UserModel.findOne({_id:user, user_deleted:false});

        if(is_user){
          const applied = AppliedJob.find({candidate_id: user}).populate('employer_id','company_logo business_type').sort({ createdAt: -1 });

          if (offset && typeof parseInt(offset) === 'number') {
            applied.skip(offset);
          }

          if (limit && typeof parseInt(limit) === 'number') {
            applied.limit(limit);
          }

          const result =  await applied;

          result.map((value) => {
            value.job_info.logo = (value?.employer_id.company_logo?`${process.env.MEDIA_URL}avtar/${value.employer_id.company_logo}`:"");
            value.job_info.orgnaization = value.employer_id.business_type;
            return value;
          });

          return res.status(200).json({status: true, data: result});
        }else{
          return res.status(200).json({status: false, message: 'This applicant is no longer available.'});
        }

      }else if(employer){

        const applied = AppliedJob.find({employer_id: employer}).populate('employer_id','company_logo business_type').sort({ createdAt: -1 });

        if (offset && typeof parseInt(offset) === 'number') {
          applied.skip(offset);
        }

        if (limit && typeof parseInt(limit) === 'number') {
          applied.limit(limit);
        }

        const result =  await applied;

        result.map((value) => {
          value.job_info.logo = (value?.employer_id.company_logo?`${process.env.MEDIA_URL}avtar/${value.employer_id.company_logo}`:"");
          value.job_info.orgnaization = value.employer_id.business_type;
          return value;
        });

        return res.status(200).json({status: true, data: result});
      }

      res.status(200).json({status: false, message: "Invalid request!!"});
    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }

  }

  async getmatchedcandidate(req, res) {

    const { key } = req.params;
    const { keyword = '', offset = 0 } = req.query;
    const { listed } = req.body;

    const Id = req.user.userId;

    try {
      // Fetch the job using the `key` parameter
      const job = await JobModel.findOne({_id:key},
        `job_location_type job_position location latitude longitude job_type weekly_day_range expected_hours shift_time required_skills matching_preferences location_miles user_id`
      ).populate('user_id', 'personality_assessment');

      if (!job) {
        return res.status(200).json({ status:false, message: 'Job not found' });
      }

      const applied = await AppliedJob.find({job_id: key},'candidate_id').sort({ createdAt: -1 });

      const candidateIds = applied.map((value) => value.candidate_id); // Maps over the resolved array

      // Build the query for resumes
      const query = ResumeModel.find({
          // Optional: Add filtering logic for resumes based on the `keyword`
          job_prefernces_complete_status:true,
          ...(keyword && {
              $text: { $search: keyword }, // Requires a text index on searchable fields
          }),
          ...((listed.length > 0 || candidateIds.length > 0) && {
            user_id: { $nin: [...listed, ...candidateIds] },
          }),
      }, 'job_prefernces skills_complete_status skills_assessment personality_assessment date_of_birth user_id')
      .populate({
          path: 'user_id', // Populate `user_id` field
          match: { user_deleted: false, visibility: "public" }, // Filter only non-deleted users
          select: 'first_name last_name profile_image', // Select necessary fields
      })
      .limit(100)
      .skip(parseInt(offset))
      .lean(); // Return plain objects for performance

      const resumes = await query;

      // Filter out resumes with `null` user_id (from unmatched `match` conditions)
      const validResumes = resumes.filter(resume => resume.user_id !== null);

      const getUsers = async () => {

        const defaultValues = [];
        let idx = 1;

        for (const resume of validResumes) {

          let percentage = await getMatchedPercent(resume, job, Id);

          if(percentage >= 50)
          {

            const invited = await JobInvited.findOne({candidate_id:resume?.user_id?._id,job_id:job._id},'createdAt').sort({createdAt:-1});

            const sortted = await getsortskills(resume.skills_assessment);
            const skillArray = await getSkills(sortted);

            defaultValues.push({
              s_no: idx,
              id: resume?.user_id?._id,
              logo: (resume?.user_id?.profile_image?`${process.env.MEDIA_URL}avtar/${resume?.user_id?.profile_image}`:`${process.env.MEDIA_URL}avtar/default-user.png`),
              name: `${resume?.user_id?.first_name} ${resume?.user_id?.last_name}`,
              percentage: percentage?.toFixed(2),
              skills: (resume?.skills_complete_status||false),
              skills_array: skillArray,
              invited: (invited?true:false),
              invited_date:(invited?new Date(invited.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric',  hour: 'numeric', minute: 'numeric', hour12: true  }):""),
            });

            idx++;
          }

        }
        defaultValues.sort((a, b) => b.percentage - a.percentage);
        return defaultValues;
      };

      // Respond with the valid resumes
      getUsers().then(defaultValues => {
        // You can use defaultValues here if needed
        return res.status(200).json({status: true, data: defaultValues });
      });

    } catch (error) {
      console.error('Error fetching resumes:', error);
      return res.status(200).json({ status:false, message: 'Internal server error' });
    }

  }

  async appliedjobs(req, res) {

    try {

      const PostData = req.body;

      const applied = await AppliedJob.findOne({
        job_id: PostData.job_id,
        candidate_id: PostData.candidate_id
      });

      if(applied){
        return res.status(200).json({status: false, message: "Your are already applied on this job!"});
      }

      const getJob = await JobModel.findOne({_id: PostData.job_id, job_status:true });

      if(!getJob){
        return res.status(200).json({status: false, message:"The job listing is no longer available."});
      }

      const employer = await UserModel.findOne({_id:PostData.employer_id,user_deleted:false},'email first_name last_name');

      if(!employer){
        return res.status(200).json({status: false, message:"The job listing is no longer available."});
      }

      const created = await AppliedJob.create(PostData);

      const candidate = await UserModel.findOne({_id:created.candidate_id},'email purchased_letter purchased_plan');

      if(PostData.cover_letter){
          if(!candidate.purchased_plan.includes('cover_letter') && candidate?.purchased_letter > 0){
            candidate.purchased_letter = (candidate.purchased_letter - 1);
            await candidate.save();
          }
      }

      sendNotification({
        from: created.employer_id,
        to: created.candidate_id,
        message: `Dear ${created.user_info.first_name} ${created.user_info.last_name}, thank you for your application for ${created.job_info.job_position} position.`,
        link: process.env.REACTAPP_URL2+'/job-detail/'+PostData.job_id,
        key: 'applied_on_job',
        extra: {job_id:PostData.job_id?.toString()}
      })

      sendNotification({
        from: created.candidate_id,
        to: created.employer_id,
        message: `You have received new application from ${created.user_info.first_name} ${created.user_info.last_name} on job position ${created.job_info.job_position}.`,
        link: (process.env.REACTAPP_URL2+'/candidate-info/'+created.candidate_id+'/'+PostData.job_id),
        key: 'received_application',
        extra: {job_id:PostData.job_id?.toString(), candidate_id:created.candidate_id?.toString()}
      })

      await sendEmail({
        name: `${employer.first_name} ${employer.last_name}`,
        email: employer.email,
        message : `
        You’ve received a new application for the <a href="${(process.env.REACTAPP_URL2+'/job-details/'+PostData.job_id)}">${created.job_info.job_position}</a> position from <b>${created.user_info.first_name} ${created.user_info.last_name}</b>.
        <br />
        <br />
        <b>Next Steps:</b>
        <br />
        <br />
        ✔ Click below to review the applicant’s profile and resume.
        <br />
        ✔ If interested, send them a message or schedule an interview through the MyFirstJob platform.
        <br />
        ✔ Keep an eye out for more applications as candidates apply!
        <br />
        <br />
        🔎 <a href="${(process.env.REACTAPP_URL2+'/candidate-info/'+created.candidate_id+'/'+PostData.job_id)}">View Applicant Profile</a>
        <br />
        <br />
        💡 Pro Tip: A quick response improves your chances of hiring the best talent before they accept another offer!
        <br />
        <br />
        Let us know if you have any questions—we’re here to help!
        <br />
        <br />
        <b>Best,</b>
        <br />
        🚀 The MyFirstJob Team
        `,
        key: "notification_email",
        subject:`📩 New Job Application for ${created.job_info.job_position}`
      });

      await sendEmail({
        name: `${created.user_info.first_name} ${created.user_info.last_name}`,
        email: candidate.email,
        message : `
          Thank you for applying for the <a href="${(process.env.REACTAPP_URL2+'/job-detail/'+PostData.job_id)}">${created.job_info.job_position}</a> position! Your application has been successfully submitted, and the employer will review it soon.
          <br />
          <br />
          <b>What to Expect Next:</b>
          <br />
          <br />
          ✔ The employer will review your application and reach out if they’d like to move forward.
          <br />
          ✔ If selected, you may receive an interview request directly through the MyFirstJob app.
          <br />
          ✔ Keep an eye on your inbox for updates!
          <br />
          <br />
          💡 Pro Tip: In the meantime, make sure your resume is polished and your profile is complete for the best chances of landing the job!
          <br />
          <br />
          If you have any questions, feel free to reach out. We’re here to help!
          <br />
          <br />
          <br />
          <b>Best of luck,</b>
          <br />
          🚀 The MyFirstJob Team
        `,
        key: "notification_email",
        subject:"🚀 Application Received – What’s Next?"
      });

      res.status(200).json({status: true, message:"Application Submitted Successfully.", data: created});

    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }

  }

  async updateappliedjobs(req, res) {

    try {

      const { key } = req.params;

      const PostData = req.body;

      const updated = await AppliedJob.findOneAndUpdate({_id:key},{$set:PostData},{new:true});

      const candidate = await UserModel.findOne({_id:updated.candidate_id,user_deleted:false},'email');

      if(candidate){
        let message = updated.status === 'Invited'?
        `Thank you for your application. We have reviewed your qualifications and are
        impressed with your experience and skills. We would like to invite you for an interview to further discuss your potential fit for the role.
        Please let us know your availability for a phone or in-person interview.`:
        `We regret to inform you that after careful consideration, we have decided to proceed with other candidates who more closely align with our requirements.`;

        sendNotification({
          from: updated.employer_id,
          to: updated.candidate_id,
          message: message,
          link: (process.env.REACTAPP_URL2+'/job-detail/'+updated.job_id),
          key: 'application_status_accepte_or_reject',
          extra: {job_id:updated.job_id?.toString()}
        })

        await sendEmail({
          name: `${updated.user_info.first_name} ${updated.user_info.last_name}`,
          email: candidate.email,
          message : `
            ${message}
            <br />
            <br />
            <a href="${process.env.REACTAPP_URL2+'/job-detail/'+updated.job_id}">Click here to view this job</a>
            <br />
            Please feel free to reach out if any further action is required.
            <br />
            Thank you,
            <br />
            My First Job
          `,
          key: "notification_email",
          subject:"Job Application Updated Notification"
        });

        res.status(200).json({status: true, message:"Application Updated Successfully."});
      }else{
        return res.status(200).json({status: false, message:"This applicant is no longer available."});
      }

    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }

  }

  async deleteappliedjob(req, res) {
    try {

      const { key } = req.params;
      const userId = req.user.userId;

      const applied = await AppliedJob.findById(key);

      if(!applied){
        return res.status(200).json({status: false, message: "Invalid application requested."});
      }

      const employer = await UserModel.findOne({_id:applied.employer_id,user_deleted:false},'email first_name last_name');

      const isDelete = await AppliedJob.findOneAndDelete({ _id: key, candidate_id:userId });

      if(isDelete){

        sendNotification({
          from: applied.candidate_id,
          to: applied.employer_id,
          message: `Candidate ${applied.user_info.first_name} ${applied.user_info.last_name} has cancelled their application for the job position ${applied.job_info.job_position}.`,
          link: (process.env.REACTAPP_URL2+'/candidate-info/'+applied.candidate_id),
          key: 'application_cancelled',
          extra: {candidate_id:applied.candidate_id?.toString()}
        })

        await sendEmail({
          name: `${employer.first_name} ${employer.last_name}`,
          email: employer.email,
          message : `
            We wanted to inform you that <b>${applied.user_info.first_name} ${applied.user_info.last_name}</b> has withdrawn their application for the <a href="${process.env.REACTAPP_URL2+'/job-details/'+applied.job_id}">${applied.job_info.job_position}</a> position.
            <br />
            <br />
            <b>What This Means for You:</b>
            <ul>
            <li>You can still review other candidates who have applied.</li>
            <li>If you’d like to attract more applicants, consider refreshing your job post.</li>
            <li>Need more candidates? Promote your listing to reach more job seekers.</li>
            </ul>


            🔎 <a href="${process.env.REACTAPP_URL2+'/candidates/'+applied.job_id}">View Remaining Applicants</a>
            <br />
            <br />
            If you have any questions or need assistance, we’re here to help!
            <br />
            <br />
            <b>Best,</b>
            <br />
            🚀 The MyFirstJob Team
          `,
          key: "notification_email",
          subject:`🔔 Candidate Update: Application Withdrawal for ${applied.job_info.job_position}`,
        });

        return res.status(200).json({status:true, message:"Application cancelled."});
      }else{
        return res.status(200).json({status:false, message:"Invalid application request"});
      }

    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }
  }

  async getreports(req, res) {
    try {
      const { job, candidate } = req.query;

      // Build the query object based on provided query parameters
      const query = {};
      if (job) {
        query.job_id = job;
      }

      if (candidate) {
        query.candidate_id = candidate;
      }

      // Fetch reports from JobReport collection based on the query
      const report = await JobReport.find(query).sort({ createdAt: -1 });

      // Return success response with fetched reports
      return res.status(200).json({ status: true, data: report });
    } catch (error) {
      // Return error response with error message
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async jobreports(req, res) {
    try {
      const PostData = req.body;

      const user = await UserModel.findOne({_id:PostData.candidate_id, user_deleted:false});

      if(user){
        const report = await JobReport.create(PostData);

        res.status(200).json({status: true, message:"We have received your complaint and will review it soon.", data:report});
      }else{
        return res.status(200).json({status: false, message: 'This applicant is no longer available.'});
      }

    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }
  }

  async getjobviews(req, res) {
    try {
        const { job, employer, candidate } = req.query;

        // Get the start and end of the current month
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const week = getCurrentWeekStartAndEnd();

        const currentWeekStart = week.start;
        const currentWeekEnd = week.end;

        // Base match query
        const matchQuery = {
            createdAt: {
                $gte: currentWeekStart,
                $lte: currentWeekEnd
            }
        };

        // Add conditions based on query parameters
        if (job) {
          matchQuery.job_id = new mongoose.Types.ObjectId(job); // Ensure job_id is an ObjectId
        }

        if (employer) {
          matchQuery.employer_id = new mongoose.Types.ObjectId(employer); // Ensure employer_id is an ObjectId
        }

        if (candidate) {
          matchQuery.candidate_id = new mongoose.Types.ObjectId(candidate); // Ensure candidate_id is an ObjectId
        }

        // Generate array of all dates within the current month
        const dateArray = generateDateArray(currentWeekStart, currentWeekEnd);

        // Aggregation pipeline for daily counts
        const dailyCountsPipeline = [
          { $match: matchQuery },
          {
              $project: {
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } // Extract the date part of createdAt
              }
          },
          {
              $group: {
                  _id: "$date", // Group by date
                  count: { $sum: 1 } // Count documents per date
              }
          },
          {
              $sort: { _id: 1 } // Sort by date ascending
          },
          {
              $group: {
                  _id: null,
                  counts: { $push: { date: "$_id", count: "$count" } } // Push all results into an array
              }
          },
          {
              $project: {
                  _id: 0,
                  counts: {
                      $map: {
                          input: dateArray, // The array of all dates
                          as: "date",
                          in: {
                              date: "$$date",
                              count: {
                                  $let: {
                                      vars: {
                                          matchingCount: {
                                              $arrayElemAt: [
                                                  {
                                                      $filter: {
                                                          input: "$counts",
                                                          as: "countObj",
                                                          cond: { $eq: ["$$countObj.date", "$$date"] }
                                                      }
                                                  },
                                                  0
                                              ]
                                          }
                                      },
                                      in: { $ifNull: ["$$matchingCount.count", 0] } // If there's no matching date, return count 0
                                  }
                              }
                          }
                      }
                  }
              }
          },
          {
              $unwind: "$counts" // Flatten the final result to get one document per date
          },
          {
              $replaceRoot: { newRoot: "$counts" } // Replace root to display each document as separate result
          },
          {
              $sort: { date: 1 } // Sort the result by date
          }
      ];

        // Aggregation pipeline for daily counts
        /* const dailyCountsPipeline = [
            { $match: matchQuery },
            {
                $project: {
                    // Extract the date part of createdAt
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                }
            },
            {
                $group: {
                    _id: "$date", // Group by date
                    count: { $sum: 1 } // Count documents per date
                }
            },
            {
                $sort: { _id: 1 } // Sort by date ascending
            }
        ]; */

        // Aggregation pipeline for total count
        const totalCountPipeline = [
            { $match: matchQuery },
            {
                $group: {
                    _id: null, // No grouping
                    totalCount: { $sum: 1 } // Total count of documents
                }
            }
        ];

        // Execute both aggregations
        const [dailyCounts, totalCountResult] = await Promise.all([
            JobView.aggregate(dailyCountsPipeline),
            JobView.aggregate(totalCountPipeline)
        ]);

        // Extract total count from the result
        const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

        // Send response with daily counts and total count
        res.status(200).json({status:true, dailyCounts:dailyCounts, totalCount:totalCount});
    } catch (error) {
      res.status(200).json({ status:false, message: 'An error occurred while fetching job views.', error:error.message });
    }
  }

  async jobviews(req, res) {
    try {

      const PostData = req.body;

      // Get today's date range
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Start of today

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // End of today

      // Query with date condition
      const isChecked = await JobView.findOne({
        candidate_id: PostData.candidate_id,
        job_id: PostData.job_id,
        createdAt: {
            $gte: todayStart,
            $lte: todayEnd
        }
      });

      if(!isChecked){
        await JobView.create(PostData);
      }

      return res.status(200).json({status: true});

    } catch (error) {
      return res.status(200).json({status: false, message: error.message});
    }
  }

  async jobinvitation(req, res){

    try {

      const { user, job, employer, message } = req.body;

      /* const isInvited = await JobInvited.findOne({
        job_id: job,
        candidate_id: user
      });

      if(isInvited){
        return res.status(200).json({status: false, message: "This student has already invited."});
      } */


      const getJob = await JobModel.findOne({_id: job, job_status:true });


      const candidate = await UserModel.findOne({_id:user},'first_name last_name email');

      const created = await JobInvited.create({
        employer_id: employer,
        job_id: job,
        candidate_id: user,
        message
      });

      sendNotification({
        from: created.employer_id,
        to: created.candidate_id,
        message: message,
        link: (process.env.REACTAPP_URL2+'/job-detail/'+job),
        key: 'job_invitation',
        extra: {job_id:job?.toString()}
      })

      await sendEmail({
        name: `${candidate.first_name} ${candidate.last_name}`,
        email: candidate.email,
        message : `
          Great news! An employer has invited you to view a job opportunity for the ${getJob.job_position} position.
          <br />
          <br />
          <b>Message from the Employer:</b>
          <br />
          <br />
          "${message}"
          <br />
          <br />
          🔗 <a href="${process.env.REACTAPP_URL2+'/job-detail/'+job}">Click here to view and apply</a>
          <br />
          <br />
          If you have any questions, feel free to reach out. We’re here to help!
          <br />
          <br />
          <b>Best of luck,</b>
          <br />
          🚀 The MyFirstJob Team
        `,
        key: "notification_email",
        subject:"📢 You've Been Invited to Apply for a Job!"
      });

      return res.status(200).json({status: true, message: "Your invitation request has been sent successfully."});
    } catch (error) {
      return res.status(200).json({status: false, message: error.message});
    }

  }

}

async function getsortskills(list){

  // Step 1: Aggregate points and collect IDs for each skill
  const skillData = {};

  // Function to update skill data
  const updateSkillData = (skill) => {
      if (!skillData[skill.title]) {
          skillData[skill.title] = { points: 0, id: skill._id };
      }
      skillData[skill.title].points += skill.point;
  };

  // Iterate over skills_assessment
  list.forEach(item => {
      if (item.skills) {
          item.skills.forEach(skill => {
              updateSkillData(skill);
          });
      } else {
          // Handle cases where skills might not be present
      }
  });

  // Step 2: Convert the aggregated data into an array and sort
  const sortedSkills = Object.entries(skillData)
      .map(([title, { points, id }]) => ({ title, points, id }))
      .sort((a, b) => b.points - a.points);

  // Step 3: Output the sorted skills
  const sortted = sortedSkills.slice(0, 5);

  return sortted;
}

async function getSkills(list) {
  const defaultValues = [];

  for (let item of list) {
    const skill = await SkillModel.findOne({ _id: item.id }, 'title image');

    defaultValues.push({
      name: (item.title||""),
      image: skill && skill.image ? `${process.env.MEDIA_URL}skills/${skill.image}` : "",
    });
  }

  return defaultValues;
}

function calculateTypeMatchPercentage(arr1, arr2, match=100,length=false) {
  if (arr1.length !== arr2.length) {
    return '0.00';
  }

  let matchCount = 0;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].type === arr2[i].type) {
      matchCount++;
    }
  }

  // Calculate the match percentage
  const matchPercentage = (matchCount / arr1.length) * match;
  return matchPercentage;//.toFixed(2); // Return result as percentage with 2 decimal places
}

function matchArraysExact(array1, array2, match=100) {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  let matchCount = 0;

  // Count how many values in array1 are present in array2
  set1.forEach(item => {
    if (set2.has(item)) {
      matchCount++;
    }
  });

  return (matchCount / array1.length) * match;
}

function generateDateArray(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Format date to YYYY-MM-DD and push to array
    dates.push(currentDate.toISOString().split('T')[0]);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function getCurrentWeekStartAndEnd() {
  // Get today's date
  const today = new Date();

  // Get the current day of the week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = today.getDay();

  // Calculate the start date (previous Sunday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);

  // Calculate the end date (Saturday after the week start)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Return the start and end date as formatted strings (YYYY-MM-DD)
  return {
    start: weekStart,//.toISOString().split('T')[0],
    end: weekEnd//.toISOString().split('T')[0]
  };
}

function isWithinRadius(userLat, userLon, jobLat, jobLon, radiusMiles) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(jobLat - userLat);
  const dLon = toRadians(jobLon - userLon);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(userLat)) * Math.cos(toRadians(jobLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return distance <= radiusMiles; // Returns true if within radius
}

function getSimilarValues(array1, array2) {
  const smallerArray = array1.length < array2.length ? array1 : array2;
  const largerArray = array1.length >= array2.length ? array1 : array2;

  // Use `filter` and `includes` to find similar values
  return smallerArray.filter(value =>
      largerArray.some(item => item.toLowerCase() === value.toLowerCase())
  );
}

function getDateDifferenceInYears(startDate, endDate = new Date()) {
  // Convert the startDate to a Date object
  const start = new Date(startDate);

  // Get the difference in time (milliseconds)
  const timeDiff = endDate - start;

  // Convert time difference to years
  const yearsDiff = timeDiff / (1000 * 3600 * 24 * 365.25); // 365.25 accounts for leap years

  return yearsDiff;
}

async function getMatchedPercent(resume, job, userId){

  const job_prefernces = resume?.job_prefernces;
  const job_position = job_prefernces?.job_titles;
  const job_location = job_prefernces?.job_location;
  const location_miles = job_prefernces?.location_miles;
  const job_type =  job_prefernces?.job_type;
  const shift_type =  job_prefernces?.shift_type;
  const weekly_hours =  job_prefernces?.weekly_hours;
  const weekly_days =  job_prefernces?.weekly_days;

  let percentage = 0;
  if(job?.matching_preferences){

    let matching_preferences = job?.matching_preferences;

    if(matching_preferences?.location?.checked && job_location){

      if(job?.job_location_type === 'In-person at a precise location' || job?.job_location_type ==='In-person within a limited area'){

        if(resume && userId === resume.user_id.toString()){

          if(location_miles && isWithinRadius(job_location.latitude, job_location.longitude, job.latitude, job.longitude, location_miles)){
            percentage += parseFloat(matching_preferences?.location?.percent);
          }else if(job_location && !job.location_miles){
            percentage += parseFloat(matching_preferences?.location?.percent);
          }
        }else if((job.user_id?.toString() === userId) || (job.user_id?._id?.toString() == userId)) {

          if(job_location && job.location_miles && isWithinRadius(job_location.latitude, job_location.longitude, job.latitude, job.longitude, job.location_miles)){
            percentage += parseFloat(matching_preferences?.location?.percent);
          }else if(job_location && !job.location_miles){
            percentage += parseFloat(matching_preferences?.location?.percent);
          }
        }

      }else{
        if((job?.job_location_type !== 'In-person at a precise location' && job?.job_location_type !=='In-person within a limited area') && job_prefernces?.open_for_remote){
          percentage += parseFloat(matching_preferences?.location?.percent);
        }
      }
    }

    if (matching_preferences?.job_types?.checked) {

      const jobSuggestion = await JobSuggestionModel.findOne(
          { job_title: new RegExp(job.job_position, 'i') },
          'job_category'
      ).populate('job_category', 'title'); // Populate job_category to retrieve its title

      if (jobSuggestion) {
        const jobSuggestionId = jobSuggestion?._id?.toString();
        const jobCategoryId = jobSuggestion?.job_category?._id; // Extract the category ID

        if (jobSuggestionId) {

          if (job_position?.includes(jobSuggestionId)) { // Convert job_position to string array
              percentage += matching_preferences?.job_types?.percent / 2;
          } else {

            if (jobCategoryId) {
              const checkIfJob = await JobSuggestionModel.findOne(
                {
                  _id: { $in: job_position?.filter(value => value != null && isValidObjectIdStrict(value)) },
                  job_category: jobCategoryId
                },
                'job_title'
              );

              if (checkIfJob) {
                percentage += parseFloat(matching_preferences?.job_types?.percent / 2);
              }
            }
          }
        }
      }

      if (job_type?.includes(job.job_type)) {
          percentage += parseFloat(matching_preferences?.job_types?.percent / 2);
      }
    }

    if(matching_preferences?.schedule?.checked){

      if((job?.weekly_day_range||[]).includes('Flexible') || (weekly_days||[]).includes('Flexible')){
        percentage += parseFloat(matching_preferences?.schedule?.percent/3);
      }else{
        let weekly_days_similiar = getSimilarValues((weekly_days||[]),(job?.weekly_day_range||[]));
        if(weekly_days_similiar.length > 0){
          percentage += parseFloat(((matching_preferences?.schedule?.percent/3)/(job?.weekly_day_range||[]).length)*weekly_days_similiar.length); //*weekly_days_similiar.length

        }
      }

      let weekly_hours_similiar = getSimilarValues((weekly_hours||[]),(job?.expected_hours||[]));
      if(weekly_hours_similiar.length > 0){
        percentage += parseFloat(((matching_preferences?.schedule?.percent/3)/(job?.expected_hours||[]).length)*weekly_hours_similiar.length); //*weekly_hours_similiar.length

      }

      if((job?.shift_time||[]).includes('Flexible')){
        percentage += parseFloat(matching_preferences?.schedule?.percent/3);
      }else{
        let shift_type_similiar = getSimilarValues((shift_type||[]),(job?.shift_time||[]));
        if(shift_type_similiar.length > 0){
          percentage += parseFloat(((matching_preferences?.schedule?.percent/3)/(job?.shift_time||[]).length)*shift_type_similiar.length); //*shift_type_similiar.length

        }
      }

    }

    if(matching_preferences?.soft_skill?.checked &&  job?.required_skills.length > 0 && resume?.skills_assessment.length > 0){

      // const sortted = await getsortskills(resume.skills_assessment);

      // const matchPercentage = matchArraysExact(
      //   job.required_skills,
      //   sortted || [],
      //   matching_preferences?.soft_skill?.percent
      // );

      // percentage += parseFloat(matchPercentage);

      // Updated logic
      if (matching_preferences?.soft_skill?.checked && job?.required_skills.length > 0 && resume?.skills_assessment.length > 0) {


        const sortedSkills = await getsortskills(resume.skills_assessment);


        const requiredSkills = job.required_skills; // Array of skill titles (strings)

        if (sortedSkills && sortedSkills.length > 0 && requiredSkills.length > 0) {
            // Calculate individual skill weight
            const totalSoftSkillWeight = parseFloat(matching_preferences?.soft_skill?.percent) || 0;
            const perSkillWeight = totalSoftSkillWeight / requiredSkills.length; // Divide by total job skills

            // Corrected skill matching by title
            let matchedSkillsCount = sortedSkills.filter(skill =>
                requiredSkills.includes(skill.title) // Now comparing correctly
            ).length;

            // Calculate final match percentage based on matches
            const matchPercentage = matchedSkillsCount * perSkillWeight;

            // Add the computed percentage
            percentage += matchPercentage;


        }
    }

    }

    if (matching_preferences?.personality_match?.checked && job?.user_id?.personality_assessment?.length > 0 && resume?.personality_assessment?.length > 0) {

      const matchPercentage = calculateTypeMatchPercentage(
        job?.user_id?.personality_assessment,
        resume?.personality_assessment || [],
        matching_preferences?.personality_match?.percent
      );

      percentage += parseFloat(matchPercentage);
    }

    if(resume?.date_of_birth && matching_preferences?.age_requirement?.checked && getDateDifferenceInYears(resume?.date_of_birth) >= 18){
      percentage += parseFloat(matching_preferences?.age_requirement?.percent);;
    }

  }

  return percentage;
}

function isValidObjectIdStrict(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const objId = new mongoose.Types.ObjectId(id);
  return objId.toString() === id;
}

module.exports = Job;
