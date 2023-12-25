import mongoose from "mongoose";


const RequestSchema = mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });



export const RequestsModel = mongoose.model('Requests', RequestSchema);