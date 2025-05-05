const BadgeModel = require("../../models/badges");
const AssginBadgeModel = require("../../models/assignbadges");

class Badges {

  async get(req, res) {
    try {
      const { key } = req.params;

      if (key) {
        const getBadge = await BadgeModel.findById(key);
        return res.status(200).json({
          status: "success",
          data: {
            id: getBadge._id,
            title: getBadge.title,
            badge_image: getBadge.badge_image,
            updated: new Date(getBadge.updatedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
        });
      } else {
        const getBadges = await BadgeModel.find({}, " title updatedAt").then(
          function (badges) {
            const defaultValues = [];
            let idx = 1;

            badges.forEach((badge) => {
              defaultValues.push({
                s_no: idx,
                id: badge._id,
                title: badge.title,
                updated: new Date(badge.updatedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              });
              idx++;
            });

            return defaultValues;
          }
        );

        return res.status(200).json({ status: "success", data: getBadges });
      }
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const postData = req.body;

      const create = await BadgeModel.create(postData);

      return res.status(200).json({
        status: true,
        data: create,
        message: "badge created successfully.",
      });
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const { key } = req.params;

      const postData = req.body;

      const badge = await BadgeModel.findById(key);
      if (!badge) {
        return res
          .status(200)
          .json({ status: false, message: "Invalid Request" });
      }
      if (badge.badge_image && postData.badge_image) {
        await unlinkFile("uploads/badge/", badge.badge_image);
      }

      const update = await BadgeModel.findOneAndUpdate(
        { _id: key },
        { $set: postData },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        data: update,
        message: "badge updated successfully.",
      });
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { key } = req.params;

      const badge = await BadgeModel.findById(key);
      if (!badge) {
        return res
          .status(200)
          .json({ status: false, message: "Invalid Request" });
      }
      if (badge.badge_image) {
        await unlinkFile("uploads/badge/", badge.badge_image);
      }
      await BadgeModel.findOneAndDelete({ _id: key });

      return res.status(200).json({
        status: true,
        message: "badge deleted successfully.",
      });
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async getbadge(req, res) {

    try {

      const getBadges = await BadgeModel.find({}, " title badge_image ").sort({title: 1}).then(
        function (badges) {
          const defaultValues = [];
          badges.forEach((badge) => {
            defaultValues.push({
              id: badge._id,
              title: badge.title,
              image: process.env.MEDIA_URL+'badge/'+badge.badge_image
            });
          });

          return defaultValues;
        }
      );

      return res.status(200).json({ status: true, data: getBadges });

    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }

  }

  async assignbadge(req, res) {
    try {

      const postData = req.body;

      const isChecked = await AssginBadgeModel.findOne({candidate_id:postData.candidate_id,badge_id:postData.badge_id,assign_by:postData.assign_by});

      if(!isChecked){

        const isCreated = await AssginBadgeModel.create(postData);

        return res.status(200).json({
          status:true,
          message: "Badge assigned successfully.",
        });

      }else{
        return res.status(200).json({status:false, message: 'This badge is already assigned to this candidate.'});
      }

    }catch (err) {
      return res.status(200).json({status:false, message: err.message});
    }
  }

}

module.exports = Badges;
