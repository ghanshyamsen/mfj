const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    title: {
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
const BadgeModel = mongoose.model("Badges", badgeSchema);
module.exports = BadgeModel;
