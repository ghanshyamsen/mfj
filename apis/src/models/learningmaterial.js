const mongoose = require('mongoose');

const MaterialsSchema = new mongoose.Schema({
    thumbnail: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    brief_description: {
        type: String
    },
    description: {
        type: String
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LmsSkills',
        required: true
    },
    type: {
        type: String,
        enum: ['content','html','pdf','video'],
        default: 'content'
    },
    content_media: {
        type: String
    },
    content_media_path: {
        type: String
    },
    material_media: {
        type: String
    },
    order: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });


MaterialsSchema.index({ skill: 1 });  // Index on status


const SkillMaterials = mongoose.model('SkillMaterials', MaterialsSchema);

module.exports = SkillMaterials;
