const express = require("express");
const MessageTemplateModel = require("../../models/messagetemplate");

class MessageTemplate {

  async get(req, res) {
    try {
      const { key } = req.params;
      if (key) {
        const message = await MessageTemplateModel.findById(key);
        return res.status(200).json({
          status: "success",
          data: {
            id: message._id,
            message: message.message,
            type: message.type,
            updated: new Date(message.updatedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
        });
      } else {
        const getMessages = async () => {
          const messages = await MessageTemplateModel.find(
            {},
            " message type updatedAt"
          );
          const defaultValues = [];
          let idx = 1;

          for (let message of messages) {
            defaultValues.push({
              s_no: idx,
              id: message._id,
              message: message.message,
              type: ucfirst(message.type),
              updated: new Date(message.updatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            });
            idx++;
          }
          return defaultValues;
        };
        getMessages().then((defaultValues) => {
          return res
            .status(200)
            .json({ status: "success", data: defaultValues });
        });
      }
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const postData = req.body;
      const create = await MessageTemplateModel.create(postData);

      return res.status(200).json({
        status: true,
        data: create,
        message: "Message template created successfully.",
      });
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const { key } = req.params;
      const postData = req.body;

      const getMessage = await MessageTemplateModel.findById(key);

      if (!getMessage) {
        return res
          .status(200)
          .json({ status: false, message: "Message not found" });
      }

      const update = await MessageTemplateModel.findOneAndUpdate(
        { _id: key },
        { $set: postData },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        data: update,
        message: "Message Template updated Successfully",
      });
    } catch (err) {
      res.status(200).json({
        status: false,
        message: err.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { key } = req.params;

      const getMessage = await MessageTemplateModel.findById(key);

      if (!getMessage) {
        return res
          .status(200)
          .json({ status: false, message: "Message not found" });
      }

      const update = await MessageTemplateModel.findOneAndDelete({ _id: key });

      return res.status(200).json({
        status: true,
        data: update,
        message: "Message Template Deleted Successfully",
      });
    } catch (err) {
      res.status(200).json({
        status: false,
        message: err.message,
      });
    }
  }

  async gettemplate(req, res) {

    try {

      const { type } = req.query;

      const messages = await MessageTemplateModel.find(
        {type:{$in:['both',type]}},
        "message"
      );

      return res.status(200).json({ status: true, data: messages });

    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }

  }
}

module.exports = MessageTemplate;
