import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
});

export const Like = mongoose.model("Like", likeSchema);