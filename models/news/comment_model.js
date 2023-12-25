import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
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
    text: {
        type: String,
        required: true,
    },
});

export const Comment = mongoose.model("Comment", commentSchema);
