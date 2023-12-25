import mongoose from "mongoose";


const notificationSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userProfileImage: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },

}, { timestamps: true });


export const Notifications = mongoose.model('Notifications', notificationSchema);