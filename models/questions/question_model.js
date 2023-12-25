import mongoose from "mongoose";


const QuestionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });



export const Questions = mongoose.model('Questions', QuestionSchema);