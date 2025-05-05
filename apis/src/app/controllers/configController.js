/* eslint-disable array-callback-return */
const multer = require("multer");
const SiteConfig = require("../../models/siteconfig");
const { unlink } = require('node:fs/promises');
const fs = require('fs');

exports.get = async (req, res) => {
    try {
        const siteConfigs = await SiteConfig.find({}, 'config_key config_type config_name config_value').sort({config_order:1});

        return res.status(200).json({
            status: "success",
            data: siteConfigs
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
}

exports.update = async (req, res) => {

    try {

        const postData = req.body;
        const files = req.files;

        const getConfigs = await SiteConfig.find({}, 'config_key config_value').sort({config_order:1});

        const defaultValues = {};
        getConfigs.forEach((config) => {
            defaultValues[config.config_key] = config.config_value==="null" ? null : config.config_value;
        });

        for (const key in files) {
            const fileList = files[key];
            fileList.forEach(async (file, index) => {

                fs.access('uploads/logo/'+defaultValues[file.fieldname], fs.constants.F_OK, async (err) => {
                    if (err) {
                        console.error('File does not exist.');
                    } else {
                        await unlink('uploads/logo/'+defaultValues[file.fieldname]);
                    }
                });

                await SiteConfig.findOneAndUpdate(
                    { config_key: file.fieldname },
                    { $set: { config_value: file.filename } },
                    { new: true }
                );
            });
        }


        for (const key in postData) {

            const value = postData[key];

            await SiteConfig.findOneAndUpdate(
                { config_key: key },
                { $set: { config_value: value } },
                { new: true }
            );
        }

        const siteConfigs = await SiteConfig.find({}, 'config_key config_type config_name config_value').sort({config_order:1});

        return res.status(200).json({
            status: "success",
            message: "Site Config updated successfully.",
            data: siteConfigs
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }

}

exports.getdataprivacy = async (req, res) => {

    try {

        const siteConfigs = await SiteConfig.findOne({config_key:'app_data_privacy_content'}, 'config_key config_type config_name config_value').sort({config_order:1});

        return res.status(200).json({
            status: "success",
            data: {
                content:siteConfigs.config_value
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
}



