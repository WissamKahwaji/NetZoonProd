import mongoose from "mongoose";

const ComplaintsSchema = mongoose.Schema({

    address: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
    },

}, { timestamps: true });




export const Complaints = mongoose.model('Complaints', ComplaintsSchema);