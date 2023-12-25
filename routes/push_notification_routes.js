import { getAllNotifications, getUnreadNotifications, markAllNotificationsAsRead, sendPushNotification } from '../controllers/push_notification_Ctrl.js';
import express from 'express';



const router = express.Router();

router.post('/send-notification', sendPushNotification);
router.get('/get-notification', getAllNotifications);
router.get('/get-unread-notifications/:userId', getUnreadNotifications);
router.put('/markAllNotificationsAsRead/:userId', markAllNotificationsAsRead);


export default router;
