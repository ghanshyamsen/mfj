/** Packages */
const admin = require("firebase-admin");
const NotifyModel = require("../models/notifications");
const UserModel = require("../models/user");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const twilio = require('twilio');
const socketStore = require('../socket');

// Path to your service account key JSON file
const serviceAccount = require("./myfirstjobdev-b3f13-88c7078e47df.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/** Functions */
const secretKey = `9=K(Yr&9gr"%~ikH.H(~Y~{7[e2p1F(f`; // Use a secure, unique key in a real application

global.encrypt = function (text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

global.decrypt = function (cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

global.generateRandomKey = (length) => {
    const buffer = crypto.randomFillSync(Buffer.alloc(length));
    return buffer.toString("hex");
};

global.generateOTP = (length = 4) => {
    let otp = ''

    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }

    return otp
}

/** Twilio */

// Your Twilio account SID and Auth Token from https://www.twilio.com/console
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

// Create a new Twilio client
const client = new twilio(accountSid, authToken);

// Function to send SMS
global.sendSms = async function (to, body) {
    try {
        const message = await client.messages.create({
            body: body,
            to: to, // Text this number
            from: process.env.TWILIO_FROM // From a valid Twilio number
        });
        return { status: true, message: message.sid };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

global.sendNotification = async ({from, to, message, link, key, extra}) =>  {
    // Send a notification
    try{

        const io = socketStore.getIo();
        const socketId = socketStore.getSocketId(to);

        message = message?.replace(/\n/g, '');

        const issend = await NotifyModel.create({
            sender: from,
            receiver: to,
            message: message,
            link: (link||'')
        });

        console.log(socketId);

        const getUser = await UserModel.findById(to).select('device_token');

        if(getUser?.device_token){
            await sendPushNotification(getUser.device_token, key, message, extra);
        }

        return {
            status: true,
            _id: issend._id
        }

    }catch (error) {

        console.log(error.message);
        return {
            status: false,
            message: error.message
        }
    }
}

global.sendPushNotification = async (deviceToken, title, body, data = {}) => {
    try {
      const message = {
        notification: {
          title: '', // Notification title
          body: body,   // Notification body
        },
        data: {
          key:title,
          ...data, // Additional data you want to send (key-value pairs)
        },
        token: deviceToken, // Device FCM Token
      };

      const response = await admin.messaging().send(message);
      console.log("Notification sent successfully:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
};

global.ucfirst = (str) => {
    return str?str.charAt(0).toUpperCase() + str.slice(1):'';
}