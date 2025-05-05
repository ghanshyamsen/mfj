const mongoose = require("mongoose");

const msgtemplateSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["student", "employer", "both"],
      required: true,
      default: "both",
    },
  },
  { timestamps: true }
);

msgtemplateSchema.index({ type: 1 });  // Index on status

const MessageTemplate = mongoose.model("MessageTemplates", msgtemplateSchema);

module.exports = MessageTemplate;
