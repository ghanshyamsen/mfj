const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
    template_key : {
        type: String,
        unique: true,
        required: true
    },
    template_title : {
        type: String,
        required: true
    },
    template_subject : {
        type: String,
        required: true
    },
    template_content:{
        type: String,
        required: true
    },
    last_update_on:{
        type: Date,
        default: () => Date.now(),
    }
});

const EmailTemaplates = mongoose.model("emailtemplates", emailTemplateSchema);

module.exports = EmailTemaplates;
