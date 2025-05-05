const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
    admin_id: {
        type: String,
        required: true
    },
    role_name: {
        type: String,
        required: true
    },
    admin_access: {
        type: Boolean,
        default: false
    },
    job_posting: {
        type: Boolean,
        default: false
    },
    edit_job_position:{
        type: Boolean,
        default: false
    },
    view_applicants:{
        type: Boolean,
        default: false
    },
    communication:{
        type: Boolean,
        default: false
    },
    hire:{
        type: Boolean,
        default: false
    },
    search_candidates:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

rolesSchema.index({ admin_id: 1 });  // Index on status

const Roles = mongoose.model('Roles', rolesSchema);

module.exports = Roles;
