const io = require('../../socket');
const MessageModel = require("../../models/messages");
const ChatRoomModel = require("../../models/chatroom");
const UserModel = require("../../models/user");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var interval;
class Chat {

  async get(req, res) {
    try {
      const { room, offset } = req.body;
      const from = req.user.userId;

      // Construct the query
      let query = { room: room };

      // Fetch messages with pagination
      const messages = await MessageModel.find(query)
        .sort({ _id: -1 }) // Sort by descending order of _id to get latest messages first
        .limit(20)
        .skip(offset);

      // Reverse the order to maintain chronological order in the response
      const projectedMessages = messages.reverse().map((msg) => {
        const mediaFiles = Array.isArray(msg.media) ? msg.media : []; // Ensure media is an array

        return {
          id: msg._id,
          fromSelf: msg.sender.toString() === from,
          message: msg.message,
          template: (msg.template||''),
          images: mediaFiles.map(media => `${process.env.MEDIA_URL}chat/${media.filename}`),
          thumbnail: (msg.media_thumbnail||''),
          duration: (msg.media_duration||'0:0'),
          originalname: mediaFiles.map(media => `${media.originalname}`),
          date: msg.createdAt
        };
      });

      return res.status(200).json({ status: true, data: projectedMessages });
    } catch (err) {
      return res.status(200).json({ status: false, message: err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      // Example of using io instance to send private message
      const { room, from, to, message, template, media, media_thumbnail, media_duration } = req.body;

      const findUser = await UserModel.findOne({_id:to, user_deleted:false});

      if(findUser) {


        await MessageModel.create({
          message,
          template:(template||""),
          room,
          receiver: to,
          sender: from,
          media,
          media_thumbnail: media_thumbnail||"",
          media_duration: media_duration||""
        });

        if(findUser?.device_token){

          if(interval){
            clearTimeout(interval);
            interval = null;
          }

          interval = setTimeout(async () => {

            const lastmsg = await MessageModel.findOne({ room: room, read: false })
            if(lastmsg){
              await sendPushNotification(findUser.device_token, 'new_message_received', message, {room});
            }

          }, 10000);

        }

        return res.status(200).json({status:true, message:"Message sent successfully."});
      }else{
        return res.status(200).json({status:false, message:"This chat is inactive or the user account has been deleted."});
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async readmessage(req, res) {
    try {
      const { room } = req.body;
      const from = req.user.userId;

      // Update the 'read' status for messages in the specified room for the user
      const result = await MessageModel.updateMany(
        { room, receiver:from, read: false },  // Find unread messages in the room for the user
        { $set: { read: true } }             // Update the 'read' status to true
      );

      if (result.nModified > 0) {
        return res.status(200).json({ status: true, message: 'Messages successfully marked as read!' });
      } else {
        return res.status(200).json({ status: true, message: 'No unread messages found.' });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  async getchatlist(req, res){
    try{

      const {key:currentUserId} = req.params;

      /* const results = await ChatRoomModel.aggregate([
        {
          $match: {
            users: { $in: [currentUserId] }
          }
        },
        {
          $unwind: "$users"
        },
        {
          $match: {
            users: { $ne: currentUserId }
          }
        },
        {
          $lookup: {
            from: "users",
            let: { userId: "$users" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$userId" }] }
                }
              },
              {
                $project: {
                  _id: 1,
                  first_name: 1,
                  last_name: 1,
                  profile_image: 1
                }
              }
            ],
            as: "userInfo"
          }
        },
        {
          $unwind: "$userInfo"
        },
        {
          $addFields: {
            profile_image: {
              $concat: [
                process.env.MEDIA_URL,
                "avtar/",
                {
                  $ifNull: [
                    {
                      $cond: {
                        if: { $eq: ["$userInfo.profile_image", ""] },
                        then: "default-user.png",
                        else: "$userInfo.profile_image"
                      }
                    },
                    "default-user.png"
                  ]
                }
              ]
            }
          }
        },
        {
          $lookup: {
            from: "messages",
            let: { chatRoomId: { $toString: "$_id" } }, // Convert chatRoomId to string
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$room", "$$chatRoomId"] }
                }
              },
              {
                $sort: { createdAt: -1 }
              },
              {
                $group: {
                  _id: "$room",
                  latestMessage: { $first: "$$ROOT" },
                  unreadCount: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$sender", new ObjectId(currentUserId)] }, // Exclude messages sent by the current user
                            { $eq: ["$read", false] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  }
                }
              }
            ],
            as: "messageInfo"
          }
        },
        {
          $unwind: {
            path: "$messageInfo",
            preserveNullAndEmptyArrays: true // Include rooms with no messages
          }
        },
        {
          $project: {
            _id: 1,
            roomkey: "$_id",
            roomstatus: "$room_status",
            userId: "$userInfo._id",
            first_name: "$userInfo.first_name",
            last_name: "$userInfo.last_name",
            profile_image: 1,
            latestMessage: {
              $ifNull: ["$messageInfo.latestMessage.message", ""]
            },
            unreadCount: {
              $ifNull: ["$messageInfo.unreadCount", 0]
            },
            latestMessageDate: {
              $ifNull: ["$messageInfo.latestMessage.createdAt", new Date(0)]
            }
          }
        },
        {
          $sort: {
            latestMessageDate: -1 // Sort by the latest message date
          }
        }
      ]); */

      const results = await ChatRoomModel.aggregate([
        {
          $match: {
            users: { $in: [currentUserId] }
          }
        },
        {
          $unwind: "$users"
        },
        {
          $match: {
            users: { $ne: currentUserId }
          }
        },
        {
          $lookup: {
            from: "users",
            let: {
              userId: {
                $cond: [
                  { $and: [{ $eq: [{ $type: "$users" }, "string"] }, { $eq: [{ $strLenBytes: "$users" }, 24] }] },
                  "$users",
                  null
                ]
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", { $toObjectId: "$$userId" }] }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  first_name: 1,
                  last_name: 1,
                  profile_image: 1
                }
              }
            ],
            as: "userInfo"
          }
        },
        {
          $unwind: "$userInfo"
        },
        {
          $addFields: {
            profile_image: {
              $concat: [
                process.env.MEDIA_URL,
                "avtar/",
                {
                  $ifNull: [
                    {
                      $cond: {
                        if: { $eq: ["$userInfo.profile_image", ""] },
                        then: "default-user.png",
                        else: "$userInfo.profile_image"
                      }
                    },
                    "default-user.png"
                  ]
                }
              ]
            }
          }
        },
        {
          $lookup: {
            from: "messages",
            let: { chatRoomId: { $toString: "$_id" } }, // Convert chatRoomId to string
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$room", "$$chatRoomId"] }
                }
              },
              {
                $sort: { createdAt: -1 }
              },
              {
                $group: {
                  _id: "$room",
                  latestMessage: { $first: "$$ROOT" },
                  unreadCount: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$sender", new ObjectId(currentUserId)] }, // Exclude messages sent by the current user
                            { $eq: ["$read", false] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  }
                }
              }
            ],
            as: "messageInfo"
          }
        },
        {
          $unwind: {
            path: "$messageInfo",
            preserveNullAndEmptyArrays: true // Include rooms with no messages
          }
        },
        {
          $project: {
            _id: 1,
            roomkey: "$_id",
            roomstatus: "$room_status",
            userId: "$userInfo._id",
            first_name: "$userInfo.first_name",
            last_name: "$userInfo.last_name",
            profile_image: 1,
            latestMessage: {
              $ifNull: ["$messageInfo.latestMessage.message", ""]
            },
            unreadCount: {
              $ifNull: ["$messageInfo.unreadCount", 0]
            },
            latestMessageDate: {
              $ifNull: ["$messageInfo.latestMessage.createdAt", ""]
            }
          }
        },
        {
          $sort: {
            latestMessageDate: -1 // Sort by the latest message date
          }
        }
      ]);

      return res.status(200).json({status:true, data:results });

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async getroom(req, res){
    try {

      const { user_one, user_two } = req.body;

      const isExist = await ChatRoomModel.findOne({
        users: {
          $all: [user_one, user_two]
        }
      });

      if(!isExist){
        const created = await ChatRoomModel.create({
          users:[
            user_one,
            user_two
          ]
        });

        if(created._id){
          return res.status(200).json({status:true, room:created._id });
        }
      }

      return res.status(200).json({status:true, room:isExist._id });

    } catch (error) {
      return res.status(200).json({status:false, message:error.message});
    }
  }

  async unreadcount(req, res) {
      try {

        const { user } = req.query;

        //const counts = await MessageModel.countDocuments({receiver:user, read: false})

        const result = await MessageModel.aggregate([
          // Step 1: Match unread messages with the specified receiver
          {
            $match: {
              receiver: new ObjectId(user), // Ensure user._id is an ObjectId
              read: false,
            },
          },
          // Step 2: Lookup sender information
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              as: "sender_info",
            },
          },
          // Step 3: Lookup receiver information
          {
            $lookup: {
              from: "users",
              localField: "receiver",
              foreignField: "_id",
              as: "receiver_info",
            },
          },
          // Step 4: Unwind to simplify matching fields in sender and receiver
          { $unwind: "$sender_info" },
          { $unwind: "$receiver_info" },
          // Step 5: Filter based on user_deleted status
          {
            $match: {
              "sender_info.user_deleted": false,
              "receiver_info.user_deleted": false,
            },
          },
          // Step 6: Count the matching documents
          {
            $count: "unreadMessages",
          },
        ]);

        // Safely access the count result, defaulting to 0 if no match
        const unreadMessages = result.length > 0 ? result[0].unreadMessages : 0;

        return res.status(200).json({status:true, counts:unreadMessages});

      } catch (error) {
        return res.status(200).json({status:false, message:error.message});
      }
  }

}


module.exports = Chat;
