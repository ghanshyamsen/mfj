const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  config_key: {
    type: String,
    required: true,
    unique: true,
  },
  config_group: {
    type: String,
  },
  config_name: {
    type: String,
  },
  config_value: {
    type: String,
    required: false,
  },
  config_type: {
    type: String,
  },
  config_order: {
    type: Number,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const SiteConfig = mongoose.model('SiteConfig', configSchema);

module.exports = SiteConfig;