const mongoose = require('mongoose');

const AnalyticsModel = require("../../models/jobanalytics");
const JobView = require("../../models/jobviews");
const JobModel = require("../../models/jobs");
const AppliedJob = require("../../models/jobapplied");

class Analytics {

  async getanalytics(req, res){
    try {

      const { job, employer, candidate } = req.query;

      const userId = (employer||req.user.userId);

      //const get = await AnalyticsModel.find({});

      const find = {
          ...(job && { job_id: new mongoose.Types.ObjectId(job) })
      };

      const totalJobs = await JobModel.countDocuments({user_id:userId});
      const totalViews = await JobView.countDocuments({employer_id:userId,...find});
      const application = await AppliedJob.countDocuments({employer_id:userId,...find});

      const totalClickApply = await AnalyticsModel.countDocuments({type_of_action:'click_to_apply',employer_id:userId, ...find});
      const totalClickApplied = await AnalyticsModel.countDocuments({type_of_action:'applied_on_job',employer_id:userId, ...find});
      const totalInvited = await AnalyticsModel.countDocuments({type_of_action:'employer_changed_status_invited',employer_id:userId, ...find});

      const totalDropOffOne = await AnalyticsModel.countDocuments({type_of_action:'closed_application_on_questionnaire',employer_id:userId, ...find});
      const totalDropOffTwo = await AnalyticsModel.countDocuments({type_of_action:'closed_application_on_cover_letter',employer_id:userId, ...find});

      const appliedOnPeakJobPerDay = await AnalyticsModel.aggregate([
        // Match documents where the type_of_action is 'applied_on_job'
        {
          $match: { type_of_action: 'applied_on_job', employer_id: new mongoose.Types.ObjectId(userId), ...find}
        },
        // Group by the day of the week (0=Sunday, 1=Monday, etc.)
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" }, // Assuming createdAt is the date field
            count: { $sum: 1 } // Count the number of occurrences
          }
        },
        // Add the weekday name based on the day of the week
        {
          $addFields: {
            weekday: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 1] }, then: "Sun" },
                  { case: { $eq: ["$_id", 2] }, then: "Mon" },
                  { case: { $eq: ["$_id", 3] }, then: "Tue" },
                  { case: { $eq: ["$_id", 4] }, then: "Wed" },
                  { case: { $eq: ["$_id", 5] }, then: "Thu" },
                  { case: { $eq: ["$_id", 6] }, then: "Fri" },
                  { case: { $eq: ["$_id", 7] }, then: "Sat" }
                ],
                default: "Unknown"
              }
            }
          }
        },
        // Optionally, sort by the day of the week
        {
          $sort: { _id: 1 }
        }
      ]);

      const avgTimeFromVisitToApply = await AnalyticsModel.aggregate([
        // Step 1: Match documents where type_of_action is either 'visit_on_job' or 'click_to_apply'
        {
          $match: {
            type_of_action: { $in: ["visit_on_job", "click_to_apply"] },
            employer_id: new mongoose.Types.ObjectId(userId),
            ...find
          }
        },
        // Step 2: Sort by createdAt to ensure proper ordering of actions
        {
          $sort: { createdAt: -1 }
        },

        // Step 3: Group by job_id and candidate_id and push actions into an array
        {
          $group: {
            _id: { job_id: "$job_id", candidate_id: "$candidate_id" },
            actions: { $push: { type: "$type_of_action", createdAt: "$createdAt", _id: "$_id" } },
            count: { $sum: { $cond: [{ $eq: ["$type_of_action", "click_to_apply"] }, 1, 0] } } // Count of click_to_apply actions
          }
        },
        //Step 4: Project to get the latest click_to_apply and the visit_on_job just before it
        {
          $project: {
            job_id: "$_id.job_id",
            candidate_id: "$_id.candidate_id",
            latestClickToApply: {
              $arrayElemAt: [
                { $filter: { input: "$actions", as: "action", cond: { $eq: ["$$action.type", "click_to_apply"] } } },
                0 // Get the latest click_to_apply
              ]
            },
            lastVisitBeforeClick: {
              $arrayElemAt: [
                { $filter: { input: "$actions", as: "action", cond: { $eq: ["$$action.type", "visit_on_job"],  } } },
                -1 // Get the visit_on_job just before the latest click_to_apply
              ]
            },
            count: 1 // Include the total click_to_apply count
          }
        },
        // Step 5: Only keep records where both actions exist and visit is before click
        {
          $match: {
            "latestClickToApply": { $ne: null },
            "lastVisitBeforeClick": { $ne: null },
            $expr: { $gt: ["$latestClickToApply.createdAt", "$lastVisitBeforeClick.createdAt"] } // Ensure visit is before click
          }
        },
        // Step 6: Calculate time difference in minutes
        {
          $project: {
            job_id: 1,
            candidate_id: 1,
            averageTime: {
              $divide: [
                { $subtract: ["$latestClickToApply.createdAt", "$lastVisitBeforeClick.createdAt"] },
                60000 // Convert milliseconds to minutes
              ]
            },
            visitOnJobDate: "$lastVisitBeforeClick.createdAt",
            clickToApplyDate: "$latestClickToApply.createdAt",
            count: 1 // Include the click count in the projection
          }
        },
        // Step 7: Add weekday names based on the clickToApplyDate
        {
          $addFields: {
            weekday: {
              $switch: {
                branches: [
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 1] }, then: "Sun" },
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 2] }, then: "Mon" },
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 3] }, then: "Tue" },
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 4] }, then: "Wed" },
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 5] }, then: "Thu" },
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 6] }, then: "Fri" },
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 7] }, then: "Sat" }
                ],
                default: "Unknown"
              }
            },
            weekdayNumber: {
              $switch: {
                branches: [
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 1] }, then: 0 }, // Sunday
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 2] }, then: 1 }, // Monday
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 3] }, then: 2 }, // Tuesday
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 4] }, then: 3 }, // Wednesday
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 5] }, then: 4 }, // Thursday
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 6] }, then: 5 }, // Friday
                  { case: { $eq: [{ $dayOfWeek: "$clickToApplyDate" }, 7] }, then: 6 }  // Saturday
                ],
                default: -1
              }
            }
          }
        },
        // Step 8: Group by weekday and calculate the average time for each weekday
        {
          $group: {
            _id: "$weekday",  // Keep the weekday as _id
            weekdayNumber: { $first: "$weekdayNumber" }, // Keep the number to sort by
            averageTime: { $avg: "$averageTime" },  // Average time for each weekday
            count: { $sum: "$count" },  // Total click_to_apply count per weekday
          }
        },
        // Step 9: Sort by the weekday number
        {
          $sort: { "weekdayNumber": 1 }
        },
        // Step 10: Add the weekday name to the output
        {
          $addFields: {
            weekday: "$_id"  // Create a field 'weekdayName' for the day
          }
        },
        // Step 11: Remove weekdayNumber from the output
        {
          $project: {
            _id: 0,
            weekday: 1,
            averageTime: 1,
            count: 1
          }
        }
      ]);

      const avgEmployerResponseTime = await AnalyticsModel.aggregate([
          // Match the relevant actions
          {
            $match: {
              type_of_action: { $in: ["applied_on_job", "employer_changed_status_invited", "employer_changed_status_refused"] },
              employer_id: new mongoose.Types.ObjectId(userId),
              ...find
            }
          },
          {
            $sort: { "createdAt": 1 }
          },
          {
            $group: {
              _id: { job_id: "$job_id", candidate_id: "$candidate_id", employer_id: "$employer_id" },
              actions: { $push: { type: "$type_of_action", createdAt: "$createdAt" } }
            }
          },
          {
            $project: {
              job_id: "$_id.job_id",
              candidate_id: "$_id.candidate_id",
              employer_id: "$_id.employer_id",
              appliedOnJob: {
                $arrayElemAt: [
                  { $filter: { input: "$actions", as: "action", cond: { $eq: ["$$action.type", "applied_on_job"] } } },
                  0
                ]
              },
              employerResponse: {
                $arrayElemAt: [
                  { $filter: { input: "$actions", as: "action", cond: { $in: ["$$action.type", ["employer_changed_status_invited", "employer_changed_status_refused"]] } } },
                  0
                ]
              }
            }
          },
          {
            $project: {
              job_id: 1,
              candidate_id: 1,
              employer_id: 1,
              appliedOnJob: 1,
              employerResponse: 1,
              bothActionsExist: {
                $and: [
                  { $ne: ["$appliedOnJob", null] },
                  { $ne: ["$employerResponse", null] }
                ]
              }
            }
          },
          {
            $match: {
              "bothActionsExist": true
            }
          },
          {
            $project: {
              job_id: 1,
              candidate_id: 1,
              employer_id: 1,
              timeDifferenceInMilliseconds: {
                $subtract: ["$employerResponse.createdAt", "$appliedOnJob.createdAt"]
              }
            }
          },
          {
            $project: {
              job_id: 1,
              candidate_id: 1,
              employer_id: 1,
              timeDifferenceInMilliseconds: 1,
              responseTime: {
                $cond: {
                  if: { $lt: ["$timeDifferenceInMilliseconds", 60000] },
                  then: { $concat: [{ $toString: { $round: [{ $divide: ["$timeDifferenceInMilliseconds", 1000] }, 1] } }, " seconds"] },
                  else: {
                    $cond: {
                      if: { $lt: ["$timeDifferenceInMilliseconds", 3600000] },
                      then: { $concat: [{ $toString: { $round: [{ $divide: ["$timeDifferenceInMilliseconds", 60000] }, 1] } }, " minutes"] },
                      else: {
                        $cond: {
                          if: { $lt: ["$timeDifferenceInMilliseconds", 86400000] },
                          then: { $concat: [{ $toString: { $round: [{ $divide: ["$timeDifferenceInMilliseconds", 3600000] }, 1] } }, " hours"] },
                          else: { $concat: [{ $toString: { $round: [{ $divide: ["$timeDifferenceInMilliseconds", 86400000] }, 1] } }, " days"] }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: "$employer_id",
              averageTime: { $avg: "$timeDifferenceInMilliseconds" },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 1,
              averageTime: 1,
              count: 1,
              averageTimeReadable: {
                $cond: {
                  if: { $lt: ["$averageTime", 60000] },
                  then: { $concat: [{ $toString: { $round: [{ $divide: ["$averageTime", 1000] }, 1] } }, " seconds"] },
                  else: {
                    $cond: {
                      if: { $lt: ["$averageTime", 3600000] },
                      then: { $concat: [{ $toString: { $round: [{ $divide: ["$averageTime", 60000] }, 1] } }, " minutes"] },
                      else: {
                        $cond: {
                          if: { $lt: ["$averageTime", 86400000] },
                          then: { $concat: [{ $toString: { $round: [{ $divide: ["$averageTime", 3600000] }, 1] } }, " hours"] },
                          else: { $concat: [{ $toString: { $round: [{ $divide: ["$averageTime", 86400000] }, 1] } }, " days"] }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          {
            $sort: { averageTime: 1 }
          }
      ]);

      const successRate = (totalInvited && totalClickApplied?((parseFloat(totalInvited) / parseFloat(totalClickApplied)) * 100):0);
      const successRateOfApplication = (successRate > 100 ? 100 : successRate.toFixed(2));

      const mergedTimeToApply = avgTimeFromVisitToApply;

      var apply_rate  = (totalClickApplied && totalClickApply?(parseFloat(totalClickApplied)/parseFloat(totalClickApply)*100).toFixed(2):0);
      apply_rate = (apply_rate > 100 ? 100 : apply_rate);

      var dropoff_rate = (totalClickApply?((parseFloat(totalDropOffOne||0)+parseFloat(totalDropOffTwo||0))/parseFloat(totalClickApply)*100).toFixed(2):0);
      dropoff_rate = (dropoff_rate > 100?100:dropoff_rate);

      const analytics = {
        avg_view_counts: (job?totalViews:(totalViews && totalJobs?(parseInt(totalViews)/parseInt(totalJobs)).toFixed(2):0)),
        avg_application_received: (job?application:(application && totalJobs?(parseInt(application)/parseInt(totalJobs)).toFixed(2):0)),
        apply_conversion_rate: apply_rate+'%',
        dropoff_conversion_rate: dropoff_rate+'%',
        dropoff_on_questionnaire: totalDropOffOne,
        dropoff_on_cover_letter: totalDropOffTwo,
        time_to_apply: mergedTimeToApply,
        response_time_from_employers: avgEmployerResponseTime,
        success_rate_of_application: (successRateOfApplication+'%'),
        peak_days_of_application: appliedOnPeakJobPerDay
      }

      return res.status(200).json({ status: true, data: analytics});

    } catch (error) {
      return res.status(200).json({status: false, error: error.message});
    }
  }

  async postclicks(req, res){

      try {

        const PostData = req.body;

        if(PostData.type_of_action === 'click_to_apply'){
          try {
            await AnalyticsModel.deleteMany({
              type_of_action: PostData.type_of_action,
              job_id: PostData.job_id,
              candidate_id: PostData.candidate_id
            });

          } catch (err) {
            console.log("Error: " + err.message);
          }
        }

        if(PostData.type_of_action === 'visit_on_job'){
          try {
            await AnalyticsModel.deleteMany({
              type_of_action: { $in: ['visit_on_job', 'click_to_apply'] },
              job_id: PostData.job_id,
              candidate_id: PostData.candidate_id
            });

          } catch (err) {
            console.log("Error: " + err.message);
          }
        }

        if(PostData.type_of_action === 'employer_changed_status_invited' || PostData.type_of_action === 'employer_changed_status_refused'){
          try {
            await AnalyticsModel.deleteMany({
              type_of_action: { $in: ['employer_changed_status_invited', 'employer_changed_status_refused'] },
              job_id: PostData.job_id,
              candidate_id: PostData.candidate_id
            });

          } catch (err) {
            console.log("Error: " + err.message);
          }
        }

        if(PostData.type_of_action === 'closed_application_on_cover_letter' || PostData.type_of_action === 'closed_application_on_questionnaire'){

          try {
            await AnalyticsModel.deleteMany({
              type_of_action: { $in: ['closed_application_on_cover_letter','closed_application_on_questionnaire'] },
              job_id: PostData.job_id,
              candidate_id: PostData.candidate_id
            });

          } catch (err) {
            console.log("Error: " + err.message);
          }
        }

        if(PostData.type_of_action === 'applied_on_job'){

          try {
            await AnalyticsModel.deleteMany({
              type_of_action: { $in: ['closed_application_on_cover_letter','closed_application_on_questionnaire','applied_on_job'] },
              job_id: PostData.job_id,
              candidate_id: PostData.candidate_id
            });

          } catch (err) {
            console.log("Error: " + err.message);
          }
        }

        const isSaved = await AnalyticsModel.create(PostData);

        return res.status(200).json({ status: true, data: isSaved });

      } catch (error) {
          return res.status(200).json({status: false, error: error.message});
      }
  }
}

module.exports = Analytics;