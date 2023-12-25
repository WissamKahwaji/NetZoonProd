import admin from "firebase-admin";
import fcm from "fcm-node";
import { Notifications } from "../models/notification/notification_model.js";
// import serviceAccount from '../config/serviceAccountKey.json' assert { type: "json" };
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();

const serverKey = process.env.SERVER_KEY;

var FCM = new fcm(serverKey);

// admin.initializeApp({
//     credential: admin.credential.cert(serverKey)
// });
// const certPath = admin.credential.cert(serverKey);

export const sendPushNotification = async (req, res, next) => {
  const { username, imageUrl, text, category, itemId, body } = req.body;
  try {
    const notification = new Notifications({
      username: username,
      userProfileImage: imageUrl,
      text: text,
      category: category,
      itemId: itemId,
    });

    await notification.save();
    const users = await userModel.find();

    for (const user of users) {
      user.unreadNotifications.push(notification);
      await user.save();
    }

    let message = {
      to: "/topics/Netzoon",
      notification: {
        title: "Netzoon",
        body: `${username} ${body}`,
      },
      data: {
        username: username,
        imageUrl: imageUrl,
        text: text,
        category: category,
        itemId: itemId,
        body: body,
      },
    };
    FCM.send(message, function (err, resp) {
      if (err) {
        return res.status(500).send({
          message: err,
        });
      } else {
        return res.status(200).send(message.data);
      }
    });
  } catch (error) {
    throw error;
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notifications.find().sort({ createdAt: -1 });

    if (!notifications) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const { userId } = req.params;
  try {
    await userModel.findByIdAndUpdate(userId, { unreadNotifications: [] });

    return res.status(200).json("All notifications marked as read");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUnreadNotifications = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const user = await userModel
      .findById(targetUserId)
      .populate("unreadNotifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.unreadNotifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
