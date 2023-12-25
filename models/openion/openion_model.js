import mongoose from "mongoose";


const OpenionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });



export const Openions = mongoose.model('Openions', OpenionSchema);