const NotifyModel = require("../../models/notifications");

class Notification {

  async get(req, res) {

    try{

      const userId = req.user.userId;

      const get = await NotifyModel.find({ receiver: userId })
      .populate('sender', 'first_name last_name profile_image').sort({ createdAt: -1 }).limit(50); // Replace 'name email' with the fields you want

      var unread = false;
      const notifications = get.map(notification => {
        if (!notification.read) {
            unread = true;
        }

        // Check if the profile image exists and is not blank
        if (notification.sender?.profile_image) {
            // Set the profile image URL only if it's not already prefixed
            if (!notification.sender?.profile_image.startsWith(process.env.MEDIA_URL)) {
              notification.sender.profile_image = process.env.MEDIA_URL + 'avtar/' + notification.sender.profile_image;
            }
        } else {
            // Set default profile image if it doesn't exist or is blank
            notification.sender.profile_image = process.env.MEDIA_URL + 'avtar/default-user.png';
        }

        return notification;
      });

      return res.status(200).json({status:true, data:notifications, unread:unread});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async markread(req, res){
    try{

      const userId = req.user.userId;

      await NotifyModel.updateMany(
        {receiver:userId, read: false },  // Find unread messages in the room for the user
        {$set:{read:true}},
        {new: true}
      );

      return res.status(200).json({status:true});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

}


module.exports = Notification;
