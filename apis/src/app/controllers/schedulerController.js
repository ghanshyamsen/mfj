const SchedulerModel = require("../../models/schedulereminder");

class Scheduler {

  async create(req, res) {

    try {

      const postData = req.body;

      const create = await SchedulerModel.create(postData);

      return res.status(200).json({
        status: true,
        data: create,
        message: "Reminder set successfully.",
      });

    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }

  }

}

module.exports = Scheduler;
