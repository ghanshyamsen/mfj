const mongoose = require("mongoose");

const assignBadgeSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assign_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badge_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badges',
      required: true,
    },
    badge_name: {
      type: String,
      required: true,
    },
    badge_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

assignBadgeSchema.index({ candidate_id: 1 });  // Index on status
assignBadgeSchema.index({ assign_by: 1 });  // Index on status
assignBadgeSchema.index({ badge_id: 1 });  // Index on status

const AssignBadgeModel = mongoose.model("AssignBadges", assignBadgeSchema);

module.exports = AssignBadgeModel;
